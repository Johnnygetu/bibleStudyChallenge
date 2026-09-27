<?php

namespace Tests\Feature;

use App\Models\TelegramUser;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TgUserIndexTest extends TestCase
{
    use RefreshDatabase;

    private int $nextChatId = 900000001;

    public function test_returns_200_with_all_registered_users_newest_first(): void
    {
        $oldest = $this->createUser();
        $newest = $this->createUser();

        $response = $this->getJson('/api/tg-users');

        $response->assertStatus(200)
            ->assertJsonCount(2)
            ->assertJsonStructure([
                ['id', 'chat_id', 'full_name', 'phone_number', 'created_at'],
            ]);

        $this->assertSame($newest->id, $response->json('0.id'));
        $this->assertSame($oldest->id, $response->json('1.id'));
    }

    public function test_returns_200_with_empty_list_when_no_users_exist(): void
    {
        $this->getJson('/api/tg-users')
            ->assertStatus(200)
            ->assertExactJson([]);
    }

    private function createUser(): TelegramUser
    {
        $chatId = $this->nextChatId++;

        return TelegramUser::create([
            'chat_id' => $chatId,
            'full_name' => 'Reader '.$chatId,
            'phone_number' => '+2519'.str_pad((string) $chatId, 9, '0', STR_PAD_LEFT),
        ]);
    }
}
