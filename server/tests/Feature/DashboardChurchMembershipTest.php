<?php

namespace Tests\Feature;

use App\Models\Reader;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardChurchMembershipTest extends TestCase
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

    public function test_reports_the_church_membership_breakdown(): void
    {
        $this->makeReader('Member One', true);
        $this->makeReader('Member Two', true);
        $this->makeReader('Not Member', false);
        $this->makeReader('Unanswered', null);

        $this->getJson('/api/dashboard')
            ->assertOk()
            ->assertJson([
                'church_members' => 2,
                'non_church_members' => 1,
                'unknown_church_members' => 1,
            ]);
    }
}
