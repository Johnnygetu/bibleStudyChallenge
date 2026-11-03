<?php

namespace Tests\Feature;

use App\Models\BookChapter;
use App\Models\Group;
use App\Models\Order;
use App\Models\Plan;
use App\Models\Reader;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GroupShowProgressTest extends TestCase
{
    use RefreshDatabase;

    private function makePlan(string $startingDay, int $chapterCount): void
    {
        $plan = Plan::create([
            'name' => 'Bible Challenge',
            'no_days' => $chapterCount,
            'starting_day' => $startingDay,
            'daily_verse_limit' => 120,
        ]);

        foreach (range(1, $chapterCount) as $number) {
            $chapter = BookChapter::create([
                'book' => 'Genesis',
                'chapter_number' => $number,
                'num_verses' => 120,
            ]);
            Order::create(['plan_id' => $plan->id, 'chapter_id' => $chapter->id]);
        }
    }

    public function test_the_roster_reports_each_members_completed_day_progress(): void
    {
        $this->makePlan(now()->toDateString(), 3);

        $group = Group::create(['name' => 'Group 1']);
        $reader = Reader::create([
            'name' => 'Jane Doe',
            'phone_number' => '+251911111101',
        ]);
        $group->readers()->attach($reader->id);

        // Finished the first chapter, so the first schedule day counts as done.
        $reader->studyDays()->create([
            'last_studied_chapter_id' => BookChapter::first()->id,
        ]);

        $this->getJson("/api/groups/{$group->id}")
            ->assertStatus(200)
            ->assertJsonPath('readers.0.days_done', 1)
            ->assertJsonPath('readers.0.total_days', 3);
    }

    public function test_the_roster_reports_zero_progress_when_no_plan_exists(): void
    {
        $group = Group::create(['name' => 'Group 1']);
        $reader = Reader::create([
            'name' => 'John Roe',
            'phone_number' => '+251911111102',
        ]);
        $group->readers()->attach($reader->id);

        $this->getJson("/api/groups/{$group->id}")
            ->assertStatus(200)
            ->assertJsonPath('readers.0.days_done', 0)
            ->assertJsonPath('readers.0.total_days', 0);
    }
}
