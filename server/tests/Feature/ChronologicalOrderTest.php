<?php

namespace Tests\Feature;

use App\Models\BookChapter;
use App\Models\ChronologicalOrder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ChronologicalOrderTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        BookChapter::create([
            'id' => 1,
            'book' => 'Genesis',
            'chapter_number' => 1,
            'num_verses' => 31,
        ]);
        BookChapter::create([
            'id' => 2,
            'book' => 'Genesis',
            'chapter_number' => 2,
            'num_verses' => 25,
        ]);
        BookChapter::create([
            'id' => 3,
            'book' => 'Genesis',
            'chapter_number' => 3,
            'num_verses' => 24,
        ]);
        BookChapter::create([
            'id' => 4,
            'book' => 'Genesis',
            'chapter_number' => 4,
            'num_verses' => 26,
        ]);
    }

    public function test_can_add_chapters_to_chronological_order_via_post_body(): void
    {
        $response = $this->postJson('/api/chronological-order', [
            'starting_id' => 1,
            'ending_id' => 3,
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Successfully added 3 chapters to chronological order.',
                'count' => 3,
                'starting_id' => 1,
                'ending_id' => 3,
            ]);

        $this->assertDatabaseCount('chronological_order', 3);
        $this->assertDatabaseHas('chronological_order', ['chapter_id' => 1]);
        $this->assertDatabaseHas('chronological_order', ['chapter_id' => 2]);
        $this->assertDatabaseHas('chronological_order', ['chapter_id' => 3]);
    }

    public function test_can_add_chapters_via_route_parameters(): void
    {
        $response = $this->postJson('/api/chronological-orders/2/4');

        $response->assertStatus(201)
            ->assertJson([
                'count' => 3,
                'starting_id' => 2,
                'ending_id' => 4,
            ]);

        $this->assertDatabaseCount('chronological_order', 3);
        $this->assertDatabaseHas('chronological_order', ['chapter_id' => 2]);
        $this->assertDatabaseHas('chronological_order', ['chapter_id' => 3]);
        $this->assertDatabaseHas('chronological_order', ['chapter_id' => 4]);
    }

    public function test_can_add_chapters_in_reverse_order(): void
    {
        $response = $this->postJson('/api/chronological-order', [
            'starting_id' => 3,
            'ending_id' => 1,
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'count' => 3,
            ]);

        $orderedEntries = ChronologicalOrder::orderBy('id')->get();
        $this->assertEquals([3, 2, 1], $orderedEntries->pluck('chapter_id')->all());
    }

    public function test_validation_fails_when_ids_missing_or_invalid(): void
    {
        $response = $this->postJson('/api/chronological-order', [
            'starting_id' => 'abc',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['starting_id', 'ending_id']);
    }

    public function test_returns_404_when_no_chapters_found_in_range(): void
    {
        $response = $this->postJson('/api/chronological-order', [
            'starting_id' => 100,
            'ending_id' => 150,
        ]);

        $response->assertStatus(404)
            ->assertJson([
                'message' => 'No book chapters were found in the range from ID 100 to 150.',
            ]);
    }

    public function test_can_retrieve_chronological_orders_with_chapter(): void
    {
        $this->postJson('/api/chronological-order', [
            'starting_id' => 1,
            'ending_id' => 2,
        ]);

        $response = $this->getJson('/api/chronological-orders');

        $response->assertStatus(200)
            ->assertJsonCount(2)
            ->assertJsonStructure([
                '*' => [
                    'id',
                    'chapter_id',
                    'created_at',
                    'updated_at',
                    'chapter' => [
                        'id',
                        'book',
                        'chapter_number',
                        'num_verses',
                    ],
                ],
            ]);
    }
}
