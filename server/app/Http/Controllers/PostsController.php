<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class PostsController extends Controller
{
    /**
     * Community feed: every post, newest first, shaped for the readers app.
     * Likes are counted straight off the post_likes table.
     */
    public function index()
    {
        $posts = Post::with('reader')
            ->withCount('likes')
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
     * Like toggle for a single post. TODO: we'll settle the logic here —
     * whether to mirror the post_likes table, allow one like per reader,
     * and how to shape the response — before wiring it up.
     */
    public function like(Post $post)
    {
        //
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
}
