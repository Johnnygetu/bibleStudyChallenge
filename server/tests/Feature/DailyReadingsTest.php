<?php

namespace Tests\Feature;

use App\Models\BookChapter;
use App\Models\Order;
use App\Models\Plan;
use App\Models\Reader;
use App\Models\Score;
use App\Models\StudyDay;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Collection;
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

    /**
     * A plan built from the given per-chapter verse counts, one order per
     * chapter and a 100-verse daily limit, so schedule days group by verses.
     * Returns [plan, orders] where orders[i] matches verseCounts[i].
     *
     * @param  array<int, int>  $verseCounts
     * @return array{0: Plan, 1: Collection<int, Order>}
     */
    private function makePlanWithVerses(string $startingDay, array $verseCounts): array
    {
        $plan = Plan::create([
            'name' => 'Bible Challenge',
            'no_days' => count($verseCounts),
            'starting_day' => $startingDay,
            'daily_verse_limit' => 100,
        ]);

        $orders = collect();
        foreach (array_values($verseCounts) as $index => $verses) {
            $chapter = BookChapter::create([
                'book' => 'Genesis',
                'chapter_number' => $index + 1,
                'num_verses' => $verses,
            ]);

            $orders->push(Order::create([
                'plan_id' => $plan->id,
                'chapter_id' => $chapter->id,
            ]));
        }

        return [$plan, $orders];
    }

    /**
     * Record the reader's position as of the start of today, the same way an
     * admin override does, so today's reading list starts after it.
     */
    private function putReaderAt(Reader $reader, Order $order): void
    {
        $studyDay = $reader->studyDays()->create(['last_studied_chapter_id' => $order->chapter_id]);
        StudyDay::whereKey($studyDay->id)->update(['created_at' => now()->subDay()]);
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

    public function test_a_reader_who_falls_behind_enters_catch_up_mode(): void
    {
        $reader = $this->makeReader();
        // Started two days ago with nothing read yet: behind today's schedule
        // with no grace period to absorb it.
        $plan = $this->makePlan(now()->subDays(2)->toDateString());

        $this->getJson("/api/readers/{$reader->id}/plans/{$plan->id}/daily-readings")
            ->assertOk()
            ->assertJsonFragment(['is_catch_up_mode' => true]);
    }

    public function test_a_reader_one_day_behind_reads_exactly_one_extra_chapter(): void
    {
        // Two 60-verse chapters per day. Started five days ago, so today is day
        // 6 and the reader finished day 4: day 5 is their normal day today.
        [$plan, $orders] = $this->makePlanWithVerses(now()->subDays(5)->toDateString(), array_fill(0, 12, 60));
        $reader = $this->makeReader();
        $this->putReaderAt($reader, $orders[7]);

        $response = $this->getJson("/api/readers/{$reader->id}/plans/{$plan->id}/daily-readings")
            ->assertOk();

        // Normal day (day 5) is orders 8-9; the bonus is the next chapter, 10.
        $readings = $response->json('readings');
        $this->assertSame(
            [$orders[8]->id, $orders[9]->id, $orders[10]->id],
            array_column($readings, 'order_id'),
        );
        $this->assertSame(60, $response->json('extra_verses_added'));
        $this->assertSame(160, $response->json('dynamic_verse_limit'));
        $this->assertTrue($response->json('is_catch_up_mode'));
    }

    public function test_a_lagging_readers_list_never_passes_the_groups_last_chapter(): void
    {
        // Two chapters a day but an 80/40 split: a reader mid-day would group
        // past today's last chapter on verse count alone.
        [$plan, $orders] = $this->makePlanWithVerses(
            now()->subDay()->toDateString(),
            [80, 40, 80, 40, 80, 40, 80, 40],
        );
        $reader = $this->makeReader();
        $this->putReaderAt($reader, $orders[2]);

        $response = $this->getJson("/api/readers/{$reader->id}/plans/{$plan->id}/daily-readings")
            ->assertOk();

        // Today is day 2, so its last chapter is order 3. The normal day would
        // reach order 4, which the clamp drops.
        $readings = $response->json('readings');
        $this->assertSame([$orders[3]->id], array_column($readings, 'order_id'));
        $this->assertSame($orders[3]->id, $plan->lagFor($reader, false)['target_order_id']);
        $this->assertSame(0, $response->json('extra_verses_added'));
    }

    public function test_an_on_schedule_reader_gets_no_bonus_chapter(): void
    {
        // Started yesterday, so today is day 2; the reader finished day 1.
        [$plan, $orders] = $this->makePlanWithVerses(now()->subDay()->toDateString(), array_fill(0, 12, 60));
        $reader = $this->makeReader();
        $this->putReaderAt($reader, $orders[1]);

        $response = $this->getJson("/api/readers/{$reader->id}/plans/{$plan->id}/daily-readings")
            ->assertOk();

        // The normal day already ends on today's last chapter, so the bonus
        // chapter (order 4) is tomorrow's and is filtered out.
        $readings = $response->json('readings');
        $this->assertSame([$orders[2]->id, $orders[3]->id], array_column($readings, 'order_id'));
        $this->assertSame(0, $response->json('extra_verses_added'));
        $this->assertSame(100, $response->json('dynamic_verse_limit'));
        $this->assertSame(2, $response->json('chapters_count'));
    }

    public function test_a_reader_several_days_behind_still_only_adds_one_chapter(): void
    {
        // Started five days ago; the reader finished day 1, so four days are
        // outstanding but only one extra chapter is granted today.
        [$plan, $orders] = $this->makePlanWithVerses(now()->subDays(5)->toDateString(), array_fill(0, 12, 60));
        $reader = $this->makeReader();
        $this->putReaderAt($reader, $orders[1]);

        $response = $this->getJson("/api/readers/{$reader->id}/plans/{$plan->id}/daily-readings")
            ->assertOk();

        $readings = $response->json('readings');
        $this->assertSame(
            [$orders[2]->id, $orders[3]->id, $orders[4]->id],
            array_column($readings, 'order_id'),
        );
        $this->assertSame(60, $response->json('extra_verses_added'));
    }

    public function test_a_reader_at_the_last_chapter_gets_no_bonus_and_does_not_crash(): void
    {
        // Started five days ago, so today is the plan's last day (day 6); the
        // reader is already at its last chapter.
        [$plan, $orders] = $this->makePlanWithVerses(now()->subDays(5)->toDateString(), array_fill(0, 12, 60));
        $reader = $this->makeReader();
        $this->putReaderAt($reader, $orders[11]);

        $response = $this->getJson("/api/readers/{$reader->id}/plans/{$plan->id}/daily-readings")
            ->assertOk();

        $this->assertSame([], $response->json('readings'));
        $this->assertSame(0, $response->json('extra_verses_added'));
        $this->assertFalse($response->json('is_catch_up_mode'));
    }

    public function test_a_reader_ahead_of_schedule_is_left_unchanged(): void
    {
        // Started three days ago, so today is day 4; the reader is already on
        // day 5's chapters and must not be clamped or given a bonus.
        [$plan, $orders] = $this->makePlanWithVerses(now()->subDays(3)->toDateString(), array_fill(0, 12, 60));
        $reader = $this->makeReader();
        $this->putReaderAt($reader, $orders[9]);

        $response = $this->getJson("/api/readers/{$reader->id}/plans/{$plan->id}/daily-readings")
            ->assertOk();

        $readings = $response->json('readings');
        $this->assertSame([$orders[10]->id, $orders[11]->id], array_column($readings, 'order_id'));
        $this->assertSame(0, $response->json('extra_verses_added'));
        $this->assertFalse($response->json('is_catch_up_mode'));
    }

    public function test_never_reports_a_day_beyond_the_plans_length(): void
    {
        $reader = $this->makeReader();
        // Six days into a one-day schedule: with no grace period there is no
        // day 31+ to show, so the counter stops at the plan's last day.
        $plan = $this->makePlan(now()->subDays(5)->toDateString());

        $response = $this->getJson("/api/readers/{$reader->id}/plans/{$plan->id}/daily-readings");

        $response->assertOk()
            ->assertJsonFragment(['total_days' => 1])
            ->assertJsonFragment(['current_day' => 1]);
    }
}
