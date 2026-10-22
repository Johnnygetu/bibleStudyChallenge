<?php

namespace Tests\Feature;

use App\Models\BookChapter;
use App\Models\Order;
use App\Models\Plan;
use App\Models\Reader;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReaderProgressTest extends TestCase
{
    use RefreshDatabase;

    private function makePlan(): void
    {
        $plan = Plan::create([
            'name' => 'Bible Challenge',
            'no_days' => 1,
            'starting_day' => now()->subDays(3)->toDateString(),
            'daily_verse_limit' => 120,
        ]);
        $chapter = BookChapter::create([
            'book' => 'Genesis',
            'chapter_number' => 1,
            'num_verses' => 120,
        ]);
        Order::create(['plan_id' => $plan->id, 'chapter_id' => $chapter->id]);
    }

    public function test_the_board_reports_the_streaks_table_values(): void
    {
        $reader = Reader::create([
            'name' => 'Jane Doe',
            'phone_number' => '+251911111101',
        ]);

        // Study days a run count would read as 3 consecutive days, while the
        // streak table holds a different (manually adjusted) value — the
        // board must show the table, nothing else.
        $this->makePlan();
        $chapter = BookChapter::first();

        foreach ([3, 2, 1] as $daysAgo) {
            $reader->studyDays()->create(['last_studied_chapter_id' => $chapter->id])
                ->forceFill([
                    'created_at' => now()->subDays($daysAgo),
                    'updated_at' => now()->subDays($daysAgo),
                ])
                ->save();
        }

        $reader->streaks()->create(['count' => 9]);

        $row = $this->getJson('/api/progress')->json('readers.0');

        $this->assertSame(9, $row['current_streak']);
        $this->assertSame(9, $row['longest_streak']);
    }

    public function test_a_reader_without_streak_rows_reports_zero(): void
    {
        $this->makePlan();

        Reader::create([
            'name' => 'John Roe',
            'phone_number' => '+251911111102',
        ]);

        $row = $this->getJson('/api/progress')->json('readers.0');

        $this->assertSame(0, $row['current_streak']);
        $this->assertSame(0, $row['longest_streak']);
    }
}
