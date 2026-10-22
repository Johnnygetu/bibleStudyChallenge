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
     */
    public function readers(Request $request): JsonResponse
    {
        $data = $request->validate([
            'audience' => 'nullable|string|in:all,lagging',
        ]);

        return response()->json(match ($data['audience'] ?? 'all') {
            'lagging' => $this->laggingReaders(),
            default => $this->allReaders(),
        });
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
