<?php

namespace Tests\Feature;

use App\Models\Group;
use App\Models\Reader;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GroupRemoveMemberTest extends TestCase
{
    use RefreshDatabase;

    private function makeReader(string $name): Reader
    {
        return Reader::create([
            'name' => $name,
            'phone_number' => '+251911111111',
        ]);
    }

    public function test_removes_a_reader_from_a_group(): void
    {
        $group = Group::create(['name' => 'Group 1']);
        $reader = $this->makeReader('Reader');
        $group->readers()->attach($reader->id);

        $this->deleteJson("/api/groups/{$group->id}/members/{$reader->id}")
            ->assertStatus(204);

        $this->assertDatabaseMissing('members', [
            'group_id' => $group->id,
            'reader_id' => $reader->id,
        ]);
        $this->assertDatabaseHas('readers', ['id' => $reader->id]);
    }

    public function test_removes_a_leader_from_a_group(): void
    {
        $group = Group::create(['name' => 'Group 1']);
        $reader = $this->makeReader('Reader');
        $group->readers()->attach($reader->id, ['is_leader' => true]);

        $this->deleteJson("/api/groups/{$group->id}/members/{$reader->id}")
            ->assertStatus(204);

        $this->assertDatabaseMissing('members', [
            'group_id' => $group->id,
            'reader_id' => $reader->id,
        ]);
    }

    public function test_rejects_removing_a_reader_not_in_the_group(): void
    {
        $group = Group::create(['name' => 'Group 1']);
        $reader = $this->makeReader('Reader');

        $this->deleteJson("/api/groups/{$group->id}/members/{$reader->id}")
            ->assertStatus(422)
            ->assertJson(['message' => 'That reader is not in this group.']);
    }
}
