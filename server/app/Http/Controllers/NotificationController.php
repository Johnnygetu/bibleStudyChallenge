<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Notifications for the admin manager, newest post time first.
     */
    public function index()
    {
        $notifications = Notification::orderByDesc('post_time')->get();

        return response(['data' => $notifications]);
    }

    /**
     * Create a notification. It starts unsent, so `notification_sent`
     * is not accepted from the request and stays at its false default
     * until a later broadcast marks it delivered. When an image file is
     * uploaded it is stored on the public disk and its path is saved;
     * otherwise the image path is null.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'notification_image_path' => 'nullable|image|max:4096',
            'notification_content' => 'required|string|max:5000',
            'post_time' => 'required|date',
        ], [
            'notification_image_path.image' => 'The notification image must be a valid image file.',
            'notification_image_path.max' => 'The notification image may not be larger than 4 MB.',
            'notification_content.required' => 'Please enter the notification content.',
            'notification_content.string' => 'The notification content must be text.',
            'notification_content.max' => 'The notification content may not be longer than 5000 characters.',
            'post_time.required' => 'Please choose when the notification should be posted.',
            'post_time.date' => 'The post time must be a valid date and time.',
        ]);

        $data['notification_image_path'] = $request->hasFile('notification_image_path')
            ? $request->file('notification_image_path')->store('notifications', 'public')
            : null;

        $notification = Notification::create($data);

        return response($notification, 201);
    }

    /**
     * Remove a single notification. Admin-only manager action, so any
     * notification goes without an ownership check — but only while it is
     * still unsent. Once delivered it is history and must stay.
     */
    public function destroy(Notification $notification)
    {
        if ($notification->notification_sent) {
            return response(['message' => 'A notification that has already been sent cannot be deleted.'], 403);
        }

        $notification->delete();

        return response()->noContent();
    }
}
