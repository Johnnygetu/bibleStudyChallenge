<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class PostsController extends Controller
{
    /**
     * Community feed: every post, newest first, shaped for the readers app.
     */
    public function index()
    {
        $posts = Post::with('reader')
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
     * Feed row shape shared by list and create responses. Reactions are not
     * stored yet; the count stays zero until a likes table exists.
     */
    private function toFeedShaped(Post $post): array
    {
        return [
            'id' => $post->getKey(),
            'readerName' => $post->reader?->name,
            'postContent' => $post->postContent,
            'createdAt' => $post->created_at?->toISOString(),
            'likesCount' => 0,
        ];
    }
}
