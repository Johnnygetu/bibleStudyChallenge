<?php

namespace Tests\Feature;

use App\Models\BookChapter;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookChapterIndexTest extends TestCase
{
    use RefreshDatabase;

    public function test_groups_chapters_by_book_in_chapter_order(): void
    {
        BookChapter::create(['book' => 'Genesis', 'chapter_number' => 2, 'num_verses' => 25]);
        BookChapter::create(['book' => 'Genesis', 'chapter_number' => 1, 'num_verses' => 31]);
        BookChapter::create(['book' => 'Exodus', 'chapter_number' => 1, 'num_verses' => 22]);

        $this->getJson('/api/book-chapters')->assertOk()->assertExactJson([
            [
                'book' => 'Exodus',
                'chapters' => [
                    ['chapter_number' => 1, 'num_verses' => 22],
                ],
            ],
            [
                'book' => 'Genesis',
                'chapters' => [
                    ['chapter_number' => 1, 'num_verses' => 31],
                    ['chapter_number' => 2, 'num_verses' => 25],
                ],
            ],
        ]);
    }

    public function test_reports_books_whatever_language_the_data_carries(): void
    {
        BookChapter::create(['book' => 'ዘፍጥረት', 'chapter_number' => 1, 'num_verses' => 31]);

        $this->getJson('/api/book-chapters')->assertOk()->assertExactJson([
            [
                'book' => 'ዘፍጥረት',
                'chapters' => [
                    ['chapter_number' => 1, 'num_verses' => 31],
                ],
            ],
        ]);
    }

    public function test_returns_an_empty_list_when_no_chapters_exist(): void
    {
        $this->getJson('/api/book-chapters')->assertOk()->assertExactJson([]);
    }
}
