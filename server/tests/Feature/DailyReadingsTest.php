<?php

namespace Tests\Feature;

use App\Models\BookChapter;
use App\Models\Order;
use App\Models\Plan;
use App\Models\Reader;
use App\Models\Score;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DailyReadingsTest extends TestCase
{
    use RefreshDatabase;

    private function makePlan(string $startingDay): Plan
    {
        $plan = Plan::create([
            'name' => 'Bible Challenge',
            'no_days' => 30,
            'starting_day' => $startingDay,
            'daily_verse_limit' => 100,
        ]);

        $chapter = BookChapter::create([
            'book' => 'Genesis',
            'chapter_number' => 1,
            'num_verses' => 31,
        ]);

        Order::create([
            'plan_id' => $plan->id,
            'chapter_id' => $chapter->id,
        ]);

        return $plan;
    }

    private function makeReader(): Reader
    {
        return Reader::create([
            'name' => 'Jane Doe',
            'phone_number' => '+251911111111',
        ]);
    }

    public function test_counts_down_days_until_the_plan_starts(): void
    {
        $reader = $this->makeReader();
        $plan = $this->makePlan(now()->addDays(5)->toDateString());

        $response = $this->getJson("/api/readers/{$reader->id}/plans/{$plan->id}/daily-readings");

        $response->assertOk()
            ->assertJsonFragment(['days_until_start' => 5])
            ->assertJsonFragment(['has_started' => false])
            ->assertJsonFragment(['starting_day' => now()->addDays(5)->toDateString()]);
    }

    public function test_reports_started_once_the_start_date_arrives(): void
    {
        $reader = $this->makeReader();
        $plan = $this->makePlan(now()->subDays(3)->toDateString());

        $response = $this->getJson("/api/readers/{$reader->id}/plans/{$plan->id}/daily-readings");

        $response->assertOk()
            ->assertJsonFragment(['days_until_start' => 0])
            ->assertJsonFragment(['has_started' => true]);
    }

    public function test_starting_today_counts_as_started(): void
    {
        $reader = $this->makeReader();
        $plan = $this->makePlan(now()->toDateString());

        $response = $this->getJson("/api/readers/{$reader->id}/plans/{$plan->id}/daily-readings");

        $response->assertOk()
            ->assertJsonFragment(['days_until_start' => 0])
            ->assertJsonFragment(['has_started' => true]);
    }

    public function test_reports_that_todays_quiz_has_not_been_submitted(): void
    {
        $reader = $this->makeReader();
        $plan = $this->makePlan(now()->subDay()->toDateString());

        $this->getJson("/api/readers/{$reader->id}/plans/{$plan->id}/daily-readings")
            ->assertOk()
            ->assertJsonFragment(['has_submitted_quiz_today' => false]);
    }

    public function test_reports_that_todays_quiz_has_been_submitted(): void
    {
        $reader = $this->makeReader();
        $plan = $this->makePlan(now()->subDay()->toDateString());

        // A score belonging to an earlier day is that day's, not today's.
        $yesterdaysScore = $reader->scores()->create(['score' => 2]);
        Score::whereKey($yesterdaysScore->id)->update(['created_at' => now()->subDay()]);

        $url = "/api/readers/{$reader->id}/plans/{$plan->id}/daily-readings";

        $this->getJson($url)
            ->assertOk()
            ->assertJsonFragment(['has_submitted_quiz_today' => false]);

        $reader->scores()->create(['score' => 3]);

        $this->getJson($url)
            ->assertOk()
            ->assertJsonFragment(['has_submitted_quiz_today' => true]);
    }
}
