<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $plan = Plan::where('name', 'Chronological Bible Reading')->firstOrFail();

        $jsonPath = database_path('data/bible-chronological-order.json');

        if (! file_exists($jsonPath)) {
            $this->command->error("Bible chronological order file not found at: {$jsonPath}");

            return;
        }

        $chapterIds = json_decode(file_get_contents($jsonPath), true);

        $rows = array_map(fn ($chapterId) => [
            'plan_id' => $plan->id,
            'chapter_id' => $chapterId,
            'created_at' => now(),
            'updated_at' => now(),
        ], $chapterIds);

        foreach (array_chunk($rows, 200) as $chunk) {
            DB::table('orders')->insertOrIgnore($chunk);
        }

        // Keep the plan's stored duration aligned with the groups generated
        // from its verse limit (including the final short group).
        $plan->clearScheduleCache();
        $plan->update(['no_days' => count($plan->getSchedule())]);

        $this->command->info('Seeded '.count($rows).' chronological orders.');
    }
}
