<?php

namespace Tests\Feature;

use App\Models\BookChapter;
use App\Models\Order;
use App\Models\Plan;
use App\Models\Reader;
use App\Models\StudyDay;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Collection;
use Tests\TestCase;

class NextReadingTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A plan built from the given per-chapter verse counts, one order per
     * chapter and a 100-verse daily limit, so schedule days group by verses.
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

    private function makeReader(): Reader
    {
        return Reader::create([
            'name' => 'Jane Doe',
            'phone_number' => '+251911111111',
        ]);
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

    public function test_returns_the_chapter_after_the_order_the_client_holds(): void
    {
        // Two 60-verse chapters per day. Started yesterday, reader finished day
        // 1, so today is orders 2-3; the client sends order 3 and gets order 4.
        [$plan, $orders] = $this->makePlanWithVerses(now()->subDay()->toDateString(), array_fill(0, 8, 60));
        $reader = $this->makeReader();
        $this->putReaderAt($reader, $orders[1]);

        $response = $this->getJson(
            "/api/readers/{$reader->id}/plans/{$plan->id}/next-reading?after_order_id={$orders[3]->id}"
        );

        $response->assertOk()
            ->assertJsonFragment([
                'order_id' => $orders[4]->id,
                'chapter_id' => $orders[4]->chapter_id,
                'book' => 'Genesis',
                'chapter_number' => 5,
                'num_verses' => 60,
                'is_completed' => false,
            ]);
    }

    public function test_falls_back_to_the_readers_position_when_no_order_is_sent(): void
    {
        [$plan, $orders] = $this->makePlanWithVerses(now()->subDay()->toDateString(), array_fill(0, 8, 60));
        $reader = $this->makeReader();
        $this->putReaderAt($reader, $orders[1]);

        $this->getJson("/api/readers/{$reader->id}/plans/{$plan->id}/next-reading")
            ->assertOk()
            ->assertJsonFragment(['order_id' => $orders[2]->id]);
    }

    public function test_rejects_a_reader_who_is_up_to_date_and_sends_todays_last_chapter(): void
    {
        // Started three days ago, so today is day 4; the reader is already on
        // day 5's chapters (orders 10-11) and is not behind. Sending today's
        // last chapter means there is nothing extra to add.
        [$plan, $orders] = $this->makePlanWithVerses(now()->subDays(3)->toDateString(), array_fill(0, 12, 60));
        $reader = $this->makeReader();
        $this->putReaderAt($reader, $orders[9]);

        $this->getJson(
            "/api/readers/{$reader->id}/plans/{$plan->id}/next-reading?after_order_id={$orders[11]->id}"
        )->assertStatus(422);
    }

    public function test_returns_404_when_a_lagging_reader_is_at_the_plans_last_chapter(): void
    {
        // Behind schedule but today's list already ends on the plan's last
        // chapter, so nothing follows.
        [$plan, $orders] = $this->makePlanWithVerses(now()->subDays(5)->toDateString(), array_fill(0, 4, 60));
        $reader = $this->makeReader();
        $this->putReaderAt($reader, $orders[1]);

        $this->getJson(
            "/api/readers/{$reader->id}/plans/{$plan->id}/next-reading?after_order_id={$orders[3]->id}"
        )->assertNotFound();
    }
}
