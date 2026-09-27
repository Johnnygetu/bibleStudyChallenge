<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        Plan::firstOrCreate(
            ['name' => 'Chronological Bible Reading'],
            [
                'no_days'              => 183,
                'starting_day'         => today(),
                'reading_days_per_week' => 7,
                'daily_verse_limit'    => 176,
            ]
        );
    }
}
