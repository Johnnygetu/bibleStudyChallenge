<?php

namespace App\Http\Controllers;

use App\Models\BookChapter;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class QuestionController extends Controller
{
    public function index()
    {
        return Question::with(['chapter', 'answers'])->latest()->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'book' => 'required|string|max:100',
            'chapter' => 'required|integer|min:1',
            'question_text' => 'required|string',
            'options' => 'required|array',
            'options.a' => 'required|string',
            'options.b' => 'required|string',
            'options.c' => 'required|string',
            'options.d' => 'required|string',
            'correct_option' => 'required|in:a,b,c,d',
            'num_verses' => 'nullable|integer|min:0',
        ]);

        $question = DB::transaction(function () use ($data) {
            $chapter = BookChapter::firstOrCreate(
                ['book' => $data['book'], 'chapter_number' => $data['chapter']],
                ['num_verses' => $data['num_verses'] ?? 0]
            );

            $question = $chapter->questions()->create([
                'question_text' => $data['question_text'],
            ]);

            foreach ($data['options'] as $letter => $text) {
                $question->answers()->create([
                    'answer_text' => $text,
                    'correct_answer' => $letter === $data['correct_option'],
                ]);
            }

            return $question;
        });

        return response($question->load(['chapter', 'answers']), 201);
    }

    public function show(Question $question)
    {
        return $question->load(['chapter', 'answers']);
    }

    public function update(Request $request, Question $question)
    {
        $data = $request->validate([
            'question_text' => 'sometimes|required|string',
            'options' => 'sometimes|required|array',
            'options.a' => 'required_with:options|string',
            'options.b' => 'required_with:options|string',
            'options.c' => 'required_with:options|string',
            'options.d' => 'required_with:options|string',
            'correct_option' => 'required_with:options|in:a,b,c,d',
        ]);

        DB::transaction(function () use ($question, $data) {
            if (isset($data['question_text'])) {
                $question->update(['question_text' => $data['question_text']]);
            }

            if (isset($data['options'])) {
                $question->answers()->delete();

                foreach ($data['options'] as $letter => $text) {
                    $question->answers()->create([
                        'answer_text' => $text,
                        'correct_answer' => $letter === $data['correct_option'],
                    ]);
                }
            }
        });

        return $question->load(['chapter', 'answers']);
    }

    public function destroy(Question $question)
    {
        $question->delete();

        return response(null, 204);
    }
}
