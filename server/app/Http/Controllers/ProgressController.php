<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\Reader;

class ProgressController extends Controller
{
    /**
     * Per-reader reading progress for the admin board. Days done/missed come
     * from the plan's lag logic (study-day position vs schedule); the streak
     * columns are what the `streaks` table holds — matching the reader app,
     * so a manual adjustment is visible right away.
     */
    public function index()
    {
        $plan = Plan::query()->latest('starting_day')->first();

        if (! $plan) {
            return response(['plan' => null, 'readers' => []]);
        }

        $schedule = $plan->getSchedule();
        $totalDays = count($schedule);
        $dayTargets = array_map(
            fn (array $day) => end($day['chapters'])['order_id'],
            $schedule,
        );

        $readers = Reader::orderBy('name')
            ->get()
            ->map(function (Reader $reader) use ($plan, $dayTargets, $totalDays) {
                $lag = $plan->lagFor($reader);
                $actualOrderId = $lag['actual_order_id'];

                // A day counts as done once every chapter of that day has
                // been studied.
                $daysDone = 0;
                foreach ($dayTargets as $targetOrderId) {
                    if ($targetOrderId > $actualOrderId) {
                        break;
                    }
                    $daysDone++;
                }

                $daysMissed = $lag['is_lagging']
                    ? max(0, $lag['target_day_number'] - $daysDone)
                    : 0;

                // The streak columns mirror the `streaks` rows, exactly what
                // the reader app reports, so a manual adjustment shows here
                // the moment it is made.
                $latestStreak = $reader->streaks()->latest('id')->first();
                $currentStreak = $latestStreak?->count ?? 0;
                $longestStreak = $reader->streaks()->max('count') ?? 0;

                return [
                    'reader_id' => $reader->id,
                    'name' => $reader->name,
                    'phone' => $reader->phone_number,
                    'days_done' => $daysDone,
                    'total_days' => $totalDays,
                    'days_missed' => $daysMissed,
                    'current_day' => $lag['current_day_number'],
                    'current_order_id' => $actualOrderId,
                    'last_read_day' => $daysDone > 0 ? $daysDone : null,
                    'current_streak' => $currentStreak,
                    'longest_streak' => $longestStreak,
                ];
            })
            ->values();

        return response([
            'plan' => [
                'id' => $plan->id,
                'name' => $plan->name,
                'total_days' => $totalDays,
            ],
            'readers' => $readers,
        ]);
    }
}
