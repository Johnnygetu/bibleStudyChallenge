<?php

namespace Tests\Feature;

use App\Models\Reader;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PostsApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_stores_a_post_and_returns_the_feed_shape(): void
    {
        $reader = Reader::create([
            'name' => 'Jane Doe',
            'phone_number' => '+251911111111',
        ]);

        $response = $this->postJson('/api/posts', [
            'readerId' => $reader->id,
            'postContent' => 'Day 12 finished! Nehemiah is a joy to read.',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'readerName' => 'Jane Doe',
                'postContent' => 'Day 12 finished! Nehemiah is a joy to read.',
                'likesCount' => 0,
            ]);

        $this->assertDatabaseHas('posts', [
            'id' => $response->json('id'),
            'readerId' => $reader->id,
            'postContent' => 'Day 12 finished! Nehemiah is a joy to read.',
        ]);
    }

    public function test_requires_content_and_a_known_reader(): void
    {
        $this->postJson('/api/posts', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['readerId', 'postContent']);

        $this->postJson('/api/posts', [
            'readerId' => 999999,
            'postContent' => 'No such reader.',
        ])->assertStatus(422)
            ->assertJsonValidationErrors('readerId');

        $this->postJson('/api/posts', [
            'readerId' => Reader::create([
                'name' => 'Jane Doe',
                'phone_number' => '+251911111111',
            ])->id,
            'postContent' => str_repeat('x', 5001),
        ])->assertStatus(422)
            ->assertJsonValidationErrors('postContent');
    }

    public function test_index_lists_posts_newest_first_with_the_author_name(): void
    {
        $reader = Reader::create([
            'name' => 'Jane Doe',
            'phone_number' => '+251911111111',
        ]);

        $first = $this->postJson('/api/posts', [
            'readerId' => $reader->id,
            'postContent' => 'First note.',
        ])->assertStatus(201)->json('id');

        sleep(1);

        $second = $this->postJson('/api/posts', [
            'readerId' => $reader->id,
            'postContent' => 'Second note.',
        ])->assertStatus(201)->json('id');

        $feed = $this->getJson('/api/posts')
            ->assertStatus(200)
            ->assertJsonStructure(['data' => [['id', 'readerName', 'postContent', 'createdAt', 'likesCount']]])
            ->json('data');

        $this->assertSame([$second, $first], array_map(fn ($row) => $row['id'], $feed));
        $this->assertSame('Jane Doe', $feed[0]['readerName']);
    }
}
