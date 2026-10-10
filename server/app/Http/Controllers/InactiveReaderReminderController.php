<?php

namespace App\Http\Controllers;

use App\Models\Reader;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class InactiveReaderReminderController extends Controller
{
    /**
     * How many days without reading before a reader counts as inactive.
     */
    private const DEFAULT_INACTIVE_DAYS = 7;

    /**
     * Nudge every reachable reader who has not read for about a week to come back.
     *
     * A reader counts as inactive when their most recent study day is older than
     * the threshold. Readers who have never studied are measured from the day
     * they signed up, so a sign-up that goes quiet is nudged too. Readers with
     * no chat_id cannot be reached and are skipped.
     *
     * Protect it with TELEGRAM_BROADCAST_TOKEN when it is reachable from the
     * open internet — the route has no other authentication.
     */
    public function __invoke(Request $request): JsonResponse
    {
        $broadcastToken = config('services.telegram.broadcast_token');

        if ($broadcastToken && ! hash_equals((string) $broadcastToken, (string) ($request->header('X-Broadcast-Token') ?? $request->input('token')))) {
            return response()->json(['ok' => false, 'error' => 'invalid broadcast token'], 401);
        }

        $botToken = config('services.telegram.bot_token')
            ?? env('TELEGRAM_BOT_TOKEN');

        if (! $botToken) {
            Log::error('Inactive reader reminder: bot token not configured');

            return response()->json(['ok' => false, 'error' => 'bot token not configured'], 500);
        }

        $miniAppUrl = config('services.telegram.mini_app_url')
            ?? env('TELEGRAM_MINI_APP_URL')
            ?? env('MINI_APP_URL')
            ?? config('app.url');

        if (! $miniAppUrl) {
            Log::error('Inactive reader reminder: mini app URL not configured');

            return response()->json(['ok' => false, 'error' => 'mini app url not configured'], 500);
        }

        // Callers may tune the window (e.g. ?days=10), but a sane default of one
        // week applies when they do not.
        $inactiveDays = max(1, (int) $request->input('days', self::DEFAULT_INACTIVE_DAYS));
        $cutoff = now()->subDays($inactiveDays);

        $reachable = Reader::whereNotNull('chat_id')
            ->withMax('studyDays as last_read_at', 'created_at')
            ->orderBy('id')
            ->get();

        $sendUrl = "https://api.telegram.org/bot{$botToken}/sendMessage";

        $sent = 0;
        $failed = 0;
        $skipped = 0;
        $results = [];

        foreach ($reachable as $reader) {
            // Never read: measure from sign-up instead of the database default.
            $lastActive = $reader->last_read_at
                ? Carbon::parse($reader->last_read_at)
                : $reader->created_at;

            if ($lastActive->gte($cutoff)) {
                $skipped++;
                $results[] = [
                    'reader_id' => $reader->id,
                    'name' => $reader->name,
                    'status' => 'active',
                    'last_read_at' => $lastActive->toDateString(),
                ];

                continue;
            }

            $daysInactive = (int) $lastActive->diffInDays(now());

            $lines = [
                '👋 <b>'.e($reader->name).', we miss you!</b>',
                '',
                "You have not opened your Bible study plan for {$daysInactive} days.",
                'Your reading is waiting — pick up right where you left off and keep your streak alive.',
                '',
                'Come back today and stay in the Word. 🙏',
            ];

            try {
                $response = Http::timeout(10)->post($sendUrl, [
                    'chat_id' => $reader->chat_id,
                    'text' => implode("\n", $lines),
                    'parse_mode' => 'HTML',
                    'reply_markup' => [
                        'inline_keyboard' => [
                            [
                                [
                                    'text' => 'Continue reading',
                                    'web_app' => ['url' => $miniAppUrl],
                                ],
                            ],
                        ],
                    ],
                ]);

                if ($response->successful()) {
                    $sent++;
                    $results[] = [
                        'reader_id' => $reader->id,
                        'name' => $reader->name,
                        'status' => 'sent',
                        'days_inactive' => $daysInactive,
                    ];
                } else {
                    $failed++;
                    $results[] = [
                        'reader_id' => $reader->id,
                        'name' => $reader->name,
                        'status' => 'failed',
                        'error' => "telegram responded {$response->status()}: {$response->body()}",
                    ];
                    Log::error('Inactive reader reminder: sendMessage failed', [
                        'reader_id' => $reader->id,
                        'chat_id' => $reader->chat_id,
                        'status' => $response->status(),
                        'body' => $response->body(),
                    ]);
                }
            } catch (\Throwable $e) {
                $failed++;
                $results[] = [
                    'reader_id' => $reader->id,
                    'name' => $reader->name,
                    'status' => 'failed',
                    'error' => $e->getMessage(),
                ];
                Log::error('Inactive reader reminder: sendMessage exception', [
                    'reader_id' => $reader->id,
                    'chat_id' => $reader->chat_id,
                    'error' => $e->getMessage(),
                ]);
            }

            // Telegram allows roughly 30 messages per second across all chats.
            usleep(50000);
        }

        $withoutChatId = Reader::whereNull('chat_id')->count();

        Log::info('Inactive reader reminder finished', [
            'date' => today()->toDateString(),
            'inactive_days' => $inactiveDays,
            'sent' => $sent,
            'skipped' => $skipped,
            'failed' => $failed,
            'without_chat_id' => $withoutChatId,
        ]);

        return response()->json([
            'ok' => $failed === 0,
            'date' => today()->toDateString(),
            'inactive_days' => $inactiveDays,
            'readers_reached' => $reachable->count(),
            'without_chat_id' => $withoutChatId,
            'sent' => $sent,
            'skipped' => $skipped,
            'failed' => $failed,
            'results' => $results,
        ]);
    }
}
