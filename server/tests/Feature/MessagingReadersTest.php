<?php

namespace Tests\Feature;

use App\Models\BookChapter;
use App\Models\Order;
use App\Models\Plan;
use App\Models\Reader;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MessagingReadersTest extends TestCase
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

    private function makeReader(string $name, int $chatId): Reader
    {
        return Reader::create([
            'name' => $name,
            'phone_number' => '+2519'.str_pad((string) crc32($name), 9, '0', STR_PAD_LEFT),
            'chat_id' => $chatId,
        ]);
    }

    public function test_all_returns_every_reader_with_the_recipient_columns(): void
    {
        $this->makePlan(now()->toDateString());

        $alice = $this->makeReader('Alice Zodiac', 111);
        $bob = $this->makeReader('Bob Aardvark', 222);

        $this->getJson('/api/messaging/readers?audience=all')
            ->assertStatus(200)
            ->assertExactJson([
                [
                    'id' => $alice->id,
                    'name' => 'Alice Zodiac',
                    'phone_number' => $alice->phone_number,
                    'chat_id' => 111,
                ],
                [
                    'id' => $bob->id,
                    'name' => 'Bob Aardvark',
                    'phone_number' => $bob->phone_number,
                    'chat_id' => 222,
                ],
            ]);
    }

    public function test_a_request_without_an_audience_defaults_to_all(): void
    {
        $this->makePlan(now()->toDateString());

        $this->makeReader('Alice Zodiac', 111);

        $this->getJson('/api/messaging/readers')
            ->assertStatus(200)
            ->assertJsonCount(1);
    }

    public function test_lagging_returns_only_the_readers_behind_the_schedule(): void
    {
        // Today is plan day 4, whose target is the final chapter.
        $this->makePlan(now()->subDays(3)->toDateString());

        // Alice never studied: she is missing all four chapters.
        $lagging = $this->makeReader('Alice Zodiac', 111);
        $caughtUp = $this->makeReader('Bob Aardvark', 222);

        foreach (Order::where('plan_id', Plan::current()->id)->orderBy('id')->get() as $order) {
            $caughtUp->studyDays()->create([
                'last_studied_chapter_id' => $order->chapter_id,
            ]);
        }

        $this->getJson('/api/messaging/readers?audience=lagging')
            ->assertStatus(200)
            ->assertJsonCount(1)
            ->assertExactJson([
                [
                    'id' => $lagging->id,
                    'name' => 'Alice Zodiac',
                    'phone_number' => $lagging->phone_number,
                    'chat_id' => 111,
                    'current_day' => 4,
                    'lagging_chapters' => 4,
                    'lagging_verses' => 480,
                ],
            ]);
    }

    public function test_lagging_returns_an_empty_list_when_there_is_no_plan(): void
    {
        $this->makeReader('Alice Zodiac', 111);

        $this->getJson('/api/messaging/readers?audience=lagging')
            ->assertStatus(200)
            ->assertExactJson([]);
    }

    public function test_an_unknown_audience_is_rejected(): void
    {
        $this->getJson('/api/messaging/readers?audience=strangers')
            ->assertStatus(422)
            ->assertJsonValidationErrors('audience');
    }
}
