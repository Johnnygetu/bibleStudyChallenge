<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class PostsController extends Controller
{
    /**
     * Community feed: only notes posted in the last 24 hours, newest first,
     * shaped for the readers app. Likes are counted straight off the
     * post_likes table. When the app passes its signed-in readerId, each row
     * also reports whether that reader is the one who likes it, so the heart
     * state is server-owned.
     */
    public function index(Request $request)
    {
        $data = $request->validate([
            'readerId' => 'nullable|integer|exists:readers,id',
        ]);

        $readerId = (int) ($data['readerId'] ?? 0);

        $posts = Post::with('reader')
            ->withCount('likes')
            ->withCount(['likes as likedByMe' => fn ($query) => $query->where('reader_id', $readerId)])
            ->where('created_at', '>=', now()->subDay())
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (Post $post) => $this->toFeedShaped($post));

        return response(['data' => $posts]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'readerId' => 'required|exists:readers,id',
            'postContent' => 'required|string|max:5000',
        ]);

        $post = Post::create($data);

        // Reload so the response always carries every column and the author's
        // name, in the exact shape the readers app renders.
        $post->refresh()->load('reader');

        return response($this->toFeedShaped($post), 201);
    }

    /**
     * Like toggle for a single post. If the reader already likes the post
     * the row is removed, otherwise one is created — the unique index on
     * (post_id, reader_id) keeps a reader from liking the same post twice.
     * The response carries the new server state so the app can swap its
     * optimistic update for the truth.
     */
    public function like(Post $post)
    {
        $data = request()->validate([
            'readerId' => 'required|integer|exists:readers,id',
        ]);

        $existing = $post->likes()->where('reader_id', $data['readerId'])->first();

        if ($existing !== null) {
            $existing->delete();
            $liked = false;
        } else {
            $post->likes()->create(['reader_id' => $data['readerId']]);
            $liked = true;
        }

        return response([
            'liked' => $liked,
            'likesCount' => $post->likes()->count(),
        ]);
    }

    /**
     * Feed row shape shared by list and create responses. The like count
     * comes from the post_likes table when the posts query counts it, and
     * falls back to zero for a freshly created post (nothing to count yet).
     */
    private function toFeedShaped(Post $post): array
    {
        return [
            'id' => $post->getKey(),
            'readerId' => (int) $post->readerId,
            'readerName' => $post->reader?->name,
            'postContent' => $post->postContent,
            'createdAt' => $post->created_at?->toISOString(),
            'likesCount' => (int) ($post->likes_count ?? 0),
            'likedByMe' => (bool) ($post->likedByMe ?? false),
        ];
    }

    public function destroy(Post $post)
    {
        // Only the author may remove their own note. The signed-in reader has
        // no server session yet, so the id rides along with the request the
        // same way the store route receives its readerId.
        $data = request()->validate([
            'readerId' => 'required|integer|exists:readers,id',
        ]);

        if ((int) $post->readerId !== (int) $data['readerId']) {
            return response(['message' => 'You can only delete your own notes.'], 403);
        }

        $post->delete();

        return response()->noContent();
    }

    /**
     * Admin removal through the admin panel: any note goes, author irrelevant.
     * The request must carry a reason for taking the note down. The reason is
     * validated but not stored yet — what happens with it (audit trail,
     * logging, notifying the reader) is a pending decision.
     */
    public function adminDestroy(Request $request, Post $post)
    {
        $request->validate([
            'reason' => 'required|string|max:1000',
        ]);

        $post->delete();

        return response()->noContent();
    }
}
