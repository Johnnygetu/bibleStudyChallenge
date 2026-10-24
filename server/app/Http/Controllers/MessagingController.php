<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\Reader;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessagingController extends Controller
{
    /**
     * Recipients for the mobile app's Send To picker.
     *
     * The app asks for an audience: `all` returns every reader, `lagging`
     * returns only the readers whose reading position is behind the current
     * plan's schedule. Both lists carry the same recipient columns, and the
     * lagging list adds how far behind each reader sits so the message can
     * quote the gap.
     *
     * With demo mode on (IS_DEMO_MODE), whatever the audience asks for, the
     * picker answers with the tester chat ids of the reader app's
     * `canTestFeature.js` alone — a blast submitted while demoing never
     * collects a real reader's phone number.
     */
    public function readers(Request $request): JsonResponse
    {
        $data = $request->validate([
            'audience' => 'nullable|string|in:all,lagging',
        ]);

        if (config('demo.enabled')) {
            return response()->json($this->demoReaders());
        }

        return response()->json(match ($data['audience'] ?? 'all') {
            'lagging' => $this->laggingReaders(),
            default => $this->allReaders(),
        });
    }

    /**
     * The tester readers demo mode limits messaging to: the readers whose
     * chat id is in the reader app's canTestFeature list.
     */
    private function demoReaders(): array
    {
        $chatIds = collect(config('demo.chat_ids'))
            ->map(fn ($chatId) => (int) $chatId)
            ->all();

        return Reader::whereIn('chat_id', $chatIds)
            ->orderBy('name')
            ->get()
            ->map(fn (Reader $reader) => $this->recipientColumns($reader))
            ->all();
    }

    /**
     * Every reader, ordered by name for a stable list.
     */
    private function allReaders(): array
    {
        return Reader::orderBy('name')
            ->get()
            ->map(fn (Reader $reader) => $this->recipientColumns($reader))
            ->all();
    }

    /**
     * The readers the plan's shared lag logic flags as behind.
     */
    private function laggingReaders(): array
    {
        $plan = Plan::current();

        if (! $plan) {
            return [];
        }

        $lagging = [];

        foreach (Reader::orderBy('name')->get() as $reader) {
            $lag = $plan->lagFor($reader);

            if (! $lag['is_lagging']) {
                continue;
            }

            $lagging[] = $this->recipientColumns($reader) + [
                'current_day' => $lag['current_day_number'],
                'lagging_chapters' => $lag['lagging_chapters'],
                'lagging_verses' => $lag['lagging_verses'],
            ];
        }

        return $lagging;
    }

    /**
     * The columns every recipient list is built from — who the reader is and
     * how the app can reach them.
     *
     * @return array{id: int, name: string, phone_number: string, chat_id: int|null}
     */
    private function recipientColumns(Reader $reader): array
    {
        return [
            'id' => $reader->id,
            'name' => $reader->name,
            'phone_number' => $reader->phone_number,
            'chat_id' => $reader->chat_id,
        ];
    }
}
