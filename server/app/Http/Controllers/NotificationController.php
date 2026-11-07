<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class NotificationController extends Controller
{
    /**
     * Notifications for the admin manager, newest post time first.
     */
    public function index()
    {
        Log::info('Notifications index: request received');

        $notifications = Notification::orderByDesc('post_time')->get();

        Log::info('Notifications index: loaded notifications', [
            'count' => $notifications->count(),
        ]);

        return response(['data' => $notifications]);
    }

    /**
     * Create a notification. It starts unsent, so `notification_sent`
     * is not accepted from the request and stays at its false default
     * until a later broadcast marks it delivered.
     *
     * The image arrives as a multipart file (`notification_image`). When one
     * is present it is stored on the public disk and its path is saved;
     * otherwise the image path is null.
     *
     * `post_now` asks for immediate posting; in that case the post time is not
     * sent from the form. A post-now notification is sent to the group right
     * away and the successful send is recorded on the row.
     */
    public function store(Request $request)
    {
        Log::info('Notification store: request received', [
            'has_image' => $request->hasFile('notification_image'),
            'raw_file_keys' => array_keys($_FILES ?? []),
            'content_length' => mb_strlen((string) $request->input('notification_content')),
            'post_now' => $request->input('post_now'),
            'post_time' => $request->input('post_time'),
            'upload_max_filesize' => ini_get('upload_max_filesize'),
            'post_max_size' => ini_get('post_max_size'),
        ]);

        // PHP drops the temp file for an upload that exceeds upload_max_filesize
        // but keeps the POST fields, so hasFile() is false and the image would
        // vanish without a word. Detect that invalid upload and report it.
        $uploadedImage = $request->file('notification_image');

        if ($uploadedImage instanceof UploadedFile && ! $uploadedImage->isValid()) {
            Log::error('Notification store: image upload is invalid or too large', [
                'error_code' => $uploadedImage->getError(),
                'error_message' => $uploadedImage->getErrorMessage(),
                'original_name' => $uploadedImage->getClientOriginalName(),
                'size' => $uploadedImage->getSize(),
                'upload_max_filesize' => ini_get('upload_max_filesize'),
                'post_max_size' => ini_get('post_max_size'),
            ]);

            throw ValidationException::withMessages([
                'notification_image' => $uploadedImage->getErrorMessage(),
            ]);
        }

        $data = $request->validate([
            'notification_image' => 'nullable|image|max:4096',
            'notification_content' => 'required|string|max:5000',
            'post_now' => 'nullable|boolean',
            'post_time' => 'nullable|date',
        ], [
            'notification_image.image' => 'The notification image must be a valid image file.',
            'notification_image.max' => 'The notification image may not be larger than 4 MB.',
            'notification_content.required' => 'Please enter the notification content.',
            'notification_content.string' => 'The notification content must be text.',
            'notification_content.max' => 'The notification content may not be longer than 5000 characters.',
            'post_time.date' => 'The post time must be a valid date and time.',
        ]);

        Log::info('Notification store: validation passed');

        $postNow = $request->boolean('post_now');

        // A scheduled notification needs a time; a post-now one does not.
        if (! $postNow && empty($data['post_time'])) {
            Log::warning('Notification store: scheduled notification without a post time');

            throw ValidationException::withMessages([
                'post_time' => 'Please choose when the notification should be posted.',
            ]);
        }

        unset($data['post_now'], $data['notification_image']);

        if ($request->hasFile('notification_image')) {
            $file = $request->file('notification_image');

            Log::info('Notification store: storing image', [
                'original_name' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
                'mime' => $file->getMimeType(),
            ]);

            $data['notification_image_path'] = $file->store('notifications', 'public');

            Log::info('Notification store: image stored', [
                'path' => $data['notification_image_path'],
            ]);
        } else {
            Log::info('Notification store: no image provided, storing null path');

            $data['notification_image_path'] = null;
        }

        $data['post_time'] = $postNow ? now() : $data['post_time'];

        Log::info('Notification store: creating notification', [
            'post_now' => $postNow,
            'post_time' => $data['post_time'],
            'image_path' => $data['notification_image_path'],
        ]);

        $notification = Notification::create($data);

        Log::info('Notification store: notification created', [
            'notification_id' => $notification->id,
        ]);

        // A post-now notification goes straight to the group; a successful
        // send marks it sent so it reads as delivered in the manager.
        if ($postNow) {
            Log::info('Notification store: post_now is set, sending to group', [
                'notification_id' => $notification->id,
            ]);

            if ($this->sendToGroup($notification)) {
                $notification->update(['notification_sent' => true]);

                Log::info('Notification store: notification sent and marked as sent', [
                    'notification_id' => $notification->id,
                ]);
            } else {
                Log::warning('Notification store: notification could not be sent, left unsent', [
                    'notification_id' => $notification->id,
                ]);
            }
        }

        return response($notification, 201);
    }

    /**
     * Post every unsent notification whose post time has arrived to the
     * Telegram group. Intended to be hit on a schedule: it picks up the
     * scheduled notifications the store action left unsent, sends each one,
     * and records a successful send on the row so it is not sent twice.
     */
    public function sendDue()
    {
        $due = Notification::where('notification_sent', false)
            ->where('post_time', '<=', now())
            ->orderBy('post_time')
            ->get();

        Log::info('Notifications sendDue: request received', [
            'due_count' => $due->count(),
        ]);

        $sent = 0;
        $failed = 0;
        $results = [];

        foreach ($due as $notification) {
            if ($this->sendToGroup($notification)) {
                $notification->update(['notification_sent' => true]);
                $sent++;
                $results[] = ['notification_id' => $notification->id, 'status' => 'sent'];

                Log::info('Notifications sendDue: notification sent and marked as sent', [
                    'notification_id' => $notification->id,
                ]);
            } else {
                $failed++;
                $results[] = ['notification_id' => $notification->id, 'status' => 'failed'];

                Log::warning('Notifications sendDue: notification could not be sent, left unsent', [
                    'notification_id' => $notification->id,
                ]);
            }
        }

        Log::info('Notifications sendDue: finished', [
            'due_count' => $due->count(),
            'sent' => $sent,
            'failed' => $failed,
        ]);

        return response([
            'ok' => $failed === 0,
            'due' => $due->count(),
            'sent' => $sent,
            'failed' => $failed,
            'results' => $results,
        ]);
    }

    /**
     * Post a notification to the Telegram group (TELEGRAM_GROUP_CHAT_ID).
     * With an image the content rides along as the photo caption; without
     * one it is a plain text message. Telegram caps photo captions at 1024
     * characters, so longer content is sent as its own message after the
     * photo. Best-effort: failures are logged and reported as false so the
     * notification is simply left unsent.
     */
    private function sendToGroup(Notification $notification): bool
    {
        $botToken = config('services.telegram.bot_token') ?? env('TELEGRAM_BOT_TOKEN');
        $chatId = config('services.telegram.group_chat_id') ?? env('TELEGRAM_GROUP_CHAT_ID');

        Log::info('Notification sendToGroup: starting', [
            'notification_id' => $notification->id,
            'has_bot_token' => (bool) $botToken,
            'chat_id' => $chatId,
            'has_image' => (bool) $notification->notification_image_path,
        ]);

        if (! $botToken || ! $chatId) {
            Log::error('Notification post-now: Telegram is not configured', [
                'notification_id' => $notification->id,
                'bot_token' => (bool) $botToken,
                'chat_id' => (bool) $chatId,
            ]);

            return false;
        }

        $content = (string) $notification->notification_content;
        $imagePath = $notification->notification_image_path;
        $captionsFit = mb_strlen($content) <= 1024;

        try {
            if ($imagePath) {
                $disk = Storage::disk('public');

                Log::info('Notification sendToGroup: sending photo', [
                    'notification_id' => $notification->id,
                    'path' => $imagePath,
                    'captions_fit' => $captionsFit,
                ]);

                if (! $disk->exists($imagePath)) {
                    Log::error('Notification post-now: stored image is missing', [
                        'notification_id' => $notification->id,
                        'path' => $imagePath,
                    ]);

                    return false;
                }

                $photo = Http::timeout(30)
                    ->attach('photo', $disk->get($imagePath), basename($imagePath))
                    ->post("https://api.telegram.org/bot{$botToken}/sendPhoto", array_filter([
                        'chat_id' => $chatId,
                        'caption' => $captionsFit ? $content : null,
                    ]));

                if (! $photo->successful()) {
                    Log::error('Notification post-now: sendPhoto failed', [
                        'notification_id' => $notification->id,
                        'chat_id' => $chatId,
                        'status' => $photo->status(),
                        'body' => $photo->body(),
                    ]);

                    return false;
                }

                Log::info('Notification sendToGroup: photo sent', [
                    'notification_id' => $notification->id,
                    'status' => $photo->status(),
                ]);

                // The caption limit is the only reason to follow up with text.
                if ($captionsFit) {
                    return true;
                }
            }

            Log::info('Notification sendToGroup: sending text message', [
                'notification_id' => $notification->id,
                'content_length' => mb_strlen($content),
            ]);

            $message = Http::timeout(10)->post("https://api.telegram.org/bot{$botToken}/sendMessage", [
                'chat_id' => $chatId,
                'text' => $content,
            ]);

            if (! $message->successful()) {
                Log::error('Notification post-now: sendMessage failed', [
                    'notification_id' => $notification->id,
                    'chat_id' => $chatId,
                    'status' => $message->status(),
                    'body' => $message->body(),
                ]);

                return false;
            }

            Log::info('Notification sendToGroup: text message sent', [
                'notification_id' => $notification->id,
                'status' => $message->status(),
            ]);

            return true;
        } catch (\Throwable $e) {
            Log::error('Notification post-now: Telegram send exception', [
                'notification_id' => $notification->id,
                'chat_id' => $chatId,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Remove a single notification. Admin-only manager action, so any
     * notification goes without an ownership check — but only while it is
     * still unsent. Once delivered it is history and must stay.
     */
    public function destroy(Notification $notification)
    {
        Log::info('Notification destroy: request received', [
            'notification_id' => $notification->id,
            'notification_sent' => $notification->notification_sent,
        ]);

        if ($notification->notification_sent) {
            Log::warning('Notification destroy: refused because the notification was already sent', [
                'notification_id' => $notification->id,
            ]);

            return response(['message' => 'A notification that has already been sent cannot be deleted.'], 403);
        }

        $notification->delete();

        Log::info('Notification destroy: notification deleted', [
            'notification_id' => $notification->id,
        ]);

        return response()->noContent();
    }
}
