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

    public function test_returns_the_existing_reader_when_the_chat_id_is_registered(): void
    {
        $existing = Reader::create([
            'name' => 'First Reader',
            'phone_number' => '+251922222222',
            'chat_id' => 900000002,
        ]);

        $response = $this->postJson('/api/readers', [
            'name' => 'Second Reader',
            'phone_number' => '+251933333333',
            'chat_id' => 900000002,
        ]);

        // The chat id already identifies a reader, so the same account comes
        // back and nothing new is stored.
        $response->assertStatus(200)
            ->assertJsonFragment([
                'id' => $existing->id,
                'name' => 'First Reader',
                'phone_number' => '+251922222222',
                'chat_id' => 900000002,
            ]);

        $this->assertSame(1, Reader::count());
    }

    public function test_rejects_a_phone_number_that_is_already_registered(): void
    {
        Reader::create([
            'name' => 'First Reader',
            'phone_number' => '+251911111111',
        ]);

        $response = $this->postJson('/api/readers', [
            'name' => 'Second Reader',
            'phone_number' => '+251911111111',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('phone_number');

        $this->assertStringContainsString('taken', $response->json('errors.phone_number.0'));

        // The duplicate is not stored.
        $this->assertSame(1, Reader::count());
    }

    public function test_rejects_a_taken_phone_number_even_with_a_new_chat_id(): void
    {
        Reader::create([
            'name' => 'First Reader',
            'phone_number' => '+251911111111',
        ]);

        $this->postJson('/api/readers', [
            'name' => 'Second Reader',
            'phone_number' => '+251911111111',
            'chat_id' => 900000005,
        ])->assertStatus(422)->assertJsonValidationErrors('phone_number');

        $this->assertSame(1, Reader::count());
    }

    public function test_a_known_chat_id_wins_over_the_phone_number_check(): void
    {
        $existing = Reader::create([
            'name' => 'First Reader',
            'phone_number' => '+251911111111',
            'chat_id' => 900000004,
        ]);

        // The same Telegram account relaunching matches on the chat id, so the
        // account comes back even though that phone number is already on file.
        $response = $this->postJson('/api/readers', [
            'name' => 'First Reader',
            'phone_number' => '+251911111111',
            'chat_id' => 900000004,
        ]);

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $existing->id]);

        $this->assertSame(1, Reader::count());
    }

    public function test_rejects_an_update_to_a_phone_number_that_is_taken(): void
    {
        Reader::create([
            'name' => 'First Reader',
            'phone_number' => '+251911111111',
        ]);
        $second = Reader::create([
            'name' => 'Second Reader',
            'phone_number' => '+251922222222',
        ]);

        $this->patchJson("/api/readers/{$second->id}", [
            'phone_number' => '+251911111111',
        ])->assertStatus(422)->assertJsonValidationErrors('phone_number');

        $this->assertDatabaseHas('readers', [
            'id' => $second->id,
            'phone_number' => '+251922222222',
        ]);
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
