<?php

namespace Tests\Feature;

use App\Models\Reader;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReaderStoreTest extends TestCase
{
    use RefreshDatabase;

    public function test_creates_reader_without_chat_id(): void
    {
        $response = $this->postJson('/api/readers', [
            'name' => 'Jane Doe',
            'phone_number' => '+251911111111',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['id', 'name', 'phone_number', 'chat_id']);

        $this->assertDatabaseHas('readers', [
            'id' => $response->json('id'),
            'name' => 'Jane Doe',
            'phone_number' => '+251911111111',
            'chat_id' => null,
        ]);
    }

    public function test_creates_reader_with_telegram_chat_id(): void
    {
        $response = $this->postJson('/api/readers', [
            'name' => 'Jane Doe',
            'phone_number' => '+251911111111',
            'chat_id' => 900000001,
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('readers', [
            'id' => $response->json('id'),
            'chat_id' => 900000001,
        ]);
    }

    public function test_rejects_duplicate_chat_id(): void
    {
        Reader::create([
            'name' => 'First Reader',
            'phone_number' => '+251922222222',
            'chat_id' => 900000002,
        ]);

        $this->postJson('/api/readers', [
            'name' => 'Second Reader',
            'phone_number' => '+251933333333',
            'chat_id' => 900000002,
        ])->assertStatus(422)
            ->assertJsonValidationErrors('chat_id');
    }

    public function test_requires_name_and_phone_number(): void
    {
        $this->postJson('/api/readers', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'phone_number']);
    }

    public function test_attaches_chat_id_to_existing_reader(): void
    {
        $reader = Reader::create([
            'name' => 'Jane Doe',
            'phone_number' => '+251911111111',
        ]);

        $this->patchJson("/api/readers/{$reader->id}", [
            'chat_id' => 900000003,
        ])->assertStatus(200);

        $this->assertDatabaseHas('readers', [
            'id' => $reader->id,
            'chat_id' => 900000003,
        ]);
    }
}
