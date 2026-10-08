<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\Reader;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DailyReadingBroadcastController extends Controller
{
    /**
     * Send every registered reader their reading for today over Telegram.
     *
     * The reading itself comes from the plan's shared calculation
     * (Plan::dailyReadingsFor), so it is exactly what the reader app shows:
     * same tolerance buffer, same chapter boundary, same day number.
     *
     * Readers are skipped when they have no chat_id, when the plan has not
     * started yet, or when there is nothing left for them to read.
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

        // The plan the readers are actually on: the most recently started one.
        // If none has started yet, fall back to the newest plan (a challenge
        // queued up ahead of its start date still counts as the plan).
        $plan = Plan::query()
            ->whereDate('starting_day', '<=', today())
            ->latest('starting_day')
            ->first()
            ?? Plan::query()->latest('starting_day')->first();

        if (! $plan) {
            return response()->json(['ok' => false, 'error' => 'no plan configured'], 404);
        }

        $botToken = config('services.telegram.bot_token')
            ?? env('TELEGRAM_BOT_TOKEN');

        if (! $botToken) {
            Log::error('Daily reading broadcast: bot token not configured');

            return response()->json(['ok' => false, 'error' => 'bot token not configured'], 500);
        }

        $miniAppUrl = config('services.telegram.mini_app_url')
            ?? env('TELEGRAM_MINI_APP_URL')
            ?? env('MINI_APP_URL')
            ?? config('app.url');

        if (! $miniAppUrl) {
            Log::error('Daily reading broadcast: mini app URL not configured');

            return response()->json(['ok' => false, 'error' => 'mini app url not configured'], 500);
        }

        $sendUrl = "https://api.telegram.org/bot{$botToken}/sendMessage";
        $reachable = Reader::whereNotNull('chat_id')->orderBy('id')->get();

        $sent = 0;
        $skipped = 0;
        $failed = 0;
        $results = [];

        foreach ($reachable as $reader) {
            $daily = $plan->dailyReadingsFor($reader);
            $readings = $daily['readings'];

            if (! $daily['has_started']) {
                $skipped++;
                $results[] = ['reader_id' => $reader->id, 'name' => $reader->name, 'status' => 'plan_not_started', 'days_until_start' => $daily['days_until_start']];

                continue;
            }

            if (count($readings) === 0) {
                $skipped++;
                $results[] = ['reader_id' => $reader->id, 'name' => $reader->name, 'status' => 'nothing_to_read'];

                continue;
            }

            $chapters = count($readings);
            $verses = $daily['verses_assigned'];
            $chapterWord = $chapters === 1 ? 'chapter' : 'chapters';

            $lines = [
                '📖 <b>'.e($reader->name).', here is your reading for today</b>',
                '',
                "Day {$daily['current_day']} of {$daily['total_days']} · {$chapters} {$chapterWord} · {$verses} verses",
            ];

            if ($daily['is_catch_up_mode']) {
                $lines[] = '⚡ Catch-up mode: a few extra verses today so you can get back on track.';
            }

            $lines[] = '';

            foreach ($readings as $reading) {
                $lines[] = '• '.e($reading['book']).' '.$reading['chapter_number'].' ('.$reading['num_verses'].' verses)';
            }

            $lines[] = '';
            $lines[] = 'Open your plan below to read and mark your progress.';

            try {
                $response = Http::timeout(10)->post($sendUrl, [
                    'chat_id' => $reader->chat_id,
                    'text' => implode("\n", $lines),
                    'parse_mode' => 'HTML',
                    'reply_markup' => [
                        'inline_keyboard' => [
                            [
                                [
                                    'text' => 'Open reading plan',
                                    'web_app' => ['url' => $miniAppUrl],
                                ],
                            ],
                        ],
                    ],
                ]);

                if ($response->successful()) {
                    $sent++;
                    $results[] = ['reader_id' => $reader->id, 'name' => $reader->name, 'status' => 'sent', 'chapters' => $chapters];
                } else {
                    $failed++;
                    $results[] = ['reader_id' => $reader->id, 'name' => $reader->name, 'status' => 'failed', 'error' => "telegram responded {$response->status()}: {$response->body()}"];
                    Log::error('Daily reading broadcast: sendMessage failed', [
                        'reader_id' => $reader->id,
                        'chat_id' => $reader->chat_id,
                        'status' => $response->status(),
                        'body' => $response->body(),
                    ]);
                }
            } catch (\Throwable $e) {
                $failed++;
                $results[] = ['reader_id' => $reader->id, 'name' => $reader->name, 'status' => 'failed', 'error' => $e->getMessage()];
                Log::error('Daily reading broadcast: sendMessage exception', [
                    'reader_id' => $reader->id,
                    'chat_id' => $reader->chat_id,
                    'error' => $e->getMessage(),
                ]);
            }

            // Telegram allows roughly 30 messages per second across all chats.
            usleep(50000);
        }

        $withoutChatId = Reader::whereNull('chat_id')->count();

        Log::info('Daily reading broadcast finished', [
            'plan_id' => $plan->id,
            'date' => today()->toDateString(),
            'sent' => $sent,
            'skipped' => $skipped,
            'failed' => $failed,
            'without_chat_id' => $withoutChatId,
        ]);

        return response()->json([
            'ok' => $failed === 0,
            'plan_id' => $plan->id,
            'plan_name' => $plan->name,
            'date' => today()->toDateString(),
            'readers_reached' => $reachable->count(),
            'without_chat_id' => $withoutChatId,
            'sent' => $sent,
            'skipped' => $skipped,
            'failed' => $failed,
            'results' => $results,
        ]);
    }
}
