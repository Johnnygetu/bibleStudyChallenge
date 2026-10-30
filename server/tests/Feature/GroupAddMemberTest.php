<?php

namespace Tests\Feature;

use App\Models\Group;
use App\Models\Reader;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GroupAddMemberTest extends TestCase
{
    use RefreshDatabase;

    private function makeReader(string $name): Reader
    {
        return Reader::create([
            'name' => $name,
            'phone_number' => '+251911111111',
        ]);
    }

    public function test_adds_a_reader_to_a_group(): void
    {
        $group = Group::create(['name' => 'Group 1']);
        $reader = $this->makeReader('Reader');

        $this->postJson("/api/groups/{$group->id}/members", ['reader_id' => $reader->id])
            ->assertStatus(201)
            ->assertJsonPath('readers.0.id', $reader->id);

        $this->assertDatabaseHas('members', [
            'group_id' => $group->id,
            'reader_id' => $reader->id,
        ]);
    }

    public function test_rejects_adding_a_reader_already_in_the_group(): void
    {
        $group = Group::create(['name' => 'Group 1']);
        $reader = $this->makeReader('Reader');
        $group->readers()->attach($reader->id);

        $this->postJson("/api/groups/{$group->id}/members", ['reader_id' => $reader->id])
            ->assertStatus(422)
            ->assertJson(['message' => 'That reader is already in this group.']);

        $this->assertDatabaseCount('members', 1);
    }

    public function test_moves_a_reader_from_another_group(): void
    {
        $from = Group::create(['name' => 'Group 1']);
        $to = Group::create(['name' => 'Group 2']);
        $reader = $this->makeReader('Reader');
        $from->readers()->attach($reader->id);

        $this->postJson("/api/groups/{$to->id}/members", ['reader_id' => $reader->id])
            ->assertStatus(201);

        $this->assertDatabaseMissing('members', ['group_id' => $from->id, 'reader_id' => $reader->id]);
        $this->assertDatabaseHas('members', ['group_id' => $to->id, 'reader_id' => $reader->id]);
    }

    public function test_requires_an_existing_reader(): void
    {
        $group = Group::create(['name' => 'Group 1']);

        $this->postJson("/api/groups/{$group->id}/members", ['reader_id' => 999])
            ->assertStatus(422)
            ->assertJsonValidationErrors('reader_id');
    }
}
