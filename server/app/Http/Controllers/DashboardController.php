<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Plan;
use App\Models\Question;
use App\Models\Reader;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * The home dashboard numbers the server knows: totals, the current
     * week derived from the reading plan, and the most recent sign-ups.
     * Streak/consistency stats come later.
     */
    public function index()
    {
        $plan = Plan::query()->latest('starting_day')->first();

        $currentWeek = null;
        $totalWeeks = null;

        if ($plan) {
            $totalDays = count($plan->getSchedule());
            $totalWeeks = max(1, (int) ceil($totalDays / 7));
            $start = Carbon::parse($plan->starting_day)->startOfDay();
            $daysElapsed = (int) floor(
                (now()->startOfDay()->getTimestamp() - $start->getTimestamp()) / 86400
            );
            $currentWeek = min($totalWeeks, max(1, intdiv($daysElapsed, 7) + 1));
        }

        return response([
            'total_readers' => Reader::count(),
            'total_questions' => Question::count(),
            'total_groups' => Group::count(),
            'current_week' => $currentWeek,
            'total_weeks' => $totalWeeks,
            'recent_readers' => Reader::latest('created_at')
                ->take(5)
                ->get()
                ->map(fn (Reader $reader) => [
                    'id' => $reader->id,
                    'name' => $reader->name,
                    'phone' => $reader->phone_number,
                    'created_at' => $reader->created_at->toIso8601String(),
                ])
                ->values(),
        ]);
    }
}
