<?php

namespace Tests\Feature;

use App\Models\BookChapter;
use App\Models\Question;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class QuestionBulkUploadTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Post a JSON file to the bulk endpoint.
     */
    private function upload(string $contents, string $name = 'questions.json')
    {
        return $this->post(
            '/api/questions/bulk',
            ['file' => UploadedFile::fake()->createWithContent($name, $contents)],
            ['Accept' => 'application/json']
        );
    }

    /**
     * One question row in the shape the file is expected to hold.
     */
    private function row(array $overrides = []): array
    {
        return array_merge([
            'book' => 'Genesis',
            'chapter' => 1,
            'question_text' => 'Who created the heavens and the earth?',
            'options' => ['a' => 'Moses', 'b' => 'God', 'c' => 'Abraham', 'd' => 'Noah'],
            'correct_option' => 'b',
        ], $overrides);
    }

    public function test_imports_questions_and_their_choices(): void
    {
        $existingChapter = BookChapter::create(['book' => 'Genesis', 'chapter_number' => 1, 'num_verses' => 31]);

        $response = $this->upload(json_encode([
            $this->row(),
            $this->row([
                'chapter' => 2,
                'num_verses' => 25,
                'question_text' => 'What did God plant in Eden?',
                'correct_option' => 'a',
            ]),
        ]));

        $response->assertStatus(201)
            ->assertJson(['created' => 2]);

        $this->assertCount(2, $response->json('question_ids'));
        $this->assertDatabaseCount('questions', 2);
        $this->assertDatabaseCount('answers', 8);

        // The first row landed in the chapter that already existed...
        $this->assertDatabaseHas('questions', [
            'question_text' => 'Who created the heavens and the earth?',
            'chapter_id' => $existingChapter->id,
        ]);

        // ...and the second one created its own chapter, keeping num_verses.
        $newChapter = BookChapter::where('book', 'Genesis')->where('chapter_number', 2)->first();
        $this->assertNotNull($newChapter);
        $this->assertSame(25, (int) $newChapter->num_verses);
        $this->assertDatabaseHas('questions', [
            'question_text' => 'What did God plant in Eden?',
            'chapter_id' => $newChapter->id,
        ]);

        // Every imported question has exactly one correct choice.
        foreach ($response->json('question_ids') as $questionId) {
            $this->assertSame(
                1,
                Question::find($questionId)->answers()->where('correct_answer', true)->count()
            );
        }
    }

    public function test_imports_into_an_existing_chapter_by_id(): void
    {
        $chapter = BookChapter::create(['book' => 'John', 'chapter_number' => 3, 'num_verses' => 36]);

        $response = $this->upload(json_encode([
            [
                'book_chapter_id' => $chapter->id,
                'question_text' => 'Who came to Jesus at night?',
                'options' => ['a' => 'Nicodemus', 'b' => 'Peter', 'c' => 'John', 'd' => 'Andrew'],
                'correct_option' => 'a',
            ],
        ]));

        $response->assertStatus(201)->assertJson(['created' => 1]);

        // The id alone placed the question: no book or chapter number needed,
        // and no second chapter created.
        $this->assertDatabaseHas('questions', [
            'question_text' => 'Who came to Jesus at night?',
            'chapter_id' => $chapter->id,
        ]);
        $this->assertDatabaseCount('book_chapters', 1);
    }

    public function test_rejects_a_book_chapter_id_that_does_not_exist(): void
    {
        $this->upload(json_encode([
            array_merge($this->row(), ['book_chapter_id' => 9999]),
        ]))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['questions.0.book_chapter_id']);

        $this->assertDatabaseCount('questions', 0);
    }

    public function test_every_row_needs_a_chapter_id_or_a_book_and_chapter(): void
    {
        $this->upload(json_encode([
            [
                'question_text' => 'Where does this one belong?',
                'options' => ['a' => 'Moses', 'b' => 'God', 'c' => 'Abraham', 'd' => 'Noah'],
                'correct_option' => 'a',
            ],
        ]))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['questions.0.book', 'questions.0.chapter']);

        $this->assertDatabaseCount('questions', 0);
        $this->assertDatabaseCount('book_chapters', 0);
    }

    public function test_ignores_keys_a_row_does_not_use(): void
    {
        $this->upload(json_encode([
            $this->row([
                'options' => ['a' => 'Moses', 'b' => 'God', 'c' => 'Abraham', 'd' => 'Noah', 'e' => 'Adam'],
                'notes' => 'Not a question column.',
            ]),
        ]))->assertStatus(201);

        // Only the four validated options become choices.
        $this->assertDatabaseCount('answers', 4);
    }

    public function test_rejects_invalid_rows_without_importing_anything(): void
    {
        $response = $this->upload(json_encode([
            $this->row(),
            $this->row(['correct_option' => 'e']),
        ]));

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['questions.1.correct_option']);

        // All-or-nothing: the valid first row was not written either.
        $this->assertDatabaseCount('questions', 0);
        $this->assertDatabaseCount('answers', 0);
    }

    public function test_rejects_a_file_that_is_not_valid_json(): void
    {
        $this->upload('not json at all {{{')
            ->assertStatus(422)
            ->assertJsonValidationErrors('file');

        $this->assertDatabaseCount('questions', 0);
    }

    public function test_rejects_json_that_is_not_an_array(): void
    {
        $this->upload(json_encode(['questions' => [$this->row()]]))
            ->assertStatus(422)
            ->assertJsonValidationErrors('file');

        $this->upload(json_encode([]))
            ->assertStatus(422)
            ->assertJsonValidationErrors('file');

        $this->assertDatabaseCount('questions', 0);
    }

    public function test_requires_an_uploaded_file(): void
    {
        $this->post('/api/questions/bulk', [], ['Accept' => 'application/json'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('file');
    }

    public function test_allows_duplicate_questions(): void
    {
        $payload = json_encode([$this->row()]);

        $this->upload($payload)->assertStatus(201);
        $this->upload($payload)->assertStatus(201);

        $this->assertDatabaseCount('questions', 2);
        $this->assertDatabaseCount('answers', 8);
        $this->assertSame(1, BookChapter::where('book', 'Genesis')->where('chapter_number', 1)->count());
    }
}
