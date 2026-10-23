<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\Reader;
use App\Models\StudyDay;
use Illuminate\Http\JsonResponse;

class StreakResetController extends Controller
{
    /**
     * Zero the streak of every reader who did not read today.
     *
     * A reading day starts when saveProgress records the reader's first
     * study day, so "did not read" means the reader has no study day for
     * today. Each such reader loses their streak while their historical
     * best is preserved: the newest streak row is pointed at 0 in place,
     * exactly like the admin set-streak override, and a row with count 0
     * is created for the reader who has none yet.
     *
     * The next time the reader saves progress on a new day, saveProgress
     * picks the 0 row back up and the streak counts 1 from there.
     *
     * Result statuses: read_today (streak untouched), reset (was above
     * zero, zeroed in place), created_zero_row (no row existed yet) and
     * already_zero (nothing needed).
     */
    public function __invoke(): JsonResponse
    {
        // With no plan nobody can read anything, so zeroing streaks would
        // only punish misconfiguration.
        if (! Plan::current()) {
            return response()->json(['ok' => false, 'error' => 'no plan configured'], 404);
        }

        $readToday = StudyDay::whereDate('created_at', today())
            ->pluck('reader_id')
            ->unique();

        $reset = 0;
        $created = 0;
        $skipped = 0;
        $results = [];

        foreach (Reader::orderBy('id')->get() as $reader) {
            if ($readToday->contains($reader->id)) {
                $skipped++;
                $results[] = ['reader_id' => $reader->id, 'name' => $reader->name, 'status' => 'read_today'];

                continue;
            }

            $streak = $reader->streaks()->latest('id')->first();

            if ($streak) {
                if ($streak->count === 0) {
                    $results[] = ['reader_id' => $reader->id, 'name' => $reader->name, 'status' => 'already_zero'];

                    continue;
                }

                $streak->update(['count' => 0]);
                $reset++;
                $results[] = ['reader_id' => $reader->id, 'name' => $reader->name, 'status' => 'reset'];

                continue;
            }

            $reader->streaks()->create(['count' => 0]);
            $created++;
            $results[] = ['reader_id' => $reader->id, 'name' => $reader->name, 'status' => 'created_zero_row'];
        }

        return response()->json([
            'ok' => true,
            'date' => today()->toDateString(),
            'reset' => $reset,
            'created' => $created,
            'skipped' => $skipped,
            'results' => $results,
        ]);
    }
}
