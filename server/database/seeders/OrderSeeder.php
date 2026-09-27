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

        $chapterIds = json_decode(
            file_get_contents(base_path('../data/bible-chronological-order.json')),
            true
        );

        $rows = array_map(fn($chapterId) => [
            'plan_id'    => $plan->id,
            'chapter_id' => $chapterId,
        ], $chapterIds);

        foreach (array_chunk($rows, 200) as $chunk) {
            DB::table('orders')->insertOrIgnore($chunk);
        }
    }
}
