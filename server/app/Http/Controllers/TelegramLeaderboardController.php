<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Reader;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TelegramLeaderboardController extends Controller
{
    /**
     * Post the leaderboard to the Telegram group.
     *
     * Everything for this route lives in this one method on purpose: the
     * destination group comes from TELEGRAM_GROUP_CHAT_ID, the bot token from
     * TELEGRAM_BOT_TOKEN, and the ranking rules mirror the reader app's
     * leaderboard screen (score desc, then name) so the group sees exactly
     * the standings the app shows.
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
            Log::error('Telegram leaderboard: group chat id not configured');

            return response()->json(['ok' => false, 'error' => 'group chat id not configured'], 500);
        }

        $botToken = config('services.telegram.bot_token')
            ?? env('TELEGRAM_BOT_TOKEN');

        if (! $botToken) {
            Log::error('Telegram leaderboard: bot token not configured');

            return response()->json(['ok' => false, 'error' => 'bot token not configured'], 500);
        }

        $miniAppUrl = config('services.telegram.mini_app_url')
            ?? env('TELEGRAM_MINI_APP_URL')
            ?? env('MINI_APP_URL')
            ?? config('app.url');

        // Readers ranked the way the leaderboard screen ranks them: total score
        // desc, name asc. Kept whole so the group standings below can reuse the
        // same totals; only the top ten go into the message.
        $ranked = Reader::withSum('scores as total_score', 'score')
            ->withMax('streaks as current_streak', 'count')
            ->get()
            ->map(fn (Reader $reader) => [
                'reader_id' => $reader->id,
                'name' => $reader->name,
                'total_score' => (int) ($reader->total_score ?? 0),
                'current_streak' => (int) ($reader->current_streak ?? 0),
            ])
            ->sortBy([
                ['total_score', 'desc'],
                ['name', 'asc'],
            ])
            ->values();

        if ($ranked->isEmpty()) {
            return response()->json([
                'ok' => true,
                'sent' => false,
                'chat_id' => $chatId,
                'date' => today()->toDateString(),
                'reason' => 'leaderboard is empty',
            ]);
        }

        $topReaders = $ranked->take(10);

        // Group standings: the sum of each group's members' scores. Groups with
        // no members are left out — a row of zeroes is noise in the message.
        $scoreByReader = $ranked->keyBy('reader_id');
        $memberships = DB::table('members')->get(['group_id', 'reader_id']);

        $topGroups = Group::withCount('readers')
            ->get()
            ->map(function (Group $group) use ($memberships, $scoreByReader) {
                $members = $memberships
                    ->where('group_id', $group->id)
                    ->pluck('reader_id')
                    ->map(fn ($id) => $scoreByReader->get($id))
                    ->filter();

                $total = (int) $members->sum('total_score');

                return [
                    'group_name' => $group->name,
                    'members_count' => $group->readers_count,
                    'total_score' => $total,
                    'avg_score' => $members->count() > 0
                        ? round($total / $members->count(), 1)
                        : 0,
                ];
            })
            ->filter(fn (array $group) => $group['members_count'] > 0)
            ->sortBy([
                ['total_score', 'desc'],
                ['group_name', 'asc'],
            ])
            ->values()
            ->take(5);

        $lines = [
            '🏆 <b>Bible Challenge leaderboard</b>',
            '<i>'.now()->format('l, F j').'</i>',
            '',
            '<b>Top readers</b>',
        ];

        foreach ($topReaders as $index => $reader) {
            $lines[] = ($index + 1).'. '.e($reader['name']).' — '.$reader['total_score'].' pts · '.$reader['current_streak'].'-day streak';
        }

        if ($topGroups->isNotEmpty()) {
            $lines[] = '';
            $lines[] = '<b>Top groups</b>';

            foreach ($topGroups as $index => $group) {
                $lines[] = ($index + 1).'. '.e($group['group_name']).' — '.$group['total_score'].' pts · '.$group['members_count'].' member'.($group['members_count'] === 1 ? '' : 's').' (avg '.$group['avg_score'].')';
            }
        }

        $lines[] = '';
        $lines[] = 'Open the app to see the full leaderboard.';

        $text = implode("\n", $lines);

        $payload = [
            'chat_id' => $chatId,
            'text' => $text,
            'parse_mode' => 'HTML',
        ];

        if ($miniAppUrl) {
            $payload['reply_markup'] = [
                'inline_keyboard' => [
                    [
                        [
                            'text' => 'Open leaderboard',
                            'web_app' => ['url' => $miniAppUrl],
                        ],
                    ],
                ],
            ];
        }

        try {
            $response = Http::timeout(10)->post("https://api.telegram.org/bot{$botToken}/sendMessage", $payload);

            if (! $response->successful()) {
                Log::error('Telegram leaderboard: sendMessage failed', [
                    'chat_id' => $chatId,
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return response()->json([
                    'ok' => false,
                    'sent' => false,
                    'chat_id' => $chatId,
                    'error' => 'failed to send leaderboard',
                ], 500);
            }
        } catch (\Throwable $e) {
            Log::error('Telegram leaderboard: sendMessage exception', [
                'chat_id' => $chatId,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'ok' => false,
                'sent' => false,
                'chat_id' => $chatId,
                'error' => 'failed to send leaderboard',
            ], 500);
        }

        Log::info('Telegram leaderboard sent', [
            'chat_id' => $chatId,
            'readers_ranked' => $ranked->count(),
            'groups_ranked' => $topGroups->count(),
        ]);

        return response()->json([
            'ok' => true,
            'sent' => true,
            'chat_id' => $chatId,
            'date' => today()->toDateString(),
            'readers_ranked' => $ranked->count(),
            'groups_ranked' => $topGroups->count(),
            'message' => $text,
        ]);
    }
}
