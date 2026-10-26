<?php

namespace Tests\Feature;

use App\Models\Reader;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ChurchMembershipTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'services.telegram.bot_token' => 'test-token',
            'services.telegram.main_youth_chat_id' => '-1002573898939',
        ]);
    }

    private function makeReader(string $phone, ?int $chatId): Reader
    {
        return Reader::create([
            'name' => 'Reader '.$phone,
            'phone_number' => $phone,
            'chat_id' => $chatId,
        ]);
    }

    /**
     * Answer each lookup from a user id to status map.
     *
     * @param  array<int, string|int>  $statusesByUserId
     */
    private function fakeMembershipLookups(array $statusesByUserId): void
    {
        Http::fake(function ($request) use ($statusesByUserId) {
            parse_str((string) parse_url($request->url(), PHP_URL_QUERY), $query);
            $userId = (int) ($query['user_id'] ?? 0);
            $status = $statusesByUserId[$userId] ?? null;

            if (is_int($status)) {
                return Http::response(['ok' => false, 'description' => 'chat not found'], $status);
            }

            if ($status === null) {
                return Http::response(['ok' => false, 'description' => 'user not found'], 400);
            }

            return Http::response(['ok' => true, 'result' => ['status' => $status]]);
        });
    }

    public function test_flags_readers_who_are_in_the_main_youth_group(): void
    {
        $member = $this->makeReader('+251911111111', 900000001);
        $absent = $this->makeReader('+251922222222', 900000002);
        $noChatId = $this->makeReader('+251933333333', null);

        $this->fakeMembershipLookups([
            900000001 => 'member',
            900000002 => 'left',
        ]);

        $this->postJson('/api/readers/check-church-membership')
            ->assertOk()
            ->assertJson([
                'ok' => true,
                'checked' => 2,
                'members' => 1,
                'skipped' => 1,
                'failed' => 0,
            ]);

        $this->assertDatabaseHas('readers', ['id' => $member->id, 'is_church_member' => true]);
        $this->assertDatabaseHas('readers', ['id' => $absent->id, 'is_church_member' => false]);
        $this->assertDatabaseHas('readers', ['id' => $noChatId->id, 'is_church_member' => false]);

        Http::assertSentCount(2);

        Http::assertSent(function ($request) {
            parse_str((string) parse_url($request->url(), PHP_URL_QUERY), $query);

            return str_contains($request->url(), '/getChatMember')
                && ($query['chat_id'] ?? null) === '-1002573898939';
        });
    }

    public function test_counts_failed_lookups_and_keeps_going(): void
    {
        $member = $this->makeReader('+251911111111', 900000001);
        $broken = $this->makeReader('+251922222222', 900000002);

        $this->fakeMembershipLookups([
            900000001 => 'creator',
            900000002 => 400,
        ]);

        $this->postJson('/api/readers/check-church-membership')
            ->assertOk()
            ->assertJson([
                'ok' => true,
                'checked' => 1,
                'members' => 1,
                'skipped' => 0,
                'failed' => 1,
            ]);

        $this->assertDatabaseHas('readers', ['id' => $member->id, 'is_church_member' => true]);
        $this->assertDatabaseHas('readers', ['id' => $broken->id, 'is_church_member' => false]);
    }

    public function test_skips_readers_without_a_telegram_chat_id(): void
    {
        $this->makeReader('+251911111111', null);
        $this->makeReader('+251922222222', null);

        Http::fake();

        $this->postJson('/api/readers/check-church-membership')
            ->assertOk()
            ->assertJson([
                'ok' => true,
                'checked' => 0,
                'members' => 0,
                'skipped' => 2,
                'failed' => 0,
            ]);

        Http::assertNothingSent();
    }

    public function test_reports_a_missing_main_youth_chat_id(): void
    {
        $this->makeReader('+251911111111', 900000001);

        config(['services.telegram.main_youth_chat_id' => null]);

        // The controller also reads env() directly, so clear every layer and
        // put the original value back when the test is done.
        $fromEnv = $_ENV['TELEGRAM_MAIN_YOUTH_CHAT_ID'] ?? null;
        $fromServer = $_SERVER['TELEGRAM_MAIN_YOUTH_CHAT_ID'] ?? null;
        putenv('TELEGRAM_MAIN_YOUTH_CHAT_ID');
        unset($_ENV['TELEGRAM_MAIN_YOUTH_CHAT_ID'], $_SERVER['TELEGRAM_MAIN_YOUTH_CHAT_ID']);

        try {
            Http::fake();

            $this->postJson('/api/readers/check-church-membership')
                ->assertStatus(500)
                ->assertJson(['ok' => false, 'error' => 'main youth chat id not configured']);

            Http::assertNothingSent();
        } finally {
            if ($fromEnv !== null) {
                $_ENV['TELEGRAM_MAIN_YOUTH_CHAT_ID'] = $fromEnv;
            }

            if ($fromServer !== null) {
                $_SERVER['TELEGRAM_MAIN_YOUTH_CHAT_ID'] = $fromServer;
            }
        }
    }
}
