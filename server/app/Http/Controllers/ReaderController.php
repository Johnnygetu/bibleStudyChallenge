<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\Order;
use App\Models\Plan;
use App\Models\Reader;
use App\Models\Score;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class ReaderController extends Controller
{
    public function index(Request $request)
    {
        if ($request->has('chat_id')) {
            $reader = Reader::where('chat_id', $request->query('chat_id'))->first();

            if (! $reader) {
                return response()->json(null, 404);
            }

            return response()->json($reader);
        }

        return Reader::all();
    }

    public function showByChatId(string $chatId)
    {
        $reader = Reader::where('chat_id', $chatId)->first();

        if (! $reader) {
            return response()->json(null, 404);
        }

        return response()->json($reader);
    }

    /**
     * List readers whose progress is still between day 0 and day 3.
     *
     * Progress is measured the same way as the admin progress board: the
     * reader's latest study-day position is matched to a plan order, and a
     * plan day counts as done once even chapter of that day has been
     * studied. Only names and phone numbers are returned.
     */
    public function earlyProgressReaders()
    {
        $plan = Plan::query()->latest('starting_day')->first();

        if (! $plan) {
            return response()->json([]);
        }

        $dayTargetOrderIds = [];
        foreach ($plan->getSchedule() as $dayData) {
            $dayTargetOrderIds[] = end($dayData['chapters'])['order_id'];
        }

        $earlyReaders = [];

        foreach (Reader::orderBy('name')->get() as $reader) {
            $lastStudy = $reader->studyDays()->newestPosition()->first();

            $actualOrderId = 0;
            if ($lastStudy) {
                $lastOrder = Order::where('plan_id', $plan->id)
                    ->where('chapter_id', $lastStudy->last_studied_chapter_id)
                    ->first();

                if ($lastOrder) {
                    $actualOrderId = $lastOrder->id;
                }
            }

            $daysDone = 0;
            foreach ($dayTargetOrderIds as $targetOrderId) {
                if ($targetOrderId > $actualOrderId) {
                    break;
                }
                $daysDone++;
            }

            if ($daysDone <= 3) {
                $earlyReaders[] = [
                    'name' => $reader->name,
                    'phone_number' => $reader->phone_number,
                ];
            }
        }

        return response()->json($earlyReaders);
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

        // A chat id identifies one reader. When it is already registered,
        // return that reader instead of creating a duplicate account — a
        // repeat launch from the same Telegram account is not a new sign-up.
        if (isset($data['chat_id'])) {
            $existing = Reader::where('chat_id', $data['chat_id'])->first();

            if ($existing) {
                return response($existing, 200);
            }
        }

        // A phone number identifies one reader too, so a second sign-up that
        // reuses one already on file is rejected instead of quietly creating
        // a duplicate account.
        Validator::make($data, [
            'phone_number' => 'unique:readers,phone_number',
        ])->validate();

        $reader = Reader::create($data);

        // Reload so the response always carries every column — including a
        // chat id that was absent from the request.
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
            'phone_number' => 'sometimes|string|unique:readers,phone_number,'.$reader->id,
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
     * Flag every reader whose Telegram account is in the main youth group as a
     * church member.
     *
     * The group comes from TELEGRAM_MAIN_YOUTH_CHAT_ID and each lookup runs
     * through the bot's getChatMember call, so the bot has to be a member of
     * that group. A reader's chat_id is the id of their private chat with the
     * bot, which is their own Telegram user id — exactly the user_id
     * getChatMember expects. Only a positive result is written: a reader the
     * lookup does not place in the group keeps whatever the flag already says.
     * One reader's failed lookup is logged and counted, not fatal for the rest.
     */
    public function checkChurchMembership(): JsonResponse
    {
        $youthChatId = config('services.telegram.main_youth_chat_id')
            ?? env('TELEGRAM_MAIN_YOUTH_CHAT_ID');

        if (! $youthChatId) {
            Log::error('Church membership: main youth chat id not configured');

            return response()->json(['ok' => false, 'error' => 'main youth chat id not configured'], 500);
        }

        $botToken = config('services.telegram.bot_token')
            ?? env('TELEGRAM_BOT_TOKEN');

        if (! $botToken) {
            Log::error('Church membership: bot token not configured');

            return response()->json(['ok' => false, 'error' => 'bot token not configured'], 500);
        }

        $checked = 0;
        $members = 0;
        $failed = 0;

        // Only readers with a Telegram account can be looked up; the rest keep
        // their current flag and are reported as skipped.
        foreach (Reader::whereNotNull('chat_id')->get() as $reader) {
            try {
                $response = Http::timeout(10)->get("https://api.telegram.org/bot{$botToken}/getChatMember", [
                    'chat_id' => $youthChatId,
                    'user_id' => (int) $reader->chat_id,
                ]);
            } catch (\Throwable $e) {
                Log::error('Church membership: getChatMember exception', [
                    'reader_id' => $reader->id,
                    'error' => $e->getMessage(),
                ]);

                $failed++;

                continue;
            }

            if (! $response->successful()) {
                Log::error('Church membership: getChatMember failed', [
                    'reader_id' => $reader->id,
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                $failed++;

                continue;
            }

            $checked++;

            $status = $response->json('result.status');

            // creator/administrator/member are full members; a restricted
            // member still counts when Telegram says is_member. left/kicked
            // do not.
            $isMember = in_array($status, ['creator', 'administrator', 'member'], true)
                || ($status === 'restricted' && (bool) $response->json('result.is_member', false));

            if ($isMember) {
                $reader->update(['is_church_member' => true]);
                $members++;
            }
        }

        $skipped = Reader::whereNull('chat_id')->count();

        Log::info('Church membership check finished', [
            'checked' => $checked,
            'members' => $members,
            'skipped' => $skipped,
            'failed' => $failed,
        ]);

        return response()->json([
            'ok' => true,
            'checked' => $checked,
            'members' => $members,
            'skipped' => $skipped,
            'failed' => $failed,
        ]);
    }

    /**
     * Fetch daily readings: dynamic limits so a reader who has fallen behind
     * can catch up, always finishing on a whole chapter boundary. The
     * calculation itself lives on the plan so the daily Telegram broadcast
     * shares it.
     */
    public function dailyReadings(Reader $reader, Plan $plan)
    {
        $baseLimit = (int) $plan->daily_verse_limit;

        // Calculate lag based on yesterday's progress. This ensures the daily readings
        // stay perfectly fixed for the entire calendar day, even if they save progress.
        $lagData = $plan->lagFor($reader, false);

        $isCatchUpMode = $lagData['is_lagging'];
        $targetOrderId = $isCatchUpMode ? $lagData['target_order_id'] : null;
        $extraVersesAdded = 0;

        $startAfterOrderId = $lagData['actual_order_id'];

        // Get the absolute latest progress so we know which of today's chapters are already checked off
        $currentStudy = $reader->studyDays()->newestPosition()->first();
        $currentOrderId = 0;
        if ($currentStudy) {
            $currentOrder = Order::where('plan_id', $plan->id)
                ->where('chapter_id', $currentStudy->last_studied_chapter_id)
                ->first();
            if ($currentOrder) {
                $currentOrderId = $currentOrder->id;
            }
        }

        $upcoming = Order::where('plan_id', $plan->id)
            ->where('id', '>', $startAfterOrderId)
            ->orderBy('id')
            ->with('chapter')
            ->get();

        $versesUsed = 0;
        $readings = [];
        $bonusOrder = null;

        foreach ($upcoming as $order) {
            $chapter = $order->chapter;
            $verseCount = $chapter->num_verses;

            $readings[] = [
                'order_id' => $order->id,
                'chapter_id' => $chapter->id,
                'book' => $chapter->book,
                'chapter_number' => $chapter->chapter_number,
                'num_verses' => $verseCount,
                'is_completed' => $order->id <= $currentOrderId,
            ];

            $versesUsed += $verseCount;

            // Finish the chapter that reaches or crosses today's base limit, then
            // stop so no second over-limit chapter is added.
            if ($versesUsed >= $baseLimit) {
                break;
            }
        }

        // Constant catch-up: exactly one extra whole chapter beyond the normal day.
        // $upcoming->get(count($readings)) is the next order after the day's last
        // chapter, because the loop added upcoming[0..n-1] in order.
        if ($isCatchUpMode) {
            $bonusOrder = $upcoming->get(count($readings));

            if ($bonusOrder) {
                $chapter = $bonusOrder->chapter;

                $readings[] = [
                    'order_id' => $bonusOrder->id,
                    'chapter_id' => $chapter->id,
                    'book' => $chapter->book,
                    'chapter_number' => $chapter->chapter_number,
                    'num_verses' => $chapter->num_verses,
                    'is_completed' => $bonusOrder->id <= $currentOrderId,
                ];

                $versesUsed += $chapter->num_verses;
            }
        }

        // A lagging reader never reads past the group's last chapter for today.
        if ($isCatchUpMode) {
            $readings = array_values(array_filter(
                $readings,
                fn (array $reading): bool => $reading['order_id'] <= $targetOrderId,
            ));

            $versesUsed = array_sum(array_column($readings, 'num_verses'));
            $extraVersesAdded = ($bonusOrder && $bonusOrder->id <= $targetOrderId)
                ? $bonusOrder->chapter->num_verses
                : 0;
        }

        $dynamicLimit = $baseLimit + $extraVersesAdded;

        // Day and streak numbers for the reader-facing UI
        $totalDays = count($plan->getSchedule());
        $elapsedDayNumber = $lagData['current_day_number'] ?? 1;
        // Never report a day beyond the plan's length.
        $currentDayNumber = min($elapsedDayNumber, $totalDays);

        // Start-date info so the reader app can show an "X days left" countdown
        // while the plan's starting_day is still in the future.
        $daysUntilStart = (int) round(
            ($plan->starting_day->startOfDay()->getTimestamp() - now()->startOfDay()->getTimestamp()) / 86400
        );
        $daysUntilStart = max(0, $daysUntilStart);

        $latestStreak = $reader->streaks()->latest('id')->first();
        $currentStreak = $latestStreak?->count ?? 0;
        $bestStreak = $reader->streaks()->max('count') ?? 0;

        // Whether today's quiz has already been handed in. The reader app hides
        // the quiz once it has, so it needs the answer on load rather than only
        // in the session that submitted.
        $hasSubmittedQuizToday = Score::where('reader_id', $reader->id)
            ->whereDate('created_at', today())
            ->exists();

        return response([
            'reader_id' => $reader->id,
            'plan_id' => $plan->id,
            'base_verse_limit' => $baseLimit,
            'dynamic_verse_limit' => $dynamicLimit,
            'is_catch_up_mode' => $isCatchUpMode,
            'extra_verses_added' => $extraVersesAdded,
            'verses_assigned' => $versesUsed,
            'chapters_count' => count($readings),
            'current_day' => $currentDayNumber,
            'total_days' => $totalDays,
            'starting_day' => $plan->starting_day->toDateString(),
            'days_until_start' => $daysUntilStart,
            'has_started' => $daysUntilStart === 0,
            'current_streak' => $currentStreak,
            'best_streak' => max($currentStreak, $bestStreak),
            'has_submitted_quiz_today' => $hasSubmittedQuizToday,
            'readings' => $readings,
        ]);
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
     * Admin override: set the reader's streak by hand.
     *
     * The reader-facing app and the daily readings report the newest streak
     * row, so this adjusts that row in place. Stacking a fresh row would
     * strand the reader on a value no later save would continue from.
     */
    public function setStreak(Request $request, Reader $reader)
    {
        $data = $request->validate([
            'streak' => 'required|integer|min:0|max:3650',
        ]);

        // The streak describes reading days, so it cannot reach past the day
        // the plan is on today.
        $plan = Plan::current();

        if (! $plan) {
            throw ValidationException::withMessages([
                'streak' => 'There is no reading plan yet, so there is no day the streak may reach.',
            ]);
        }

        $todayDayNumber = $plan->lagFor($reader)['current_day_number'];

        if ($data['streak'] > $todayDayNumber) {
            throw ValidationException::withMessages([
                'streak' => "The streak cannot extend beyond today's reading day (day {$todayDayNumber}).",
            ]);
        }

        $this->adjustStreak($reader, $data['streak']);

        return response([
            'message' => 'Reader streak updated.',
            'reader_id' => $reader->id,
            'streak' => $data['streak'],
        ]);
    }

    /**
     * Point the reader's newest streak row at an exact value, creating the
     * row when the reader has none yet.
     */
    private function adjustStreak(Reader $reader, int $count): void
    {
        $streak = $reader->streaks()->latest('id')->first();

        if ($streak) {
            $streak->update(['count' => $count]);
        } else {
            $reader->streaks()->create(['count' => $count]);
        }
    }

    /**
     * Override a reader's position in the plan to a chapter the admin picks.
     *
     * The chosen chapter is recorded as the reader's position at the start of
     * today, so it takes effect on today's reading: today's list restarts at
     * the chapter right after it instead of waiting for tomorrow. Today's list
     * is otherwise fixed for the whole calendar day, which is why the row is
     * stored just before today rather than as a new reading day.
     */
    public function setProgress(Request $request, Reader $reader, Plan $plan)
    {
        $data = $request->validate([
            'order_id' => 'required|integer',
        ]);

        $order = Order::where('plan_id', $plan->id)->find($data['order_id']);

        if (! $order) {
            throw ValidationException::withMessages([
                'order_id' => 'The selected chapter is not part of this plan.',
            ]);
        }

        // A session cannot drop the reader ahead of where the plan stands
        // today: the furthest chapter that may be recorded is the last one
        // of today's plan day.
        $lag = $plan->lagFor($reader);

        if ($lag['current_day_number'] === 0) {
            throw ValidationException::withMessages([
                'order_id' => 'The plan has not started yet, so there is no reading today to set progress within.',
            ]);
        }

        if ($order->id > $lag['target_order_id']) {
            throw ValidationException::withMessages([
                'order_id' => "The selected chapter is beyond today's reading.",
            ]);
        }

        $studyDay = $reader->studyDays()->make([
            'last_studied_chapter_id' => $order->chapter_id,
        ]);
        $studyDay->created_at = today()->startOfDay()->subSecond();
        $studyDay->save();

        return response([
            'message' => 'Reader progress updated.',
            'study_day' => $studyDay,
            'lag' => $plan->lagFor($reader),
        ], 201);
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
