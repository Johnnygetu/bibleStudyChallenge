<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\PostLike;
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
                'readerId' => $reader->id,
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
            ->assertJsonStructure(['data' => [['id', 'readerId', 'readerName', 'postContent', 'createdAt', 'likesCount']]])
            ->json('data');

        $this->assertSame([$second, $first], array_map(fn ($row) => $row['id'], $feed));
        $this->assertSame('Jane Doe', $feed[0]['readerName']);
    }

    public function test_index_counts_the_likes_stored_for_each_post(): void
    {
        $author = Reader::create([
            'name' => 'Author Reader',
            'phone_number' => '+251911111111',
        ]);
        $liker = Reader::create([
            'name' => 'Liker Reader',
            'phone_number' => '+251922222222',
        ]);

        $post = $this->postJson('/api/posts', [
            'readerId' => $author->id,
            'postContent' => 'A note that will collect likes.',
        ])->assertStatus(201)->json('id');

        $empty = $this->postJson('/api/posts', [
            'readerId' => $author->id,
            'postContent' => 'A note nobody liked yet.',
        ])->assertStatus(201)->json('id');

        // Two likes on the first post — the unique index keeps a single
        // reader from liking the same post twice.
        PostLike::create(['post_id' => $post, 'reader_id' => $liker->id]);
        PostLike::create(['post_id' => $post, 'reader_id' => $author->id]);

        $feed = $this->getJson('/api/posts')->json('data');
        $counts = collect($feed)->keyBy('id')->map(fn ($row) => $row['likesCount']);

        $this->assertSame(2, $counts[$post]);
        $this->assertSame(0, $counts[$empty]);
    }

    public function test_deletes_a_post_for_its_author_only(): void
    {
        $author = Reader::create([
            'name' => 'Author Reader',
            'phone_number' => '+251911111111',
        ]);
        $other = Reader::create([
            'name' => 'Other Reader',
            'phone_number' => '+251922222222',
        ]);

        $post = $this->postJson('/api/posts', [
            'readerId' => $author->id,
            'postContent' => 'A note its author will delete.',
        ])->assertStatus(201)->json('id');

        // Another reader cannot remove someone else's note.
        $this->deleteJson("/api/posts/{$post}", [
            'readerId' => $other->id,
        ])->assertStatus(403);

        $this->assertDatabaseHas('posts', ['id' => $post]);

        // The author can, and the row goes away.
        $this->deleteJson("/api/posts/{$post}", [
            'readerId' => $author->id,
        ])->assertStatus(204);

        $this->assertDatabaseMissing('posts', ['id' => $post]);
    }
}
