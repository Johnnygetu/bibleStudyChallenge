<?php

namespace Tests\Feature;

use App\Models\Answer;
use App\Models\BookChapter;
use App\Models\Question;
use App\Models\Reader;
use App\Models\Score;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuizScoreTest extends TestCase
{
    use RefreshDatabase;

    private Reader $reader;
    private Question $question;
    private Answer $correct;
    private Answer $wrong;

    protected function setUp(): void
    {
        parent::setUp();

        $this->reader = Reader::create([
            'name' => 'Jane Doe',
            'phone_number' => '+251911111111',
        ]);

        $chapter = BookChapter::create([
            'book' => 'Genesis',
            'chapter_number' => 1,
            'num_verses' => 31,
        ]);

        $this->question = $chapter->questions()->create([
            'question_text' => 'How many days did creation take?',
        ]);
        $this->correct = $this->question->answers()->create([
            'answer_text' => 'Seven',
            'correct_answer' => true,
        ]);
        $this->wrong = $this->question->answers()->create([
            'answer_text' => 'Three',
            'correct_answer' => false,
        ]);
    }

    private function submit(array $answers)
    {
        return $this->postJson("/api/readers/{$this->reader->id}/scores", [
            'answers' => $answers,
        ]);
    }

    public function test_records_the_quiz_score_for_the_reading_day(): void
    {
        $response = $this->submit([
            ['question_id' => $this->question->id, 'answer_id' => $this->correct->id],
        ]);

        $response->assertStatus(201)
            ->assertJsonFragment(['score' => 1])
            ->assertJsonFragment(['answered' => 1]);

        $this->assertDatabaseHas('scores', [
            'reader_id' => $this->reader->id,
            'score' => 1,
        ]);
    }

    public function test_a_wrong_answer_scores_zero(): void
    {
        $this->submit([
            ['question_id' => $this->question->id, 'answer_id' => $this->wrong->id],
        ])->assertStatus(201)->assertJsonFragment(['score' => 0]);

        $this->assertDatabaseHas('scores', [
            'reader_id' => $this->reader->id,
            'score' => 0,
        ]);
    }

    public function test_resubmitting_the_same_day_updates_a_single_row(): void
    {
        $this->submit([
            ['question_id' => $this->question->id, 'answer_id' => $this->wrong->id],
        ])->assertStatus(201);

        $this->submit([
            ['question_id' => $this->question->id, 'answer_id' => $this->correct->id],
        ])->assertStatus(201)->assertJsonFragment(['score' => 1]);

        $this->assertSame(1, Score::where('reader_id', $this->reader->id)->count());
        $this->assertDatabaseHas('scores', [
            'reader_id' => $this->reader->id,
            'score' => 1,
        ]);
    }

    public function test_a_new_reading_day_gets_its_own_score_row(): void
    {
        $this->submit([
            ['question_id' => $this->question->id, 'answer_id' => $this->correct->id],
        ])->assertStatus(201);

        $this->travelTo(now()->addDay());

        $this->submit([
            ['question_id' => $this->question->id, 'answer_id' => $this->wrong->id],
        ])->assertStatus(201);

        $this->assertSame(2, Score::where('reader_id', $this->reader->id)->count());
    }

    public function test_an_answer_only_counts_for_its_own_question(): void
    {
        $chapter = BookChapter::create([
            'book' => 'Exodus',
            'chapter_number' => 1,
            'num_verses' => 40,
        ]);
        $otherQuestion = $chapter->questions()->create([
            'question_text' => 'Who led Israel out of Egypt?',
        ]);

        // The correct answer belongs to a different question than the one sent.
        $this->submit([
            ['question_id' => $otherQuestion->id, 'answer_id' => $this->correct->id],
        ])->assertStatus(201)->assertJsonFragment(['score' => 0]);
    }

    public function test_requires_at_least_one_answer(): void
    {
        $this->postJson("/api/readers/{$this->reader->id}/scores", ['answers' => []])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['answers']);
    }
}
