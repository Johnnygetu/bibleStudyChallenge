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
     * A chapter for the rows to point at. The import never creates one, so
     * every test that expects a write has to seed its own.
     */
    private function chapter(string $book = 'Genesis', int $number = 1): BookChapter
    {
        return BookChapter::create([
            'book' => $book,
            'chapter_number' => $number,
            'num_verses' => 31,
        ]);
    }

    /**
     * One question row in the shape the file is expected to hold.
     */
    private function row(int $chapterId, array $overrides = []): array
    {
        return array_merge([
            'book_chapter_id' => $chapterId,
            'question_text' => 'Who created the heavens and the earth?',
            'options' => ['a' => 'Moses', 'b' => 'God', 'c' => 'Abraham', 'd' => 'Noah'],
            'correct_option' => 'b',
        ], $overrides);
    }

    public function test_imports_questions_and_their_choices(): void
    {
        $genesis = $this->chapter();
        $exodus = $this->chapter('Exodus', 3);

        $response = $this->upload(json_encode([
            $this->row($genesis->id),
            $this->row($exodus->id, [
                'question_text' => 'Who was tending sheep when God called him?',
                'correct_option' => 'a',
            ]),
        ]));

        $response->assertStatus(201)->assertJson(['created' => 2]);

        $this->assertCount(2, $response->json('question_ids'));
        $this->assertDatabaseCount('questions', 2);
        $this->assertDatabaseCount('answers', 8);

        // Each question landed in the chapter its id named.
        $this->assertDatabaseHas('questions', [
            'question_text' => 'Who created the heavens and the earth?',
            'chapter_id' => $genesis->id,
        ]);
        $this->assertDatabaseHas('questions', [
            'question_text' => 'Who was tending sheep when God called him?',
            'chapter_id' => $exodus->id,
        ]);

        // Every imported question has exactly one correct choice.
        foreach ($response->json('question_ids') as $questionId) {
            $this->assertSame(
                1,
                Question::find($questionId)->answers()->where('correct_answer', true)->count()
            );
        }
    }

    public function test_never_creates_a_chapter(): void
    {
        $chapter = $this->chapter();

        $this->upload(json_encode([$this->row($chapter->id)]))->assertStatus(201);

        $this->assertDatabaseCount('book_chapters', 1);
    }

    public function test_rejects_a_book_chapter_id_that_does_not_exist(): void
    {
        $this->upload(json_encode([$this->row(9999)]))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['questions.0.book_chapter_id']);

        $this->assertDatabaseCount('questions', 0);
        $this->assertDatabaseCount('book_chapters', 0);
    }

    public function test_requires_a_book_chapter_id_on_every_row(): void
    {
        $this->chapter();

        // A book and chapter number are not a substitute for the id.
        $this->upload(json_encode([
            [
                'book' => 'Genesis',
                'chapter' => 1,
                'question_text' => 'Where does this one belong?',
                'options' => ['a' => 'Moses', 'b' => 'God', 'c' => 'Abraham', 'd' => 'Noah'],
                'correct_option' => 'a',
            ],
        ]))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['questions.0.book_chapter_id']);

        $this->assertDatabaseCount('questions', 0);
    }

    public function test_ignores_keys_a_row_does_not_use(): void
    {
        $chapter = $this->chapter();

        $this->upload(json_encode([
            $this->row($chapter->id, [
                'options' => ['a' => 'Moses', 'b' => 'God', 'c' => 'Abraham', 'd' => 'Noah', 'e' => 'Adam'],
                'book' => 'Leviticus',
                'chapter' => 9,
                'num_verses' => 12,
                'notes' => 'Not a question column.',
            ]),
        ]))->assertStatus(201);

        // Only the four validated options become choices, and the stray book
        // and chapter did not move the question or create a chapter.
        $this->assertDatabaseCount('answers', 4);
        $this->assertDatabaseCount('book_chapters', 1);
        $this->assertDatabaseHas('questions', ['chapter_id' => $chapter->id]);
    }

    public function test_rejects_invalid_rows_without_importing_anything(): void
    {
        $chapter = $this->chapter();

        $response = $this->upload(json_encode([
            $this->row($chapter->id),
            $this->row($chapter->id, ['correct_option' => 'e']),
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
        $this->upload(json_encode(['questions' => [$this->row(1)]]))
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
        $chapter = $this->chapter();
        $payload = json_encode([$this->row($chapter->id)]);

        $this->upload($payload)->assertStatus(201);
        $this->upload($payload)->assertStatus(201);

        $this->assertDatabaseCount('questions', 2);
        $this->assertDatabaseCount('answers', 8);
        $this->assertDatabaseCount('book_chapters', 1);
    }
}
