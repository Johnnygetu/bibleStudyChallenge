<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        $plan = Plan::firstOrCreate(
            ['name' => 'Chronological Bible Reading'],
            [
                'no_days' => 183,
                'starting_day' => today(),
                'reading_days_per_week' => 7,
                'daily_verse_limit' => 155,
            ]
        );

        $endDate = $plan->starting_day->copy()->addMonthsNoOverflow(6);

        $plan->update([
            'no_days' => $plan->starting_day->diffInDays($endDate) + 1,
            'daily_verse_limit' => 155,
        ]);
        $plan->clearScheduleCache();
    }
}
