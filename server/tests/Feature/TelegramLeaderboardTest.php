<?php

namespace Tests\Feature;

use App\Models\Group;
use App\Models\Reader;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class TelegramLeaderboardTest extends TestCase
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

    private function makeReader(string $name, int $score, int $streak): Reader
    {
        $reader = Reader::create([
            'name' => $name,
            'phone_number' => '+2519'.random_int(10000000, 99999999),
        ]);

        $reader->scores()->create(['score' => $score]);
        $reader->streaks()->create(['count' => $streak]);

        return $reader;
    }

    private function makeGroup(string $name, array $readers = []): Group
    {
        $group = Group::create(['name' => $name]);

        foreach ($readers as $reader) {
            $group->readers()->attach($reader->id);
        }

        return $group;
    }

    public function test_posts_the_ranked_leaderboard_to_the_group(): void
    {
        $this->makeReader('Jane Doe', 42, 12);
        $this->makeReader('John Doe', 38, 9);
        $this->makeReader('Ann Smith', 10, 3);

        Http::fake(['api.telegram.org/*' => Http::response(['ok' => true], 200)]);

        $response = $this->postJson('/api/telegram/leaderboard');

        $response->assertOk()->assertJson([
            'ok' => true,
            'sent' => true,
            'chat_id' => '-1001234567890',
            'date' => now()->toDateString(),
            'readers_ranked' => 3,
            'groups_ranked' => 0,
        ]);

        Http::assertSentCount(1);

        Http::assertSent(function ($request) {
            $text = $request['text'];

            return $request['chat_id'] === '-1001234567890'
                && $request['parse_mode'] === 'HTML'
                && str_contains($text, '🏆 <b>Bible Challenge leaderboard</b>')
                && str_contains($text, '<b>Top readers</b>')
                && str_contains($text, '1. Jane Doe — 42 pts · 12-day streak')
                && str_contains($text, '2. John Doe — 38 pts · 9-day streak')
                && str_contains($text, '3. Ann Smith — 10 pts · 3-day streak')
                && strpos($text, 'Jane Doe') < strpos($text, 'John Doe')
                && $request['reply_markup']['inline_keyboard'][0][0]['text'] === 'Open leaderboard'
                && $request['reply_markup']['inline_keyboard'][0][0]['web_app']['url'] === 'https://mini.test/app';
        });
    }

    public function test_breaks_score_ties_by_name(): void
    {
        $this->makeReader('Zoe Adams', 20, 4);
        $this->makeReader('Ann Baker', 20, 1);

        Http::fake(['api.telegram.org/*' => Http::response(['ok' => true], 200)]);

        $response = $this->postJson('/api/telegram/leaderboard')->assertOk();

        $message = $response->json('message');

        $this->assertStringContainsString('1. Ann Baker — 20 pts · 1-day streak', $message);
        $this->assertStringContainsString('2. Zoe Adams — 20 pts · 4-day streak', $message);
    }

    public function test_posts_only_the_top_ten_readers(): void
    {
        for ($i = 0; $i < 12; $i++) {
            $this->makeReader('Reader '.str_pad((string) $i, 2, '0', STR_PAD_LEFT), 100 - $i, 1);
        }

        Http::fake(['api.telegram.org/*' => Http::response(['ok' => true], 200)]);

        $response = $this->postJson('/api/telegram/leaderboard')->assertOk();

        $message = $response->json('message');

        // 12 readers are ranked, but only ten rows go into the message.
        $this->assertSame(12, $response->json('readers_ranked'));
        $this->assertStringContainsString('10. Reader 09 — 91 pts', $message);

        preg_match_all('/^(\d+)\. /m', $message, $matches);
        $this->assertSame(range(1, 10), array_map('intval', $matches[1]));
        $this->assertStringNotContainsString('Reader 10', $message);
    }

    public function test_includes_group_standings_when_groups_have_members(): void
    {
        $jane = $this->makeReader('Jane Doe', 50, 5);
        $john = $this->makeReader('John Doe', 30, 5);
        $this->makeReader('Ann Smith', 5, 1);

        $this->makeGroup('Group A', [$jane, $john]);
        $this->makeGroup('Group B', []);

        Http::fake(['api.telegram.org/*' => Http::response(['ok' => true], 200)]);

        $response = $this->postJson('/api/telegram/leaderboard')->assertOk();

        $message = $response->json('message');

        $this->assertSame(1, $response->json('groups_ranked'));
        $this->assertStringContainsString('<b>Top groups</b>', $message);
        $this->assertStringContainsString('1. Group A — 80 pts · 2 members (avg 40)', $message);

        // A group with no members is noise, so it is left out entirely.
        $this->assertStringNotContainsString('Group B', $message);
    }

    public function test_omits_the_group_section_when_no_group_has_members(): void
    {
        $this->makeReader('Jane Doe', 42, 12);
        $this->makeGroup('Group A', []);

        Http::fake(['api.telegram.org/*' => Http::response(['ok' => true], 200)]);

        $response = $this->postJson('/api/telegram/leaderboard')->assertOk();

        $this->assertSame(0, $response->json('groups_ranked'));
        $this->assertStringNotContainsString('Top groups', $response->json('message'));
    }

    public function test_sends_nothing_when_there_are_no_readers(): void
    {
        Http::fake();

        $this->postJson('/api/telegram/leaderboard')
            ->assertOk()
            ->assertJson([
                'ok' => true,
                'sent' => false,
                'chat_id' => '-1001234567890',
                'reason' => 'leaderboard is empty',
            ]);

        Http::assertNothingSent();
    }

    public function test_reports_a_missing_group_chat_id(): void
    {
        $this->makeReader('Jane Doe', 42, 12);

        config(['services.telegram.group_chat_id' => null]);

        // The controller also checks env() directly, so clear every layer the
        // environment is read from — and put it back when the test is done.
        $fromEnv = $_ENV['TELEGRAM_GROUP_CHAT_ID'] ?? null;
        $fromServer = $_SERVER['TELEGRAM_GROUP_CHAT_ID'] ?? null;
        putenv('TELEGRAM_GROUP_CHAT_ID');
        unset($_ENV['TELEGRAM_GROUP_CHAT_ID'], $_SERVER['TELEGRAM_GROUP_CHAT_ID']);

        try {
            Http::fake();

            $this->postJson('/api/telegram/leaderboard')
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
        $this->makeReader('Jane Doe', 42, 12);

        config(['services.telegram.broadcast_token' => 'super-secret']);

        Http::fake();

        $this->postJson('/api/telegram/leaderboard')
            ->assertStatus(401)
            ->assertJson(['ok' => false, 'error' => 'invalid broadcast token']);

        $this->postJson('/api/telegram/leaderboard', ['token' => 'wrong'])
            ->assertStatus(401);

        Http::assertNothingSent();

        $this->postJson('/api/telegram/leaderboard', [], ['X-Broadcast-Token' => 'super-secret'])
            ->assertOk()
            ->assertJson(['sent' => true]);

        Http::assertSentCount(1);
    }

    public function test_reports_when_telegram_rejects_the_post(): void
    {
        $this->makeReader('Jane Doe', 42, 12);

        Http::fake(['api.telegram.org/*' => Http::response(['ok' => false, 'description' => 'chat not found'], 400)]);

        $this->postJson('/api/telegram/leaderboard')
            ->assertStatus(500)
            ->assertJson([
                'ok' => false,
                'sent' => false,
                'error' => 'failed to send leaderboard',
            ]);

        Http::assertSentCount(1);
    }
}
