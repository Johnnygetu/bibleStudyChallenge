<?php

namespace Tests\Feature;

use App\Models\Reader;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SetChurchMembershipTest extends TestCase
{
    use RefreshDatabase;

    private function makeReader(): Reader
    {
        return Reader::create([
            'name' => 'Jane Doe',
            'phone_number' => '+251911111111',
        ]);
    }

    public function test_records_the_readers_yes_answer(): void
    {
        $reader = $this->makeReader();

        $this->putJson("/api/readers/{$reader->id}/set-church-membership", [
            'is_church_member' => true,
        ])
            ->assertOk()
            ->assertJsonFragment(['id' => $reader->id, 'is_church_member' => true]);

        $this->assertDatabaseHas('readers', [
            'id' => $reader->id,
            'is_church_member' => true,
        ]);
    }

    public function test_records_the_readers_no_answer(): void
    {
        $reader = $this->makeReader();
        // Start from a yes so the no answer has to overwrite it, not just miss.
        $reader->update(['is_church_member' => true]);

        $this->putJson("/api/readers/{$reader->id}/set-church-membership", [
            'is_church_member' => false,
        ])->assertOk();

        $this->assertDatabaseHas('readers', [
            'id' => $reader->id,
            'is_church_member' => false,
        ]);
    }

    public function test_requires_the_answer(): void
    {
        $reader = $this->makeReader();

        $this->putJson("/api/readers/{$reader->id}/set-church-membership", [])
            ->assertStatus(422)
            ->assertJsonValidationErrors('is_church_member');
    }
}
