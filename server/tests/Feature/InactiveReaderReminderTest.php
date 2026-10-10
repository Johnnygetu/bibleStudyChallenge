<?php

namespace Tests\Feature;

use App\Models\BookChapter;
use App\Models\Reader;
use App\Models\StudyDay;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class InactiveReaderReminderTest extends TestCase
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

    private function makeReader(string $name, ?int $chatId): Reader
    {
        return Reader::create([
            'name' => $name,
            'phone_number' => '+2519'.random_int(10000000, 99999999),
            'chat_id' => $chatId,
        ]);
    }

    /**
     * Give a reader a study day dated $daysAgo so their last activity is known.
     */
    private function recordRead(Reader $reader, int $daysAgo): void
    {
        $chapter = BookChapter::firstOrCreate(
            ['book' => 'Genesis', 'chapter_number' => 1],
            ['num_verses' => 31],
        );

        $studyDay = $reader->studyDays()->create(['last_studied_chapter_id' => $chapter->id]);

        StudyDay::whereKey($studyDay->id)->update(['created_at' => now()->subDays($daysAgo)]);
    }

    public function test_reminds_readers_who_have_not_read_for_a_week(): void
    {
        $inactive = $this->makeReader('Jane Doe', 900000011);
        $this->recordRead($inactive, 8);

        $active = $this->makeReader('John Doe', 900000012);
        $this->recordRead($active, 2);

        $this->makeReader('No Telegram', null);

        Http::fake(['api.telegram.org/*' => Http::response(['ok' => true], 200)]);

        $response = $this->postJson('/api/telegram/inactive-readers');

        $response->assertOk()->assertJson([
            'ok' => true,
            'inactive_days' => 7,
            'readers_reached' => 2,
            'without_chat_id' => 1,
            'sent' => 1,
            'skipped' => 1,
            'failed' => 0,
        ]);

        Http::assertSentCount(1);

        // Only the inactive reader is nudged, with a come-back call to action.
        Http::assertSent(function ($request) use ($inactive) {
            return $request['chat_id'] === $inactive->chat_id
                && str_contains($request['text'], 'Jane Doe, we miss you!')
                && str_contains($request['text'], 'not opened your Bible study plan for 8 days')
                && $request['reply_markup']['inline_keyboard'][0][0]['text'] === 'Continue reading'
                && $request['reply_markup']['inline_keyboard'][0][0]['web_app']['url'] === 'https://mini.test/app';
        });

        $this->assertSame('active', $response->json('results.1.status'));
    }

    public function test_measures_readers_who_never_studied_from_sign_up(): void
    {
        $lapsedSignup = $this->makeReader('New And Quiet', 900000021);
        Reader::whereKey($lapsedSignup->id)->update(['created_at' => now()->subDays(10)]);

        $freshSignup = $this->makeReader('Just Joined', 900000022);
        Reader::whereKey($freshSignup->id)->update(['created_at' => now()->subDays(2)]);

        Http::fake(['api.telegram.org/*' => Http::response(['ok' => true], 200)]);

        $response = $this->postJson('/api/telegram/inactive-readers');

        $response->assertOk()->assertJson([
            'sent' => 1,
            'skipped' => 1,
            'failed' => 0,
        ]);

        Http::assertSent(function ($request) use ($lapsedSignup) {
            return $request['chat_id'] === $lapsedSignup->chat_id
                && str_contains($request['text'], 'not opened your Bible study plan for 10 days');
        });
    }

    public function test_accepts_a_custom_inactive_window(): void
    {
        $reader = $this->makeReader('Jane Doe', 900000031);
        $this->recordRead($reader, 5);

        Http::fake(['api.telegram.org/*' => Http::response(['ok' => true], 200)]);

        // Five days is recent against the one-week default, so nothing is sent…
        $this->postJson('/api/telegram/inactive-readers')
            ->assertOk()
            ->assertJson(['inactive_days' => 7, 'sent' => 0, 'skipped' => 1]);

        // …but counts as inactive once the caller asks for a narrower window.
        $this->postJson('/api/telegram/inactive-readers?days=3')
            ->assertOk()
            ->assertJson(['inactive_days' => 3, 'sent' => 1, 'skipped' => 0]);

        Http::assertSentCount(1);
    }

    public function test_reports_telegram_rejections_without_stopping_the_run(): void
    {
        $this->recordRead($this->makeReader('Jane Doe', 900000041), 9);
        $this->recordRead($this->makeReader('John Doe', 900000042), 9);

        // Every send is accepted except Jane's chat.
        Http::fake([
            'api.telegram.org/*' => Http::sequence()
                ->push(['ok' => false, 'description' => 'chat not found'], 400)
                ->push(['ok' => true], 200),
        ]);

        $response = $this->postJson('/api/telegram/inactive-readers');

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
        $this->recordRead($this->makeReader('Jane Doe', 900000051), 9);

        config(['services.telegram.broadcast_token' => 'super-secret']);

        Http::fake();

        $this->postJson('/api/telegram/inactive-readers')
            ->assertStatus(401)
            ->assertJson(['ok' => false, 'error' => 'invalid broadcast token']);

        $this->postJson('/api/telegram/inactive-readers', ['token' => 'wrong'])
            ->assertStatus(401);

        Http::assertNothingSent();

        $this->postJson('/api/telegram/inactive-readers', [], ['X-Broadcast-Token' => 'super-secret'])
            ->assertOk()
            ->assertJson(['sent' => 1]);

        Http::assertSentCount(1);
    }

    public function test_fails_clearly_when_the_bot_token_is_missing(): void
    {
        $this->recordRead($this->makeReader('Jane Doe', 900000061), 9);

        config(['services.telegram.bot_token' => null]);

        // The controller also checks env() directly, so clear every layer the
        // environment is read from — and put it back when the test is done.
        $fromEnv = $_ENV['TELEGRAM_BOT_TOKEN'] ?? null;
        $fromServer = $_SERVER['TELEGRAM_BOT_TOKEN'] ?? null;
        putenv('TELEGRAM_BOT_TOKEN');
        unset($_ENV['TELEGRAM_BOT_TOKEN'], $_SERVER['TELEGRAM_BOT_TOKEN']);

        try {
            Http::fake();

            $this->postJson('/api/telegram/inactive-readers')
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
}
