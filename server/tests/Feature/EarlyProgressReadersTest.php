<?php

namespace Tests\Feature;

use App\Models\BookChapter;
use App\Models\Order;
use App\Models\Plan;
use App\Models\Reader;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EarlyProgressReadersTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A plan where every chapter is its own day (120 verses, limit 120), so
     * reading one chapter per day finishes one plan day at a time.
     *
     * @return array{0: Plan, 1: array<int, Order>}
     */
    private function makePlan(string $startingDay): array
    {
        $plan = Plan::create([
            'name' => 'Bible Challenge',
            'no_days' => 4,
            'starting_day' => $startingDay,
            'daily_verse_limit' => 120,
        ]);

        $orders = [];
        foreach ([1, 2, 3, 4] as $chapterNumber) {
            $chapter = BookChapter::create([
                'book' => 'Genesis',
                'chapter_number' => $chapterNumber,
                'num_verses' => 120,
            ]);

            $orders[] = Order::create([
                'plan_id' => $plan->id,
                'chapter_id' => $chapter->id,
            ]);
        }

        return [$plan, $orders];
    }

    private function makeReader(string $name): Reader
    {
        return Reader::create([
            'name' => $name,
            'phone_number' => '+2519'.str_pad((string) crc32($name), 9, '0', STR_PAD_LEFT),
        ]);
    }

    public function test_returns_only_readers_on_their_first_three_days_with_name_and_phone(): void
    {
        [$plan, $orders] = $this->makePlan(now()->subDays(3)->toDateString());

        // Far enough into the plan that a full 4-chapter reader sits on day 4.
        $starter = $this->makeReader('Alice Starter');
        $caughtUp = $this->makeReader('Bob Finished');

        // Carol never studied a chapter: day 0.
        $newcomer = $this->makeReader('Carol New');
        // Alice read the first two chapters: day 2.
        foreach (array_slice($orders, 0, 2) as $order) {
            $starter->studyDays()->create([
                'last_studied_chapter_id' => $order->chapter_id,
            ]);
        }

        // Bob read all four chapters: day 4, past the day 0-3 window.
        foreach ($orders as $order) {
            $caughtUp->studyDays()->create([
                'last_studied_chapter_id' => $order->chapter_id,
            ]);
        }

        $response = $this->getJson('/api/readers/early-progress');

        $response->assertStatus(200)
            ->assertJsonCount(2)
            ->assertJson([
                ['name' => 'Alice Starter', 'phone_number' => $starter->phone_number],
                ['name' => 'Carol New', 'phone_number' => $newcomer->phone_number],
            ]);
    }

    public function test_returns_an_empty_list_when_there_is_no_plan(): void
    {
        $this->makeReader('Jane Doe');

        $this->getJson('/api/readers/early-progress')
            ->assertStatus(200)
            ->assertExactJson([]);
    }
}
