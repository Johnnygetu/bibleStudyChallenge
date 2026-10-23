<?php

namespace Tests\Feature;

use App\Models\BookChapter;
use App\Models\Order;
use App\Models\Plan;
use App\Models\Reader;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StreakResetTest extends TestCase
{
    use RefreshDatabase;

    private function makeReader(string $name = 'Jane Doe'): Reader
    {
        return Reader::create([
            'name' => $name,
            'phone_number' => '+251911111111',
        ]);
    }

    /**
     * A single-chapter plan started N days ago, so day 1 is the assignment
     * that started the plan and today is day N + 1.
     */
    private function makePlanStartedDaysAgo(int $daysAgo): Plan
    {
        $plan = Plan::create([
            'name' => 'Bible Challenge',
            'no_days' => 1,
            'starting_day' => now()->subDays($daysAgo)->toDateString(),
            'daily_verse_limit' => 120,
        ]);
        $chapter = BookChapter::create([
            'book' => 'Genesis',
            'chapter_number' => 1,
            'num_verses' => 120,
        ]);
        Order::create(['plan_id' => $plan->id, 'chapter_id' => $chapter->id]);

        return $plan;
    }

    /**
     * Record the reader as having read on the given day, backdating the
     * study day like the admin override does.
     */
    private function recordReading(Reader $reader, string $date): void
    {
        $studyDay = $reader->studyDays()->make([
            'last_studied_chapter_id' => BookChapter::create([
                'book' => 'Genesis',
                'chapter_number' => 2,
                'num_verses' => 100,
            ])->id,
        ]);
        $studyDay->created_at = Carbon::parse($date);
        $studyDay->save();
    }

    public function test_zeroes_the_streak_of_a_reader_who_did_not_read_today(): void
    {
        $reader = $this->makeReader();
        $this->makePlanStartedDaysAgo(4);
        // Read yesterday, but not today: the streak still dies.
        $this->recordReading($reader, now()->subDay()->toDateString());
        $reader->streaks()->create(['count' => 5]);

        $response = $this->postJson('/api/streaks/reset-missed');

        $response->assertOk()
            ->assertJsonFragment(['reset' => 1]);
        $this->assertSame(0, $reader->streaks()->latest('id')->first()->count);
    }

    public function test_keeps_the_streak_of_a_reader_who_read_today(): void
    {
        $reader = $this->makeReader();
        $this->makePlanStartedDaysAgo(4);
        $this->recordReading($reader, today()->toDateString());
        $reader->streaks()->create(['count' => 5]);

        $response = $this->postJson('/api/streaks/reset-missed');

        $response->assertOk()
            ->assertJsonFragment(['skipped' => 1]);
        $this->assertSame(5, $reader->streaks()->latest('id')->first()->count);
    }

    public function test_creates_a_zero_row_for_a_reader_who_never_read(): void
    {
        $reader = $this->makeReader();
        $this->makePlanStartedDaysAgo(4);

        $response = $this->postJson('/api/streaks/reset-missed');

        $response->assertOk()
            ->assertJsonFragment(['created' => 1]);
        $this->assertSame(1, $reader->streaks()->count());
        $this->assertDatabaseHas('streaks', [
            'reader_id' => $reader->id,
            'count' => 0,
        ]);
    }

    public function test_adds_no_rows_for_a_reader_already_at_zero(): void
    {
        $reader = $this->makeReader();
        $this->makePlanStartedDaysAgo(4);
        $reader->streaks()->create(['count' => 0]);

        $response = $this->postJson('/api/streaks/reset-missed');

        $response->assertOk();
        $this->assertSame(1, $reader->streaks()->count());
        $this->assertSame(0, $reader->streaks()->latest('id')->first()->count);
    }

    public function test_the_reset_keeps_the_best_streak_intact(): void
    {
        $reader = $this->makeReader();
        $plan = $this->makePlanStartedDaysAgo(4);
        $reader->streaks()->createMany([
            ['count' => 3],
            ['count' => 5],
        ]);

        $this->postJson('/api/streaks/reset-missed')->assertOk();

        $this->assertSame(2, $reader->streaks()->count());

        // Daily readings report 0 today but the historical best survives.
        $readings = $this->getJson("/api/readers/{$reader->id}/plans/{$plan->id}/daily-readings");

        $readings->assertOk();
        $this->assertSame(0, $readings->json('current_streak'));
        $this->assertSame(3, $readings->json('best_streak'));
    }
}
