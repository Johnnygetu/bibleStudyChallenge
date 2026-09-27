<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Plan;
use App\Models\Reader;
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
            'chat_id' => 'required|unique:readers,chat_id',
        ]);

        return response(Reader::create($data), 201);
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
            'chat_id' => 'sometimes|unique:readers,chat_id,'.$reader->id,
        ]);

        return $reader->update($data) ? $reader : response(['message' => 'Update failed'], 500);
    }

    public function destroy(Reader $reader)
    {
        $reader->delete();

        return response(null, 204);
    }

    /**
     * Fetch daily readings. Applies dynamic limits based on the 30-day tolerance
     * buffer, and always finishes on a whole chapter boundary.
     */
    public function dailyReadings(Reader $reader, Plan $plan)
    {
        $baseLimit = $plan->daily_verse_limit;
        $dynamicLimit = $baseLimit;
        $isCatchUpMode = false;
        $extraVersesAdded = 0;

        // Calculate lag based on yesterday's progress. This ensures the daily readings
        // stay perfectly fixed for the entire calendar day, even if they save progress.
        $lagData = $plan->lagFor($reader, false);

        // 30-day Tolerance Logic
        if ($lagData['is_lagging']) {
            $toleranceDays = 30;
            $maxToleranceVerses = $toleranceDays * $baseLimit;

            // They have exhausted the 30-day buffer
            if ($lagData['lagging_verses'] > $maxToleranceVerses) {
                $excessVerses = $lagData['lagging_verses'] - $maxToleranceVerses;
                $totalPlanDays = count($plan->getSchedule());

                // Calculate remaining days until absolute deadline
                $remainingDays = max(1, ($totalPlanDays + $toleranceDays) - $lagData['current_day_number'] + 1);

                $extraVersesAdded = (int) ceil($excessVerses / $remainingDays);
                $dynamicLimit = $baseLimit + $extraVersesAdded;
                $isCatchUpMode = true;
            }
        }

        $startAfterOrderId = $lagData['actual_order_id'];

        // Get the absolute latest progress so we know which of today's chapters are already checked off
        $currentStudy = $reader->studyDays()->latest('id')->first();
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

            // Option B rule: Finish the chapter!
            // We add the chapter first, then if we hit/passed the limit, we stop.
            if ($versesUsed >= $dynamicLimit) {
                break;
            }
        }

        return response([
            'reader_id' => $reader->id,
            'plan_id' => $plan->id,
            'base_verse_limit' => $baseLimit,
            'dynamic_verse_limit' => $dynamicLimit,
            'is_catch_up_mode' => $isCatchUpMode,
            'extra_verses_added' => $extraVersesAdded,
            'verses_assigned' => $versesUsed,
            'chapters_count' => count($readings),
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
}
