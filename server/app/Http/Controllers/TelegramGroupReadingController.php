<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TelegramGroupReadingController extends Controller
{
    /**
     * Post today's reading plan to the Telegram group.
     *
     * The announcement is about the plan, not about one reader: it lists the
     * chapters the schedule puts on today (the same schedule the reader app
     * and the daily broadcast use), so the whole group sees one shared reading
     * for the day.
     *
     * The destination group comes from TELEGRAM_GROUP_CHAT_ID, the bot token
     * from TELEGRAM_BOT_TOKEN.
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

        $chatId = config('services.telegram.group_chat_id')
            ?? env('TELEGRAM_GROUP_CHAT_ID');

        if (! $chatId) {
            Log::error('Telegram group reading: group chat id not configured');

            return response()->json(['ok' => false, 'error' => 'group chat id not configured'], 500);
        }

        $botToken = config('services.telegram.bot_token')
            ?? env('TELEGRAM_BOT_TOKEN');

        if (! $botToken) {
            Log::error('Telegram group reading: bot token not configured');

            return response()->json(['ok' => false, 'error' => 'bot token not configured'], 500);
        }

        $plan = Plan::current();

        if (! $plan) {
            return response()->json(['ok' => false, 'error' => 'no plan configured'], 404);
        }

        $schedule = $plan->getSchedule();

        if ($schedule === []) {
            return response()->json([
                'ok' => true,
                'sent' => false,
                'chat_id' => $chatId,
                'plan_id' => $plan->id,
                'date' => today()->toDateString(),
                'reason' => 'the plan has no chapters',
            ]);
        }

        // Same day arithmetic as the plan's lag logic: day 1 is the plan's
        // starting day, so a plan that has not started yet has no reading and
        // one that has run out of days has nothing left to announce.
        $dayNumber = (int) $plan->starting_day->startOfDay()->diffInDays(now()->startOfDay()) + 1;

        if ($dayNumber < 1) {
            return response()->json([
                'ok' => true,
                'sent' => false,
                'chat_id' => $chatId,
                'plan_id' => $plan->id,
                'date' => today()->toDateString(),
                'reason' => 'the plan has not started yet',
                'days_until_start' => abs($dayNumber - 1),
            ]);
        }

        $totalDays = count($schedule);

        if ($dayNumber > $totalDays) {
            return response()->json([
                'ok' => true,
                'sent' => false,
                'chat_id' => $chatId,
                'plan_id' => $plan->id,
                'date' => today()->toDateString(),
                'reason' => 'the plan is finished',
            ]);
        }

        $reading = $schedule[$dayNumber - 1];
        $chapters = $reading['chapters'];
        $chapterCount = count($chapters);

        $lines = [
            '📖 <b>'.e($plan->name).' — today\'s reading</b>',
            '<i>'.now()->format('l, F j').'</i>',
            '',
            "Day {$reading['day']} of {$totalDays} · {$chapterCount} ".($chapterCount === 1 ? 'chapter' : 'chapters')." · {$reading['total_verses']} verses",
            '',
        ];

        foreach ($chapters as $chapter) {
            $lines[] = '• '.e($chapter['book']).' '.$chapter['chapter_number'].' ('.$chapter['num_verses'].' verses)';
        }

        $lines[] = '';
        $lines[] = 'Open the app to read and mark your progress.';

        $text = implode("\n", $lines);

        $payload = [
            'chat_id' => $chatId,
            'text' => $text,
            'parse_mode' => 'HTML',
        ];

        $miniAppUrl = config('services.telegram.mini_app_url')
            ?? env('TELEGRAM_MINI_APP_URL')
            ?? env('MINI_APP_URL')
            ?? config('app.url');

        if ($miniAppUrl) {
            $payload['reply_markup'] = [
                'inline_keyboard' => [
                    [
                        [
                            'text' => 'Open reading plan',
                            'web_app' => ['url' => $miniAppUrl],
                        ],
                    ],
                ],
            ];
        }

        try {
            $response = Http::timeout(10)->post("https://api.telegram.org/bot{$botToken}/sendMessage", $payload);

            if (! $response->successful()) {
                Log::error('Telegram group reading: sendMessage failed', [
                    'chat_id' => $chatId,
                    'plan_id' => $plan->id,
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return response()->json([
                    'ok' => false,
                    'sent' => false,
                    'chat_id' => $chatId,
                    'error' => 'failed to send reading plan',
                ], 500);
            }
        } catch (\Throwable $e) {
            Log::error('Telegram group reading: sendMessage exception', [
                'chat_id' => $chatId,
                'plan_id' => $plan->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'ok' => false,
                'sent' => false,
                'chat_id' => $chatId,
                'error' => 'failed to send reading plan',
            ], 500);
        }

        Log::info('Telegram group reading sent', [
            'chat_id' => $chatId,
            'plan_id' => $plan->id,
            'day' => $reading['day'],
            'chapters' => $chapterCount,
        ]);

        return response()->json([
            'ok' => true,
            'sent' => true,
            'chat_id' => $chatId,
            'plan_id' => $plan->id,
            'plan_name' => $plan->name,
            'date' => today()->toDateString(),
            'day' => $reading['day'],
            'total_days' => $totalDays,
            'chapters' => $chapterCount,
            'verses' => $reading['total_verses'],
            'message' => $text,
        ]);
    }
}
