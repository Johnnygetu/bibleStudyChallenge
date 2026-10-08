<?php

namespace Tests\Feature;

use App\Models\BookChapter;
use App\Models\Order;
use App\Models\Plan;
use App\Models\Reader;
use App\Models\StudyDay;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class DailyReadingBroadcastTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'services.telegram.bot_token' => 'test-token',
            'services.telegram.mini_app_url' => 'https://mini.test/app',
            'services.telegram.broadcast_token' => null,
        ]);
    }

    /**
     * Plan with three chapters (31 + 25 + 24 verses) and a 100 verse daily
     * limit, so today's reading is the whole of Genesis 1-3.
     */
    private function makePlan(?string $startingDay = null): Plan
    {
        $plan = Plan::create([
            'name' => 'Bible Challenge',
            'no_days' => 30,
            'starting_day' => $startingDay ?? now()->toDateString(),
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

        return $plan;
    }

    private function makeReader(string $name, ?int $chatId): Reader
    {
        return Reader::create([
            'name' => $name,
            'phone_number' => '+2519'.random_int(10000000, 99999999),
            'chat_id' => $chatId,
        ]);
    }

    public function test_sends_every_reachable_reader_their_reading_for_the_day(): void
    {
        $plan = $this->makePlan();
        $jane = $this->makeReader('Jane Doe', 900000011);
        $john = $this->makeReader('John Doe', 900000012);
        $this->makeReader('No Telegram', null);

        Http::fake(['api.telegram.org/*' => Http::response(['ok' => true], 200)]);

        $response = $this->postJson('/api/telegram/daily-readings');

        $response->assertOk()->assertJson([
            'ok' => true,
            'plan_id' => $plan->id,
            'plan_name' => 'Bible Challenge',
            'readers_reached' => 2,
            'without_chat_id' => 1,
            'sent' => 2,
            'skipped' => 0,
            'failed' => 0,
        ]);

        Http::assertSentCount(2);

        // Each reader gets their own chat, with today's chapters in the text.
        Http::assertSent(function ($request) use ($jane) {
            return $request['chat_id'] === $jane->chat_id
                && str_contains($request['text'], 'Jane Doe, here is your reading for today')
                && str_contains($request['text'], 'Day 1 of 1 · 3 chapters · 80 verses')
                && str_contains($request['text'], '• Genesis 1 (31 verses)')
                && str_contains($request['text'], '• Genesis 3 (24 verses)')
                && $request['reply_markup']['inline_keyboard'][0][0]['text'] === 'Open reading plan'
                && $request['reply_markup']['inline_keyboard'][0][0]['web_app']['url'] === 'https://mini.test/app';
        });

        Http::assertSent(function ($request) use ($john, $jane) {
            return $request['chat_id'] === $john->chat_id
                && $request['chat_id'] !== $jane->chat_id;
        });

        // The reader without a chat id is reported but never messaged.
        $this->assertStringNotContainsString(
            'No Telegram',
            json_encode($response->json('results')),
        );
    }

    public function test_the_broadcast_carries_the_same_readings_the_app_shows(): void
    {
        $plan = $this->makePlan();
        $reader = $this->makeReader('Jane Doe', 900000081);

        Http::fake(['api.telegram.org/*' => Http::response(['ok' => true], 200)]);

        $shown = $this->getJson("/api/readers/{$reader->id}/plans/{$plan->id}/daily-readings")
            ->assertOk()
            ->json();

        $this->postJson('/api/telegram/daily-readings')->assertOk();

        // One calculation, two surfaces: the app and the Telegram message can
        // never disagree about what today's reading is.
        Http::assertSent(function ($request) use ($shown) {
            foreach ($shown['readings'] as $reading) {
                if (! str_contains($request['text'], "{$reading['book']} {$reading['chapter_number']} ({$reading['num_verses']} verses)")) {
                    return false;
                }
            }

            return str_contains($request['text'], "Day {$shown['current_day']} of {$shown['total_days']}")
                && str_contains($request['text'], "{$shown['verses_assigned']} verses")
                && $shown['chapters_count'] === count($shown['readings']);
        });
    }

    public function test_prefers_the_started_plan_over_a_later_one_in_the_queue(): void
    {
        $startedPlan = $this->makePlan();

        // Next challenge, queued to start later. No chapters of its own.
        $queuedPlan = Plan::create([
            'name' => 'Next Challenge',
            'no_days' => 30,
            'starting_day' => now()->addMonth()->toDateString(),
            'daily_verse_limit' => 100,
        ]);

        $this->makeReader('Jane Doe', 900000091);

        Http::fake(['api.telegram.org/*' => Http::response(['ok' => true], 200)]);

        $this->postJson('/api/telegram/daily-readings')
            ->assertOk()
            ->assertJson([
                'plan_id' => $startedPlan->id,
                'sent' => 1,
                'skipped' => 0,
            ]);

        $this->assertNotSame($queuedPlan->id, $startedPlan->id);
    }

    public function test_does_not_send_before_the_plan_starts(): void
    {
        $plan = $this->makePlan(now()->addDays(3)->toDateString());
        $this->makeReader('Jane Doe', 900000021);

        Http::fake();

        $this->postJson('/api/telegram/daily-readings')
            ->assertOk()
            ->assertJson([
                'plan_id' => $plan->id,
                'sent' => 0,
                'skipped' => 1,
                'failed' => 0,
                'results' => [
                    ['reader_id' => 1, 'name' => 'Jane Doe', 'status' => 'plan_not_started', 'days_until_start' => 3],
                ],
            ]);

        Http::assertNothingSent();
    }

    public function test_does_not_send_when_the_reader_has_finished_the_plan(): void
    {
        $plan = $this->makePlan();
        $reader = $this->makeReader('Finished Reader', 900000031);

        // Finished the last chapter in the plan before today, so there is
        // nothing left to assign. (A study day dated today is deliberately
        // ignored here: today's readings stay fixed all day.)
        $lastOrder = Order::where('plan_id', $plan->id)->orderByDesc('id')->first();
        $studyDay = $reader->studyDays()->create(['last_studied_chapter_id' => $lastOrder->chapter_id]);
        StudyDay::whereKey($studyDay->id)->update(['created_at' => now()->subDay()]);

        Http::fake();

        $this->postJson('/api/telegram/daily-readings')
            ->assertOk()
            ->assertJson([
                'sent' => 0,
                'skipped' => 1,
                'failed' => 0,
                'results' => [
                    ['reader_id' => $reader->id, 'name' => 'Finished Reader', 'status' => 'nothing_to_read'],
                ],
            ]);

        Http::assertNothingSent();
    }

    public function test_reports_telegram_rejections_without_stopping_the_run(): void
    {
        $this->makePlan();
        $this->makeReader('Jane Doe', 900000041);
        $this->makeReader('John Doe', 900000042);

        // Every send is accepted except Jane's chat.
        Http::fake([
            'api.telegram.org/*' => Http::sequence()
                ->push(['ok' => false, 'description' => 'chat not found'], 400)
                ->push(['ok' => true], 200),
        ]);

        $response = $this->postJson('/api/telegram/daily-readings');

        $response->assertOk()->assertJson([
            'ok' => false,
            'sent' => 1,
            'skipped' => 0,
            'failed' => 1,
        ]);

        $this->assertSame('failed', $response->json('results.0.status'));
        $this->assertSame('sent', $response->json('results.1.status'));
        Http::assertSentCount(2);
    }

    public function test_requires_the_broadcast_token_when_one_is_configured(): void
    {
        $this->makePlan();
        $this->makeReader('Jane Doe', 900000051);

        config(['services.telegram.broadcast_token' => 'super-secret']);

        Http::fake();

        $this->postJson('/api/telegram/daily-readings')
            ->assertStatus(401)
            ->assertJson(['ok' => false, 'error' => 'invalid broadcast token']);

        $this->postJson('/api/telegram/daily-readings', ['token' => 'wrong'])
            ->assertStatus(401);

        Http::assertNothingSent();

        $this->postJson('/api/telegram/daily-readings', [], ['X-Broadcast-Token' => 'super-secret'])
            ->assertOk()
            ->assertJson(['sent' => 1]);

        Http::assertSentCount(1);
    }

    public function test_fails_clearly_when_the_bot_token_is_missing(): void
    {
        $this->makePlan();
        $this->makeReader('Jane Doe', 900000061);

        config(['services.telegram.bot_token' => null]);

        // The controller also checks env() directly, so clear every layer the
        // environment is read from — and put it back when the test is done.
        $fromEnv = $_ENV['TELEGRAM_BOT_TOKEN'] ?? null;
        $fromServer = $_SERVER['TELEGRAM_BOT_TOKEN'] ?? null;
        putenv('TELEGRAM_BOT_TOKEN');
        unset($_ENV['TELEGRAM_BOT_TOKEN'], $_SERVER['TELEGRAM_BOT_TOKEN']);

        try {
            Http::fake();

            $this->postJson('/api/telegram/daily-readings')
                ->assertStatus(500)
                ->assertJson(['ok' => false, 'error' => 'bot token not configured']);

            Http::assertNothingSent();
        } finally {
            if ($fromEnv !== null) {
                $_ENV['TELEGRAM_BOT_TOKEN'] = $fromEnv;
            }

            if ($fromServer !== null) {
                $_SERVER['TELEGRAM_BOT_TOKEN'] = $fromServer;
            }
        }
    }

    public function test_fails_clearly_when_no_plan_exists(): void
    {
        $this->makeReader('Jane Doe', 900000071);

        Http::fake();

        $this->postJson('/api/telegram/daily-readings')
            ->assertStatus(404)
            ->assertJson(['ok' => false, 'error' => 'no plan configured']);

        Http::assertNothingSent();
    }
}
