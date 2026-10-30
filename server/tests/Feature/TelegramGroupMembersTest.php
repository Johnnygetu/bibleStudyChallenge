<?php

namespace Tests\Feature;

use App\Models\Group;
use App\Models\Reader;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class TelegramGroupMembersTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'services.telegram.bot_token' => 'test-token',
            'services.telegram.broadcast_token' => null,
        ]);
    }

    private function makeReader(string $name, ?int $chatId, ?bool $isChurchMember = true): Reader
    {
        return Reader::create([
            'name' => $name,
            'phone_number' => '+2519'.random_int(10000000, 99999999),
            'chat_id' => $chatId,
            'is_church_member' => $isChurchMember,
        ]);
    }

    public function test_messages_every_church_member_with_the_roster_and_leader(): void
    {
        $group = Group::create(['name' => 'Group 1']);
        $leader = $this->makeReader('Jane Doe', 111);
        $member = $this->makeReader('John Doe', 222);
        $group->readers()->attach($leader->id, ['is_leader' => true]);
        $group->readers()->attach($member->id);

        Http::fake(['api.telegram.org/*' => Http::response(['ok' => true], 200)]);

        $this->postJson('/api/telegram/group-members')
            ->assertOk()
            ->assertJson([
                'ok' => true,
                'groups' => 1,
                'sent' => 2,
                'skipped' => 0,
                'failed' => 0,
            ]);

        Http::assertSentCount(2);

        Http::assertSent(function ($request) {
            return $request['chat_id'] === 111
                && $request['parse_mode'] === 'HTML'
                && str_contains($request['text'], '👥 <b>Group 1</b>')
                && str_contains($request['text'], 'Leader: <b>Jane Doe</b>')
                && str_contains($request['text'], '• Jane Doe (leader)')
                && str_contains($request['text'], '• John Doe');
        });

        Http::assertSent(fn ($request) => $request['chat_id'] === 222);
    }

    public function test_skips_non_church_members_and_readers_without_a_chat_id(): void
    {
        $group = Group::create(['name' => 'Group 1']);
        $member = $this->makeReader('Jane Doe', 111);
        $noChat = $this->makeReader('No Chat', null);
        $notMember = $this->makeReader('Not Member', 333, false);
        $group->readers()->attach($member->id);
        $group->readers()->attach($noChat->id);
        $group->readers()->attach($notMember->id);

        Http::fake(['api.telegram.org/*' => Http::response(['ok' => true], 200)]);

        $this->postJson('/api/telegram/group-members')
            ->assertOk()
            ->assertJson([
                'sent' => 1,
                'skipped' => 1,
                'failed' => 0,
            ]);

        Http::assertSentCount(1);
        Http::assertSent(fn ($request) => $request['chat_id'] === 111);
    }

    public function test_reports_a_missing_bot_token(): void
    {
        config(['services.telegram.bot_token' => null]);
        putenv('TELEGRAM_BOT_TOKEN');
        unset($_ENV['TELEGRAM_BOT_TOKEN'], $_SERVER['TELEGRAM_BOT_TOKEN']);

        Http::fake();

        $this->postJson('/api/telegram/group-members')
            ->assertStatus(500)
            ->assertJson(['ok' => false, 'error' => 'bot token not configured']);

        Http::assertNothingSent();

        putenv('TELEGRAM_BOT_TOKEN=test-token');
    }

    public function test_requires_the_broadcast_token_when_one_is_configured(): void
    {
        config(['services.telegram.broadcast_token' => 'super-secret']);

        Http::fake();

        $this->postJson('/api/telegram/group-members')
            ->assertStatus(401)
            ->assertJson(['ok' => false, 'error' => 'invalid broadcast token']);

        Http::assertNothingSent();
    }
}
