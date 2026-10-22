<?php

namespace Tests\Feature;

use App\Models\BookChapter;
use App\Models\Order;
use App\Models\Plan;
use App\Models\Reader;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Tests\TestCase;

class SetReaderProgressTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A plan where every chapter is its own day (120 verses, limit 120), so
     * the schedule is exactly one chapter per day. Returns [plan, orders].
     *
     * @return array{0: Plan, 1: Collection<int, Order>}
     */
    private function makePlan(string $startingDay, string $book = 'Genesis', int $chapterCount = 4): array
    {
        $plan = Plan::create([
            'name' => 'Bible Challenge',
            'no_days' => 4,
            'starting_day' => $startingDay,
            'daily_verse_limit' => 120,
        ]);

        $orders = collect();
        foreach (range(1, $chapterCount) as $chapterNumber) {
            $chapter = BookChapter::create([
                'book' => $book,
                'chapter_number' => $chapterNumber,
                'num_verses' => 120,
            ]);

            $orders->push(Order::create([
                'plan_id' => $plan->id,
                'chapter_id' => $chapter->id,
            ]));
        }

        return [$plan, $orders];
    }

    private function makeReader(): Reader
    {
        return Reader::create([
            'name' => 'Jane Doe',
            'phone_number' => '+251911111111',
        ]);
    }

    public function test_records_a_study_day_at_the_chosen_chapter(): void
    {
        [$plan, $orders] = $this->makePlan(now()->subDays(3)->toDateString());
        $reader = $this->makeReader();

        $response = $this->postJson("/api/readers/{$reader->id}/plans/{$plan->id}/set-progress", [
            'order_id' => $orders[2]->id,
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('study_days', [
            'reader_id' => $reader->id,
            'last_studied_chapter_id' => $orders[2]->chapter_id,
        ]);

        // The position is recorded as of the start of today (not as a new
        // reading day), which is what makes it apply to today's reading.
        $this->assertTrue(
            Carbon::parse($response->json('study_day.created_at'))->lt(today()),
        );

        // The plan's own lag logic now reports the adjusted position.
        $this->assertSame($orders[2]->id, $plan->lagFor($reader)['actual_order_id']);
    }

    public function test_rejects_an_order_that_belongs_to_another_plan(): void
    {
        [$plan] = $this->makePlan(now()->subDays(3)->toDateString());
        [, $otherOrders] = $this->makePlan(now()->subDays(3)->toDateString(), 'Exodus');
        $reader = $this->makeReader();

        $this->postJson("/api/readers/{$reader->id}/plans/{$plan->id}/set-progress", [
            'order_id' => $otherOrders[0]->id,
        ])->assertStatus(422)->assertJsonValidationErrors('order_id');

        $this->assertSame(0, $reader->studyDays()->count());
    }

    public function test_the_reading_resumes_from_the_adjusted_chapter_today(): void
    {
        [$plan, $orders] = $this->makePlan(now()->subDays(3)->toDateString());
        $reader = $this->makeReader();

        // Move the reader to the second chapter of the plan.
        $this->postJson("/api/readers/{$reader->id}/plans/{$plan->id}/set-progress", [
            'order_id' => $orders[1]->id,
        ])->assertStatus(201);

        // No travel: today's reading already resumes at the chapter right
        // after the one the admin set.
        $readings = $this->getJson("/api/readers/{$reader->id}/plans/{$plan->id}/daily-readings")
            ->assertOk()
            ->json('readings');

        $this->assertSame($orders[2]->chapter_id, $readings[0]['chapter_id']);
    }

    public function test_the_adjusted_position_still_applies_on_later_days(): void
    {
        [$plan, $orders] = $this->makePlan(now()->subDays(3)->toDateString());
        $reader = $this->makeReader();

        $this->postJson("/api/readers/{$reader->id}/plans/{$plan->id}/set-progress", [
            'order_id' => $orders[1]->id,
        ])->assertStatus(201);

        // A reader who does not read again keeps the adjusted position: it is
        // their most recent progress, not a one-day-only change.
        $this->travelTo(now()->addDays(2));

        $readings = $this->getJson("/api/readers/{$reader->id}/plans/{$plan->id}/daily-readings")
            ->assertOk()
            ->json('readings');

        $this->assertSame($orders[2]->chapter_id, $readings[0]['chapter_id']);
    }

    public function test_the_override_restarts_todays_reading_for_a_reader_who_already_read(): void
    {
        [$plan, $orders] = $this->makePlan(now()->subDays(3)->toDateString());
        $reader = $this->makeReader();

        // The reader has already read up to the third chapter today.
        $this->postJson("/api/readers/{$reader->id}/plans/{$plan->id}/save-progress", [
            'chapter_id' => $orders[2]->chapter_id,
        ])->assertOk();

        // The admin sends them back to the first chapter.
        $this->postJson("/api/readers/{$reader->id}/plans/{$plan->id}/set-progress", [
            'order_id' => $orders[0]->id,
        ])->assertStatus(201);

        // Today restarts after the chapter the admin set, overriding the
        // reading already recorded today.
        $readings = $this->getJson("/api/readers/{$reader->id}/plans/{$plan->id}/daily-readings")
            ->assertOk()
            ->json('readings');

        $this->assertSame($orders[1]->chapter_id, $readings[0]['chapter_id']);

        // Tomorrow their own reading today (the third chapter) counts again:
        // the override was their position at the start of today, so it cannot
        // shadow a reading recorded later on.
        $this->travelTo(now()->addDay());

        $readings = $this->getJson("/api/readers/{$reader->id}/plans/{$plan->id}/daily-readings")
            ->assertOk()
            ->json('readings');

        $this->assertSame($orders[3]->chapter_id, $readings[0]['chapter_id']);
    }

    public function test_setting_the_progress_records_the_matching_day_streak(): void
    {
        // One chapter per day: the third chapter belongs to plan day 3.
        [$plan, $orders] = $this->makePlan(now()->subDays(3)->toDateString());
        $reader = $this->makeReader();

        $response = $this->postJson("/api/readers/{$reader->id}/plans/{$plan->id}/set-progress", [
            'order_id' => $orders[2]->id,
        ])->assertStatus(201);

        $this->assertSame(3, $response->json('streak'));
        $this->assertDatabaseHas('streaks', [
            'reader_id' => $reader->id,
            'count' => 3,
        ]);

        // Later progress moves the same row, so the reader continues from the
        // corrected value.
        $this->postJson("/api/readers/{$reader->id}/plans/{$plan->id}/set-progress", [
            'order_id' => $orders[3]->id,
        ])->assertStatus(201);

        $this->assertSame(1, $reader->streaks()->count());
        $this->assertSame(4, $reader->streaks()->latest('id')->first()->count);
    }

    public function test_rejects_a_chapter_beyond_todays_plan(): void
    {
        // Six chapters on a plan started 3 days ago: today is day 4, the
        // fourth chapter is today's last one, and the fifth is already
        // tomorrow's reading.
        [$plan, $orders] = $this->makePlan(now()->subDays(3)->toDateString(), 'Genesis', 6);
        $reader = $this->makeReader();

        $this->postJson("/api/readers/{$reader->id}/plans/{$plan->id}/set-progress", [
            'order_id' => $orders[4]->id,
        ])->assertStatus(422)->assertJsonValidationErrors('order_id');

        $this->assertSame(0, $reader->studyDays()->count());
        $this->assertSame(0, $reader->streaks()->count());
    }

    public function test_rejects_progress_before_the_plan_starts(): void
    {
        [$plan, $orders] = $this->makePlan(now()->addDay()->toDateString());
        $reader = $this->makeReader();

        $this->postJson("/api/readers/{$reader->id}/plans/{$plan->id}/set-progress", [
            'order_id' => $orders[0]->id,
        ])->assertStatus(422)->assertJsonValidationErrors('order_id');

        $this->assertSame(0, $reader->studyDays()->count());
        $this->assertSame(0, $reader->streaks()->count());
    }
}
