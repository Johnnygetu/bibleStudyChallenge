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

    private function makeReader(?int $chatId = 900000001): Reader
    {
        return Reader::create([
            'name' => 'Jane Doe',
            'phone_number' => '+251911111111',
            'chat_id' => $chatId,
        ]);
    }

    public function test_flags_the_reader_when_they_are_in_the_main_youth_group(): void
    {
        $reader = $this->makeReader();

        Http::fake(['api.telegram.org/*' => Http::response([
            'ok' => true,
            'result' => ['status' => 'member'],
        ])]);

        $this->postJson("/api/readers/{$reader->id}/check-church-membership")
            ->assertOk()
            ->assertJson([
                'ok' => true,
                'reader_id' => $reader->id,
                'is_church_member' => true,
            ]);

        $this->assertDatabaseHas('readers', [
            'id' => $reader->id,
            'is_church_member' => true,
        ]);

        Http::assertSent(function ($request) {
            parse_str((string) parse_url($request->url(), PHP_URL_QUERY), $query);

            return str_contains($request->url(), '/getChatMember')
                && ($query['chat_id'] ?? null) === '-1002573898939'
                && ($query['user_id'] ?? null) === '900000001';
        });
    }

    public function test_counts_a_restricted_reader_as_a_member_when_telegram_says_so(): void
    {
        $reader = $this->makeReader();

        Http::fake(['api.telegram.org/*' => Http::response([
            'ok' => true,
            'result' => ['status' => 'restricted', 'is_member' => true],
        ])]);

        $this->postJson("/api/readers/{$reader->id}/check-church-membership")
            ->assertOk()
            ->assertJson(['is_church_member' => true]);
    }

    public function test_leaves_the_reader_alone_when_they_left_the_group(): void
    {
        $reader = $this->makeReader();

        Http::fake(['api.telegram.org/*' => Http::response([
            'ok' => true,
            'result' => ['status' => 'left'],
        ])]);

        $this->postJson("/api/readers/{$reader->id}/check-church-membership")
            ->assertOk()
            ->assertJson([
                'ok' => true,
                'is_church_member' => null,
            ]);

        // A non-member is not written: the column keeps its null "not answered".
        $this->assertDatabaseHas('readers', [
            'id' => $reader->id,
            'is_church_member' => null,
        ]);
    }

    public function test_reports_a_reader_without_a_telegram_chat_id(): void
    {
        $reader = $this->makeReader(null);

        Http::fake();

        $this->postJson("/api/readers/{$reader->id}/check-church-membership")
            ->assertStatus(422)
            ->assertJson([
                'ok' => false,
                'error' => 'reader has no telegram chat id',
            ]);

        Http::assertNothingSent();
    }

    public function test_reports_when_telegram_rejects_the_lookup(): void
    {
        $reader = $this->makeReader();

        Http::fake(['api.telegram.org/*' => Http::response([
            'ok' => false,
            'description' => 'chat not found',
        ], 400)]);

        $this->postJson("/api/readers/{$reader->id}/check-church-membership")
            ->assertStatus(500)
            ->assertJson([
                'ok' => false,
                'error' => 'failed to check group membership',
            ]);
    }

    public function test_reports_a_missing_main_youth_chat_id(): void
    {
        $reader = $this->makeReader();

        config(['services.telegram.main_youth_chat_id' => null]);

        // The controller also reads env() directly, so clear every layer and
        // put the original value back when the test is done.
        $fromEnv = $_ENV['TELEGRAM_MAIN_YOUTH_CHAT_ID'] ?? null;
        $fromServer = $_SERVER['TELEGRAM_MAIN_YOUTH_CHAT_ID'] ?? null;
        putenv('TELEGRAM_MAIN_YOUTH_CHAT_ID');
        unset($_ENV['TELEGRAM_MAIN_YOUTH_CHAT_ID'], $_SERVER['TELEGRAM_MAIN_YOUTH_CHAT_ID']);

        try {
            Http::fake();

            $this->postJson("/api/readers/{$reader->id}/check-church-membership")
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
