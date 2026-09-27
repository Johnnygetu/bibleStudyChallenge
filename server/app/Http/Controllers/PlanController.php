<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\Request;

class PlanController extends Controller
{
    public function updateDailyVerseLimit(Request $request, Plan $plan)
    {
        $data = $request->validate(['daily_verse_limit' => 'required|integer|min:1']);
        $plan->update($data);
        $plan->clearScheduleCache();
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
}
