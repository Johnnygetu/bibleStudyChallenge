<?php

namespace Tests\Feature;

use App\Models\Group;
use App\Models\Reader;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GroupAssignRandomTest extends TestCase
{
    use RefreshDatabase;

    private function makeReader(string $name, ?bool $isChurchMember): Reader
    {
        return Reader::create([
            'name' => $name,
            'phone_number' => '+251911111111',
            'is_church_member' => $isChurchMember,
        ]);
    }

    public function test_only_assigns_readers_that_are_church_members(): void
    {
        $member = $this->makeReader('Member', true);
        $notMember = $this->makeReader('Not Member', false);
        $unanswered = $this->makeReader('Unanswered', null);

        $this->postJson('/api/groups/assign-random', ['members_per_group' => 3])
            ->assertStatus(201);

        $group = Group::with('readers')->firstOrFail();

        $this->assertSame([$member->id], $group->readers->pluck('id')->all());
        $this->assertDatabaseMissing('members', ['reader_id' => $notMember->id]);
        $this->assertDatabaseMissing('members', ['reader_id' => $unanswered->id]);
    }

    public function test_creates_enough_groups_for_the_requested_group_size(): void
    {
        foreach (range(1, 5) as $n) {
            $this->makeReader("Member {$n}", true);
        }

        $this->postJson('/api/groups/assign-random', ['members_per_group' => 2])
            ->assertStatus(201);

        $groups = Group::withCount('readers')->get();

        $this->assertCount(3, $groups);
        $this->assertLessThanOrEqual(2, $groups->max('readers_count'));
        $this->assertSame(5, $groups->sum('readers_count'));
    }

    public function test_reports_when_there_are_no_church_members_to_assign(): void
    {
        $this->makeReader('Not Member', false);
        $this->makeReader('Unanswered', null);

        $this->postJson('/api/groups/assign-random', ['members_per_group' => 2])
            ->assertStatus(422)
            ->assertJson(['message' => 'There are no readers to assign to groups yet.']);

        $this->assertDatabaseCount('groups', 0);
    }
}
