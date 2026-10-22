<?php

namespace Tests\Feature;

use App\Models\BookChapter;
use App\Models\Order;
use App\Models\Plan;
use App\Models\Reader;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SetReaderStreakTest extends TestCase
{
    use RefreshDatabase;

    private function makeReader(): Reader
    {
        return Reader::create([
            'name' => 'Jane Doe',
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

    public function test_creates_the_first_streak_row_for_a_reader(): void
    {
        $reader = $this->makeReader();
        $this->makePlanStartedDaysAgo(15);

        $response = $this->postJson("/api/readers/{$reader->id}/set-streak", [
            'streak' => 9,
        ]);

        $response->assertOk();
        $this->assertSame(9, $response->json('streak'));
        $this->assertDatabaseHas('streaks', [
            'reader_id' => $reader->id,
            'count' => 9,
        ]);
    }

    public function test_updates_the_newest_streak_row_in_place(): void
    {
        $reader = $this->makeReader();
        $this->makePlanStartedDaysAgo(15);
        $reader->streaks()->create(['count' => 3]);

        $this->postJson("/api/readers/{$reader->id}/set-streak", [
            'streak' => 9,
        ])->assertOk();

        // One row remains — adjusting it, not stacking a value the reader
        // never earned.
        $this->assertSame(1, $reader->streaks()->count());
        $this->assertSame(9, $reader->streaks()->latest('id')->first()->count);
    }

    public function test_the_value_is_what_daily_readings_report(): void
    {
        $reader = $this->makeReader();
        $plan = $this->makePlanStartedDaysAgo(15);

        $this->postJson("/api/readers/{$reader->id}/set-streak", [
            'streak' => 12,
        ])->assertOk();

        $this->assertSame(12, $this->getJson("/api/readers/{$reader->id}/plans/{$plan->id}/daily-readings")->json('current_streak'));
    }

    public function test_rejects_a_streak_beyond_todays_plan_day(): void
    {
        // A plan started 4 days ago means today is day 5.
        $reader = $this->makeReader();
        $plan = $this->makePlanStartedDaysAgo(4);

        $this->postJson("/api/readers/{$reader->id}/set-streak", [
            'streak' => 6,
        ])->assertStatus(422)->assertJsonValidationErrors('streak');

        $this->assertSame(0, $reader->streaks()->count());

        // Exactly today's day number is allowed.
        $this->postJson("/api/readers/{$reader->id}/set-streak", [
            'streak' => 5,
        ])->assertOk();

        $this->assertSame(5, $reader->streaks()->latest('id')->first()->count);
        $this->assertSame(5, $this->getJson("/api/readers/{$reader->id}/plans/{$plan->id}/daily-readings")->json('current_streak'));
    }

    public function test_rejects_a_streak_when_no_plan_exists(): void
    {
        $reader = $this->makeReader();

        $this->postJson("/api/readers/{$reader->id}/set-streak", [
            'streak' => 3,
        ])->assertStatus(422)->assertJsonValidationErrors('streak');

        $this->assertSame(0, $reader->streaks()->count());
    }

    public function test_rejects_invalid_streak_values(): void
    {
        $reader = $this->makeReader();
        $this->makePlanStartedDaysAgo(15);

        $this->postJson("/api/readers/{$reader->id}/set-streak", [
            'streak' => -1,
        ])->assertStatus(422)->assertJsonValidationErrors('streak');

        $this->postJson("/api/readers/{$reader->id}/set-streak", [
            'streak' => 'reset',
        ])->assertStatus(422)->assertJsonValidationErrors('streak');

        $this->assertSame(0, $reader->streaks()->count());
    }
}
