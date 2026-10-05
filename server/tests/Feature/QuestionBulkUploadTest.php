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
