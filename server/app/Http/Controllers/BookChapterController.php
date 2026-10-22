<?php

namespace App\Http\Controllers;

use App\Models\BookChapter;
use Illuminate\Http\JsonResponse;

class BookChapterController extends Controller
{
    /**
     * Every book in the challenge data with its chapters, in chapter order.
     *
     * GET /api/book-chapters
     *
     * The admin quiz form builds its book and chapter pickers from this, so
     * what can be chosen always matches what exists in book_chapters — there
     * is no hardcoded book list on the frontend. Book names are whatever the
     * data carries (Amharic in production).
     */
    public function index(): JsonResponse
    {
        $chapters = BookChapter::query()
            ->orderBy('book')
            ->orderBy('chapter_number')
            ->get(['book', 'chapter_number', 'num_verses']);

        return response()->json(
            $chapters
                ->groupBy('book')
                ->map(fn ($rows) => [
                    'book' => $rows->first()->book,
                    'chapters' => $rows
                        ->map(fn ($chapter) => [
                            'chapter_number' => $chapter->chapter_number,
                            'num_verses' => $chapter->num_verses,
                        ])
                        ->values(),
                ])
                ->values()
        );
    }
}
