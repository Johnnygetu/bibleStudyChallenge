<?php

namespace Tests\Feature;

use App\Models\Reader;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReaderIndexTest extends TestCase
{
    use RefreshDatabase;

    private int $nextChatId = 900000001;

    public function test_returns_200_with_all_readers(): void
    {
        $this->createReader();
        $newest = $this->createReader();

        $response = $this->getJson('/api/readers');

        $response->assertStatus(200)
            ->assertJsonCount(2)
            ->assertJsonStructure([
                ['id', 'name', 'phone_number', 'chat_id', 'created_at'],
            ]);

        $this->assertSame($newest->id, $response->json('1.id'));
    }

    public function test_returns_200_with_empty_list_when_no_readers_exist(): void
    {
        $this->getJson('/api/readers')
            ->assertStatus(200)
            ->assertExactJson([]);
    }

    private function createReader(): Reader
    {
        $chatId = $this->nextChatId++;

        return Reader::create([
            'name' => 'Reader '.$chatId,
            'phone_number' => '+2519'.str_pad((string) $chatId, 9, '0', STR_PAD_LEFT),
            'chat_id' => $chatId,
        ]);
    }
}
