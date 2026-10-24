<?php

namespace Tests\Feature;

use App\Models\BookChapter;
use App\Models\Order;
use App\Models\Plan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PlanOrdersTest extends TestCase
{
    use RefreshDatabase;

    private function makePlan(array $chapters): Plan
    {
        $plan = Plan::create([
            'name' => 'Bible Challenge',
            'no_days' => 30,
            'starting_day' => now()->toDateString(),
            'daily_verse_limit' => 100,
        ]);

        foreach ($chapters as $index => $verses) {
            $chapter = BookChapter::create([
                'book' => 'Genesis',
                'chapter_number' => $index + 1,
                'num_verses' => $verses,
            ]);

            Order::create([
                'plan_id' => $plan->id,
                'chapter_id' => $chapter->id,
            ]);
        }

        return $plan;
    }

    // Genesis 1 (31) + Genesis 2 (25) + Genesis 3 (25) + Genesis 4 (26) = 107
    // crosses the 100-verse limit, so they share day 1; Genesis 5 (90) +
    // Genesis 6 (15) = 105 makes day 2, and the tail chapter sits alone on
    // day 3.
    private Plan $plan;

    protected function setUp(): void
    {
        parent::setUp();

        $this->plan = $this->makePlan([31, 25, 25, 26, 90, 15, 40]);
    }

    public function test_returns_plans_orders_keyed_by_day(): void
    {
        $this->getJson("/api/plans/{$this->plan->id}/orders")
            ->assertOk()
            ->assertExactJson([
                'day1' => ['Genesis 1', 'Genesis 2', 'Genesis 3', 'Genesis 4'],
                'day2' => ['Genesis 5', 'Genesis 6'],
                'day3' => ['Genesis 7'],
            ]);
    }

    public function test_returns_empty_list_for_a_plan_without_orders(): void
    {
        $emptyPlan = Plan::create([
            'name' => 'Bible Challenge',
            'no_days' => 30,
            'starting_day' => now()->toDateString(),
            'daily_verse_limit' => 100,
        ]);

        $this->getJson("/api/plans/{$emptyPlan->id}/orders")
            ->assertOk()
            ->assertExactJson([]);
    }
}
