<?php

namespace App\Http\Controllers;

use App\Models\BookChapter;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

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

        $question = DB::transaction(fn () => $this->createQuestion($data));

        return response($question->load(['chapter', 'answers']), 201);
    }

    /**
     * Create many questions and their choices from one uploaded JSON file.
     *
     * POST /api/questions/bulk  (multipart/form-data, field: file)
     *
     * The file holds a JSON array of the same objects POST /questions accepts.
     * A row says where its question belongs either by `book_chapter_id`, which
     * files it under a chapter that already exists, or by `book` + `chapter`,
     * which finds or creates that chapter. Nothing is written unless every row
     * passes validation.
     */
    public function bulkStore(Request $request)
    {
        $request->validate([
            // `mimes` guesses from the file contents; a JSON file with no
            // Content-Type is commonly sniffed as text/plain, hence txt.
            'file' => 'required|file|mimes:json,txt|max:10240',
        ]);

        $questions = $this->decodeQuestionsFile($request->file('file')->get());

        // Validate the whole array up front so a single bad row fails the
        // request with its index and no rows are written.
        $validator = Validator::make(['questions' => $questions], [
            'questions' => 'required|array|min:1',
            'questions.*' => 'required|array',
            'questions.*.book_chapter_id' => 'nullable|integer|exists:book_chapters,id',
            'questions.*.book' => 'nullable|string|max:100',
            'questions.*.chapter' => 'nullable|integer|min:1',
            'questions.*.question_text' => 'required|string',
            'questions.*.options' => 'required|array',
            'questions.*.options.a' => 'required|string',
            'questions.*.options.b' => 'required|string',
            'questions.*.options.c' => 'required|string',
            'questions.*.options.d' => 'required|string',
            'questions.*.correct_option' => 'required|in:a,b,c,d',
            'questions.*.num_verses' => 'nullable|integer|min:0',
        ]);

        // Every row has to say where its question goes: a `book_chapter_id`
        // for a chapter that already exists, or a `book` + `chapter` pair to
        // find or create one. Wildcard rules are expanded to concrete indices
        // before `required_without` resolves its parameter, so "one or the
        // other" can't be expressed in the rule array — it is checked here,
        // where the row index is still known and the error lands on the field.
        $validator->after(function ($validator) use ($questions) {
            foreach ($questions as $index => $question) {
                if (! is_array($question) || ! empty($question['book_chapter_id'])) {
                    continue;
                }

                $message = 'Give the question a book_chapter_id, or a book and a chapter.';

                if (empty($question['book'])) {
                    $validator->errors()->add("questions.{$index}.book", $message);
                }

                if (empty($question['chapter'])) {
                    $validator->errors()->add("questions.{$index}.chapter", $message);
                }
            }
        });

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        $created = DB::transaction(
            fn () => collect($validator->validated()['questions'])
                ->map(fn (array $data) => $this->createQuestion($data))
        );

        return response()->json([
            'created' => $created->count(),
            'question_ids' => $created->pluck('id')->all(),
        ], 201);
    }

    /**
     * Decode the uploaded file into a list of question arrays.
     *
     * @throws ValidationException
     */
    private function decodeQuestionsFile(string $contents): array
    {
        $decoded = json_decode($contents, true);

        if (json_last_error() !== JSON_ERROR_NONE || ! is_array($decoded)) {
            throw ValidationException::withMessages([
                'file' => 'The file must contain a JSON array of questions.',
            ]);
        }

        if (! array_is_list($decoded)) {
            throw ValidationException::withMessages([
                'file' => 'The file must contain a JSON array of questions, not an object.',
            ]);
        }

        if (empty($decoded)) {
            throw ValidationException::withMessages([
                'file' => 'The uploaded file contains no questions.',
            ]);
        }

        return $decoded;
    }

    /**
     * Create one question with its chapter and four choices.
     */
    private function createQuestion(array $data): Question
    {
        // `book_chapter_id` files the question under a chapter that already
        // exists; book + chapter finds or creates one by name instead.
        $chapter = isset($data['book_chapter_id'])
            ? BookChapter::findOrFail($data['book_chapter_id'])
            : BookChapter::firstOrCreate(
                ['book' => $data['book'], 'chapter_number' => $data['chapter']],
                ['num_verses' => $data['num_verses'] ?? 0]
            );

        $question = $chapter->questions()->create([
            'question_text' => $data['question_text'],
        ]);

        foreach (['a', 'b', 'c', 'd'] as $letter) {
            $question->answers()->create([
                'answer_text' => $data['options'][$letter],
                'correct_answer' => $letter === $data['correct_option'],
            ]);
        }

        return $question;
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

    /**
     * Return questions for a given set of chapter IDs.
     *
     * GET /api/questions/by-chapters?chapter_ids=1,2,3
     */
    public function byChapters(Request $request)
    {
        $request->validate([
            'chapter_ids' => 'required|string',
        ]);

        $chapterIds = array_filter(
            array_map('intval', explode(',', $request->query('chapter_ids')))
        );

        if (empty($chapterIds)) {
            return response()->json([
                'questions' => [],
                'has_questions' => false,
                'message' => 'No chapter IDs provided.',
            ]);
        }

        $questions = Question::with(['chapter', 'answers'])
            ->whereIn('chapter_id', $chapterIds)
            ->get();

        return response()->json([
            'questions' => $questions,
            'has_questions' => $questions->isNotEmpty(),
            'message' => $questions->isEmpty()
                ? 'There are no questions for today\'s reading chapters.'
                : $questions->count() . ' question(s) found for today\'s reading.',
        ]);
    }
}
