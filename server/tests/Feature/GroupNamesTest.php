<?php

namespace Tests\Feature;

use App\Models\Group;
use App\Models\Reader;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GroupNamesTest extends TestCase
{
    use RefreshDatabase;

    public function test_returns_only_ids_and_names(): void
    {
        $group = Group::create(['name' => 'Group 1']);
        $reader = Reader::create(['name' => 'Reader', 'phone_number' => '+251911111111']);
        $group->readers()->attach($reader->id);

        $this->getJson('/api/groups/names')
            ->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonPath('0.id', $group->id)
            ->assertJsonPath('0.name', 'Group 1')
            ->assertJsonMissingPath('0.readers_count');
    }
}
