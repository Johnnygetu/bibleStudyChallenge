<?php

namespace App\Http\Controllers;

use App\Models\Group;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TelegramGroupMembersController extends Controller
{
    /**
     * Send every church member in a group a Telegram message listing who else
     * is in their group and who leads it.
     *
     * Groups are walked one by one and each of their church-member readers is
     * messaged individually, so everyone learns the same roster. Readers
     * without a chat_id are skipped.
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
            Log::error('Telegram group members: bot token not configured');

            return response()->json(['ok' => false, 'error' => 'bot token not configured'], 500);
        }

        $sendUrl = "https://api.telegram.org/bot{$botToken}/sendMessage";
        $groups = Group::with('readers')->get();

        $sent = 0;
        $skipped = 0;
        $failed = 0;
        $results = [];

        foreach ($groups as $group) {
            $members = $group->readers;
            $leader = $members->firstWhere('pivot.is_leader', true);

            // Everyone in the group sees the same roster; the leader is called
            // out on their own line and again next to their name below.
            $lines = [
                '👥 <b>'.e($group->name).'</b>',
                '',
                'Leader: '.($leader ? '<b>'.e($leader->name).'</b>' : '<i>not set</i>'),
                '',
                'Members:',
            ];

            foreach ($members as $member) {
                $lines[] = '• '.e($member->name).($member->pivot->is_leader ? ' (leader)' : '');
            }

            $text = implode("\n", $lines);

            foreach ($members as $member) {
                if (! $member->is_church_member) {
                    continue;
                }

                if (! $member->chat_id) {
                    $skipped++;
                    $results[] = ['reader_id' => $member->id, 'name' => $member->name, 'group_id' => $group->id, 'status' => 'no_chat_id'];

                    continue;
                }

                try {
                    $response = Http::timeout(10)->post($sendUrl, [
                        'chat_id' => $member->chat_id,
                        'text' => $text,
                        'parse_mode' => 'HTML',
                    ]);

                    if ($response->successful()) {
                        $sent++;
                        $results[] = ['reader_id' => $member->id, 'name' => $member->name, 'group_id' => $group->id, 'status' => 'sent'];
                    } else {
                        $failed++;
                        $results[] = ['reader_id' => $member->id, 'name' => $member->name, 'group_id' => $group->id, 'status' => 'failed', 'error' => "telegram responded {$response->status()}: {$response->body()}"];
                        Log::error('Telegram group members: sendMessage failed', [
                            'reader_id' => $member->id,
                            'chat_id' => $member->chat_id,
                            'status' => $response->status(),
                            'body' => $response->body(),
                        ]);
                    }
                } catch (\Throwable $e) {
                    $failed++;
                    $results[] = ['reader_id' => $member->id, 'name' => $member->name, 'group_id' => $group->id, 'status' => 'failed', 'error' => $e->getMessage()];
                    Log::error('Telegram group members: sendMessage exception', [
                        'reader_id' => $member->id,
                        'chat_id' => $member->chat_id,
                        'error' => $e->getMessage(),
                    ]);
                }

                // Telegram allows roughly 30 messages per second across all chats.
                usleep(50000);
            }
        }

        Log::info('Telegram group members broadcast finished', [
            'groups' => $groups->count(),
            'sent' => $sent,
            'skipped' => $skipped,
            'failed' => $failed,
        ]);

        return response()->json([
            'ok' => $failed === 0,
            'groups' => $groups->count(),
            'sent' => $sent,
            'skipped' => $skipped,
            'failed' => $failed,
            'results' => $results,
        ]);
    }
}
