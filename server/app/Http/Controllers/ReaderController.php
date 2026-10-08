<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\Plan;
use App\Models\Reader;
use App\Models\Score;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReaderController extends Controller
{
    public function index()
    {
        return Reader::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'phone_number' => 'required|string',
            'name' => 'required|string',
            // Optional for now: the chat id comes from a Telegram mini app
            // launch and may only be attached on a later visit.
            'chat_id' => 'nullable|integer',
        ]);

        // A chat id already owned by another reader must never block sign-up:
        // drop it, create the account anyway, and let a later launch attach
        // a free one. The response carries chat_id = null so the client can
        // tell it was skipped.
        if (isset($data['chat_id']) && Reader::where('chat_id', $data['chat_id'])->exists()) {
            unset($data['chat_id']);
        }

        try {
            $reader = Reader::create($data);
        } catch (UniqueConstraintViolationException $e) {
            // Lost the race for that chat id — same outcome: register without it.
            if (! isset($data['chat_id'])) {
                throw $e;
            }

            unset($data['chat_id']);
            $reader = Reader::create($data);
        }

        // Reload so the response always carries every column — including a
        // chat id that was skipped or absent from the request.
        $reader->refresh();

        return response($reader, 201);
    }

    public function show(Reader $reader)
    {
        return $reader;
    }

    public function update(Request $request, Reader $reader)
    {
        $data = $request->validate([
            'phone_number' => 'sometimes|string',
            'name' => 'sometimes|string',
            'chat_id' => 'sometimes|nullable|integer|unique:readers,chat_id,'.$reader->id,
        ]);

        return $reader->update($data) ? $reader : response(['message' => 'Update failed'], 500);
    }

    public function destroy(Reader $reader)
    {
        $reader->delete();

        return response(null, 204);
    }

    /**
     * Fetch daily readings: dynamic limits based on the 30-day tolerance
     * buffer, always finishing on a whole chapter boundary. The calculation
     * itself lives on the plan so the daily Telegram broadcast shares it.
     */
    public function dailyReadings(Reader $reader, Plan $plan)
    {
        return response($plan->dailyReadingsFor($reader));
    }

    /**
     * Provide the reader's lag status using the shared helper.
     */
    public function lagStatus(Reader $reader, Plan $plan)
    {
        $lagData = $plan->lagFor($reader);
        $lagData['message'] = $lagData['is_lagging']
            ? 'You are lagging behind the schedule.'
            : 'You are on track or ahead of schedule!';

        return response()->json($lagData);
    }

    /**
     * Save the reader's progress for today.
     */
    public function saveProgress(Request $request, Reader $reader, Plan $plan)
    {
        $data = $request->validate([
            'chapter_id' => 'required|exists:book_chapters,id',
        ]);

        $studyDay = $reader->studyDays()->whereDate('created_at', today())->first();

        if ($studyDay) {
            $studyDay->update(['last_studied_chapter_id' => $data['chapter_id']]);
        } else {
            // A new reading day: record it and register the streak by
            // adding 1 to the last streak registered for this reader.
            $studyDay = DB::transaction(function () use ($reader, $data) {
                $studyDay = $reader->studyDays()->create(['last_studied_chapter_id' => $data['chapter_id']]);

                $lastStreak = $reader->streaks()->latest('id')->first();

                if ($lastStreak) {
                    $lastStreak->increment('count');
                } else {
                    $reader->streaks()->create(['count' => 1]);
                }

                return $studyDay;
            });
        }

        return response()->json(['message' => 'Progress saved successfully.', 'study_day' => $studyDay]);
    }

    /**
     * Record the reader's quiz score for the current reading day.
     *
     * The client sends the question/answer pairs it submitted; the score
     * (number of correct answers) is computed here so the leaderboard sum
     * cannot be inflated by resubmitting — there is one row per reader per
     * day, and a later submission for the same day updates it.
     */
    public function storeScore(Request $request, Reader $reader)
    {
        $data = $request->validate([
            'answers' => 'required|array|min:1',
            'answers.*.question_id' => 'required|integer|exists:questions,id',
            'answers.*.answer_id' => 'required|integer|exists:answers,id',
        ]);

        // Correct answers for the questions that were submitted, keyed by id,
        // so a pair only counts when the answer really belongs to that question.
        $questionIds = collect($data['answers'])->pluck('question_id')->unique();
        $correctAnswers = Answer::whereIn('question_id', $questionIds)
            ->where('correct_answer', true)
            ->get()
            ->keyBy('id');

        $score = 0;
        $seenQuestions = [];
        foreach ($data['answers'] as $pair) {
            $questionId = (int) $pair['question_id'];
            if (isset($seenQuestions[$questionId])) {
                continue;
            }
            $seenQuestions[$questionId] = true;

            $answer = $correctAnswers->get((int) $pair['answer_id']);
            if ($answer && (int) $answer->question_id === $questionId) {
                $score++;
            }
        }

        $answered = count($seenQuestions);

        $todayScore = Score::where('reader_id', $reader->id)
            ->whereDate('created_at', today())
            ->first();

        if ($todayScore) {
            $todayScore->update(['score' => $score]);
        } else {
            $reader->scores()->create(['score' => $score]);
        }

        return response([
            'reader_id' => $reader->id,
            'score' => $score,
            'answered' => $answered,
            'study_date' => today()->toDateString(),
        ], 201);
    }
}
