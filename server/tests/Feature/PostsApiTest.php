<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\PostLike;
use App\Models\Reader;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
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
            ->assertJsonStructure(['data' => [['id', 'readerId', 'readerName', 'postContent', 'createdAt', 'likesCount', 'likedByMe']]])
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

        // Without a readerId no row can claim "liked by me".
        $this->assertFalse((bool) collect($feed)->keyBy('id')[$post]['likedByMe']);

        // With the liker's readerId only the posts they liked are flagged.
        $likerFeed = collect($this->getJson("/api/posts?readerId={$liker->id}")->json('data'))->keyBy('id');
        $this->assertTrue((bool) $likerFeed[$post]['likedByMe']);
        $this->assertFalse((bool) $likerFeed[$empty]['likedByMe']);
    }

    public function test_index_only_shows_posts_from_the_last_24_hours(): void
    {
        $reader = Reader::create([
            'name' => 'Jane Doe',
            'phone_number' => '+251911111111',
        ]);

        $fresh = $this->postJson('/api/posts', [
            'readerId' => $reader->id,
            'postContent' => 'A fresh note from this morning.',
        ])->assertStatus(201)->json('id');

        $stale = $this->postJson('/api/posts', [
            'readerId' => $reader->id,
            'postContent' => 'A note from two days ago.',
        ])->assertStatus(201)->json('id');

        // Age the second note past the feed window.
        Post::where('id', $stale)->update(['created_at' => now()->subHours(25)]);

        $feed = $this->getJson('/api/posts')->json('data');
        $ids = array_map(fn ($row) => $row['id'], $feed);

        $this->assertContains($fresh, $ids);
        $this->assertNotContains($stale, $ids);
    }

    public function test_admin_deletes_any_post_with_a_required_reason(): void
    {
        $author = Reader::create([
            'name' => 'Author Reader',
            'phone_number' => '+251911111111',
        ]);

        $post = $this->postJson('/api/posts', [
            'readerId' => $author->id,
            'postContent' => 'A note the admin panel will remove.',
        ])->assertStatus(201)->json('id');

        Http::fake();

        // A reason must ride along, on an as-remove-any basis.
        $this->deleteJson("/api/admin/posts/{$post}")
            ->assertStatus(422)
            ->assertJsonValidationErrors('reason');

        $this->deleteJson("/api/admin/posts/{$post}", [
            'reason' => str_repeat('x', 1001),
        ])->assertStatus(422)
            ->assertJsonValidationErrors('reason');

        // With a reason any note goes — no author check, unlike the reader route.
        // The author here has no chat id, so the Telegram notice cannot reach
        // them and the response says so.
        $this->deleteJson("/api/admin/posts/{$post}", [
            'reason' => 'Inappropriate language.',
        ])->assertOk()
            ->assertJson(['author_notified' => false]);

        // No chat id on file means nothing was ever attempted.
        Http::assertNothingSent();

        $this->assertDatabaseMissing('posts', ['id' => $post]);
    }

    public function test_admin_deletion_notifies_the_author_over_telegram(): void
    {
        Http::fake();

        config(['services.telegram.bot_token' => 'test-token']);

        $author = Reader::create([
            'name' => 'Author Reader',
            'phone_number' => '+251911111113',
            'chat_id' => 12345,
        ]);

        $post = $this->postJson('/api/posts', [
            'readerId' => $author->id,
            'postContent' => 'A note the author will hear about.',
        ])->assertStatus(201)->json('id');

        $this->deleteJson("/api/admin/posts/{$post}", [
            'reason' => 'Inappropriate language.',
        ])->assertOk()
            ->assertJson(['author_notified' => true]);

        Http::assertSent(function ($request) {
            $text = $request['text'] ?? '';

            return $request->url() === 'https://api.telegram.org/bottest-token/sendMessage'
                && $request['chat_id'] === 12345
                && $request['parse_mode'] === 'HTML'
                && str_contains($text, 'Author Reader')
                && str_contains($text, 'Inappropriate language.');
        });
    }

    public function test_admin_deletion_skips_the_notice_when_the_bot_is_not_configured(): void
    {
        // Fake HTTP even though the path should never send: the .env file in
        // this environment carries a real bot token env fallback.
        Http::fake();

        // Empty string cuts the config fallback to env() off — null would
        // resolve to the environment's real token.
        config(['services.telegram.bot_token' => '']);

        $author = Reader::create([
            'name' => 'Author Reader',
            'phone_number' => '+251911111114',
            'chat_id' => 67890,
        ]);

        $post = $this->postJson('/api/posts', [
            'readerId' => $author->id,
            'postContent' => 'A note nobody hears about.',
        ])->assertStatus(201)->json('id');

        $this->deleteJson("/api/admin/posts/{$post}", [
            'reason' => 'Duplicate note.',
        ])->assertOk()
            ->assertJson(['author_notified' => false]);

        Http::assertNothingSent();

        $this->assertDatabaseMissing('posts', ['id' => $post]);
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

    public function test_like_toggles_the_post_like_for_the_reader(): void
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
            'postContent' => 'A note that will be liked and unliked.',
        ])->assertStatus(201)->json('id');

        // First tap adds the like.
        $this->postJson("/api/posts/{$post}/like", [
            'readerId' => $liker->id,
        ])
            ->assertStatus(200)
            ->assertJson(['liked' => true, 'likesCount' => 1]);

        $this->assertDatabaseHas('post_likes', ['post_id' => $post, 'reader_id' => $liker->id]);

        // Tapping the same post by the same reader removes the like again.
        $this->postJson("/api/posts/{$post}/like", [
            'readerId' => $liker->id,
        ])
            ->assertStatus(200)
            ->assertJson(['liked' => false, 'likesCount' => 0]);

        $this->assertDatabaseMissing('post_likes', ['post_id' => $post, 'reader_id' => $liker->id]);
    }
}
