<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PlanController extends Controller
{
    public function updateDailyVerseLimit(Request $request, Plan $plan)
    {
        $data = $request->validate(['daily_verse_limit' => 'required|integer|min:1']);
        $plan->update($data);
        $plan->clearScheduleCache();
        $plan->update(['no_days' => count($plan->getSchedule())]);

        return $plan;
    }

    public function schedule(Plan $plan)
    {
        return response()->json([
            'plan_id' => $plan->id,
            'daily_verse_limit' => $plan->daily_verse_limit,
            'schedule' => $plan->getSchedule(),
        ]);
    }

    /**
     * Every reading day of the plan with its chapters in reading order,
     * keyed by day number — e.g. { "day1": ["Genesis 1", "Genesis 2"] }.
     *
     * @return JsonResponse
     */
    public function orders(Plan $plan)
    {
        $days = [];

        foreach ($plan->getSchedule() as $dayData) {
            $days['day'.$dayData['day']] = array_map(
                fn (array $chapter): string => "{$chapter['book']} {$chapter['chapter_number']}",
                $dayData['chapters'],
            );
        }

        return response()->json($days);
    }
}
