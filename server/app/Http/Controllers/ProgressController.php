<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\Reader;
use Illuminate\Support\Carbon;

class ProgressController extends Controller
{
    /**
     * Per-reader reading progress for the admin board. Days done/missed
     * come from the plan's lag logic (study-day position vs schedule);
     * streaks are runs of consecutive study days.
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
        $todayIndex = $this->dayIndex(now()->toDateString());

        $readers = Reader::orderBy('name')
            ->get()
            ->map(function (Reader $reader) use ($plan, $dayTargets, $totalDays, $todayIndex) {
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

                [$currentStreak, $longestStreak] = $this->streaksFor($reader, $todayIndex);

                return [
                    'reader_id' => $reader->id,
                    'name' => $reader->name,
                    'phone' => $reader->phone_number,
                    'days_done' => $daysDone,
                    'total_days' => $totalDays,
                    'days_missed' => $daysMissed,
                    'current_day' => $lag['current_day_number'],
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

    /**
     * Current streak (run reaching today or yesterday) and longest streak
     * over the reader's study days.
     */
    private function streaksFor(Reader $reader, int $todayIndex): array
    {
        $indexes = $reader->studyDays()
            ->pluck('created_at')
            ->map(fn ($createdAt) => $this->dayIndex(Carbon::parse($createdAt)->toDateString()))
            ->unique()
            ->sort()
            ->values();

        if ($indexes->isEmpty()) {
            return [0, 0];
        }

        $run = 0;
        $longest = 0;
        $previous = null;

        foreach ($indexes as $index) {
            $run = ($previous !== null && $index === $previous + 1) ? $run + 1 : 1;
            $longest = max($longest, $run);
            $previous = $index;
        }

        $current = ($previous === $todayIndex || $previous === $todayIndex - 1) ? $run : 0;

        return [$current, $longest];
    }

    /**
     * Days since epoch for a date, forced to UTC so runs never break on DST.
     */
    private function dayIndex(string $date): int
    {
        return (int) floor(strtotime($date.' UTC') / 86400);
    }
}
