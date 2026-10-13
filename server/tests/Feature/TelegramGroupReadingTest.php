<?php

namespace Tests\Feature;

use App\Models\BookChapter;
use App\Models\Order;
use App\Models\Plan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class TelegramGroupReadingTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'services.telegram.bot_token' => 'test-token',
            'services.telegram.mini_app_url' => 'https://mini.test/app',
            'services.telegram.group_chat_id' => '-1001234567890',
            'services.telegram.broadcast_token' => null,
        ]);
    }

    /**
     * Plan with one chapter per day: four chapters of 100 verses against a
     * 100 verse daily limit.
     */
    private function makePlan(string $startingDay): Plan
    {
        $plan = Plan::create([
            'name' => 'Bible Challenge',
            'no_days' => 4,
            'starting_day' => $startingDay,
            'daily_verse_limit' => 100,
        ]);

        foreach ([1, 2, 3, 4] as $chapterNumber) {
            $chapter = BookChapter::create([
                'book' => 'Genesis',
                'chapter_number' => $chapterNumber,
                'num_verses' => 100,
            ]);

            Order::create([
                'plan_id' => $plan->id,
                'chapter_id' => $chapter->id,
            ]);
        }

        return $plan;
    }

    public function test_posts_todays_reading_plan_to_the_group(): void
    {
        $plan = $this->makePlan(now()->subDays(2)->toDateString());

        Http::fake(['api.telegram.org/*' => Http::response(['ok' => true], 200)]);

        $response = $this->postJson('/api/telegram/group-reading');

        $response->assertOk()->assertJson([
            'ok' => true,
            'sent' => true,
            'chat_id' => '-1001234567890',
            'plan_id' => $plan->id,
            'plan_name' => 'Bible Challenge',
            'date' => now()->toDateString(),
            'day' => 3,
            'total_days' => 4,
            'chapters' => 1,
            'verses' => 100,
        ]);

        Http::assertSentCount(1);

        Http::assertSent(function ($request) {
            $text = $request['text'];

            return $request['chat_id'] === '-1001234567890'
                && $request['parse_mode'] === 'HTML'
                && str_contains($text, '📖 <b>Bible Challenge — today\'s reading</b>')
                && str_contains($text, 'Day 3 of 4 · 1 chapter · 100 verses')
                && str_contains($text, '• Genesis 3 (100 verses)')
                && $request['reply_markup']['inline_keyboard'][0][0]['text'] === 'Open reading plan'
                && $request['reply_markup']['inline_keyboard'][0][0]['web_app']['url'] === 'https://mini.test/app';
        });
    }

    public function test_lists_every_chapter_of_a_multi_chapter_day(): void
    {
        // 31 + 25 + 24 verses against a 100 verse limit: all three chapters
        // belong to the plan's only day, which starts today.
        $plan = Plan::create([
            'name' => 'Bible Challenge',
            'no_days' => 1,
            'starting_day' => now()->toDateString(),
            'daily_verse_limit' => 100,
        ]);

        foreach ([[1, 31], [2, 25], [3, 24]] as [$chapterNumber, $verses]) {
            $chapter = BookChapter::create([
                'book' => 'Genesis',
                'chapter_number' => $chapterNumber,
                'num_verses' => $verses,
            ]);

            Order::create([
                'plan_id' => $plan->id,
                'chapter_id' => $chapter->id,
            ]);
        }

        Http::fake(['api.telegram.org/*' => Http::response(['ok' => true], 200)]);

        $response = $this->postJson('/api/telegram/group-reading')->assertOk();

        $message = $response->json('message');

        $this->assertSame(1, $response->json('day'));
        $this->assertSame(1, $response->json('total_days'));
        $this->assertSame(3, $response->json('chapters'));
        $this->assertSame(80, $response->json('verses'));

        $this->assertStringContainsString('Day 1 of 1 · 3 chapters · 80 verses', $message);
        $this->assertStringContainsString('• Genesis 1 (31 verses)', $message);
        $this->assertStringContainsString('• Genesis 2 (25 verses)', $message);
        $this->assertStringContainsString('• Genesis 3 (24 verses)', $message);
    }

    public function test_sends_nothing_before_the_plan_starts(): void
    {
        $this->makePlan(now()->addDays(3)->toDateString());

        Http::fake();

        $this->postJson('/api/telegram/group-reading')
            ->assertOk()
            ->assertJson([
                'ok' => true,
                'sent' => false,
                'chat_id' => '-1001234567890',
                'reason' => 'the plan has not started yet',
                'days_until_start' => 3,
            ]);

        Http::assertNothingSent();
    }

    public function test_sends_nothing_once_the_plan_is_finished(): void
    {
        $this->makePlan(now()->subDays(10)->toDateString());

        Http::fake();

        $this->postJson('/api/telegram/group-reading')
            ->assertOk()
            ->assertJson([
                'ok' => true,
                'sent' => false,
                'reason' => 'the plan is finished',
            ]);

        Http::assertNothingSent();
    }

    public function test_reports_a_missing_group_chat_id(): void
    {
        $this->makePlan(now()->toDateString());

        config(['services.telegram.group_chat_id' => null]);

        // The controller also checks env() directly, so clear every layer the
        // environment is read from — and put it back when the test is done.
        $fromEnv = $_ENV['TELEGRAM_GROUP_CHAT_ID'] ?? null;
        $fromServer = $_SERVER['TELEGRAM_GROUP_CHAT_ID'] ?? null;
        putenv('TELEGRAM_GROUP_CHAT_ID');
        unset($_ENV['TELEGRAM_GROUP_CHAT_ID'], $_SERVER['TELEGRAM_GROUP_CHAT_ID']);

        try {
            Http::fake();

            $this->postJson('/api/telegram/group-reading')
                ->assertStatus(500)
                ->assertJson(['ok' => false, 'error' => 'group chat id not configured']);

            Http::assertNothingSent();
        } finally {
            if ($fromEnv !== null) {
                $_ENV['TELEGRAM_GROUP_CHAT_ID'] = $fromEnv;
            }

            if ($fromServer !== null) {
                $_SERVER['TELEGRAM_GROUP_CHAT_ID'] = $fromServer;
            }
        }
    }

    public function test_requires_the_broadcast_token_when_one_is_configured(): void
    {
        $this->makePlan(now()->toDateString());

        config(['services.telegram.broadcast_token' => 'super-secret']);

        Http::fake();

        $this->postJson('/api/telegram/group-reading')
            ->assertStatus(401)
            ->assertJson(['ok' => false, 'error' => 'invalid broadcast token']);

        $this->postJson('/api/telegram/group-reading', ['token' => 'wrong'])
            ->assertStatus(401);

        Http::assertNothingSent();

        $this->postJson('/api/telegram/group-reading', [], ['X-Broadcast-Token' => 'super-secret'])
            ->assertOk()
            ->assertJson(['sent' => true]);

        Http::assertSentCount(1);
    }

    public function test_reports_when_telegram_rejects_the_post(): void
    {
        $this->makePlan(now()->toDateString());

        Http::fake(['api.telegram.org/*' => Http::response(['ok' => false, 'description' => 'chat not found'], 400)]);

        $this->postJson('/api/telegram/group-reading')
            ->assertStatus(500)
            ->assertJson([
                'ok' => false,
                'sent' => false,
                'error' => 'failed to send reading plan',
            ]);

        Http::assertSentCount(1);
    }
}
