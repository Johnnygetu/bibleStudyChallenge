<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Cache;

class Plan extends Model
{
    protected $fillable = [
        'name',
        'no_days',
        'starting_day',
        'reading_days_per_week',
        'daily_verse_limit',
    ];

    protected function casts(): array
    {
        return [
            'starting_day' => 'date',
        ];
    }

    /**
     * Chronological order entries for this plan.
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Get the pre-computed reading schedule, caching the result forever.
     */
    public function getSchedule()
    {
        $cacheKey = "plan_{$this->id}_schedule_v3";

        return Cache::rememberForever($cacheKey, function () {
            $orders = $this->orders()->with('chapter')->orderBy('id')->get();
            $schedule = [];
            $dayNumber = 1;
            $dayVerses = 0;
            $dayChapters = [];
            $limit = max(1, (int) $this->daily_verse_limit);

            foreach ($orders as $order) {
                $verseCount = $order->chapter->num_verses;
                $dayChapters[] = [
                    'order_id' => $order->id,
                    'book' => $order->chapter->book,
                    'chapter_number' => $order->chapter->chapter_number,
                    'num_verses' => $verseCount,
                ];
                $dayVerses += $verseCount;

                // Include the one whole chapter that reaches or crosses the
                // limit, then end this day's group immediately.
                if ($dayVerses >= $limit) {
                    $schedule[] = [
                        'day' => $dayNumber,
                        'total_verses' => $dayVerses,
                        'chapters' => $dayChapters,
                    ];
                    $dayNumber++;
                    $dayVerses = 0;
                    $dayChapters = [];
                }
            }

            if ($dayChapters !== []) {
                $schedule[] = [
                    'day' => $dayNumber,
                    'total_verses' => $dayVerses,
                    'chapters' => $dayChapters,
                ];
            }

            return $schedule;
        });
    }

    /**
     * Today's readings for one reader: applies dynamic limits based on the
     * 30-day tolerance buffer, always finishes on a whole chapter boundary,
     * and reports the day/streak numbers the reader-facing UI needs.
     *
     * Shared by the reader-facing endpoint and the daily Telegram broadcast
     * so both can never drift apart.
     */
    public function dailyReadingsFor(Reader $reader): array
    {
        $baseLimit = $this->daily_verse_limit;
        $dynamicLimit = $baseLimit;
        $isCatchUpMode = false;
        $extraVersesAdded = 0;

        // Calculate lag based on yesterday's progress. This ensures the daily readings
        // stay perfectly fixed for the entire calendar day, even if they save progress.
        $lagData = $this->lagFor($reader, false);

        // 30-day Tolerance Logic
        if ($lagData['is_lagging']) {
            $toleranceDays = 30;
            $maxToleranceVerses = $toleranceDays * $baseLimit;

            // They have exhausted the 30-day buffer
            if ($lagData['lagging_verses'] > $maxToleranceVerses) {
                $excessVerses = $lagData['lagging_verses'] - $maxToleranceVerses;
                $totalPlanDays = count($this->getSchedule());

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
            $currentOrder = Order::where('plan_id', $this->id)
                ->where('chapter_id', $currentStudy->last_studied_chapter_id)
                ->first();
            if ($currentOrder) {
                $currentOrderId = $currentOrder->id;
            }
        }

        $upcoming = Order::where('plan_id', $this->id)
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

        // Day and streak numbers for the reader-facing UI
        $totalDays = count($this->getSchedule());
        $currentDayNumber = $lagData['current_day_number'] ?? 1;

        // Start-date info so the reader app can show an "X days left" countdown
        // while the plan's starting_day is still in the future.
        $daysUntilStart = (int) round(
            ($this->starting_day->startOfDay()->getTimestamp() - now()->startOfDay()->getTimestamp()) / 86400
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

        return [
            'reader_id' => $reader->id,
            'plan_id' => $this->id,
            'base_verse_limit' => $baseLimit,
            'dynamic_verse_limit' => $dynamicLimit,
            'is_catch_up_mode' => $isCatchUpMode,
            'extra_verses_added' => $extraVersesAdded,
            'verses_assigned' => $versesUsed,
            'chapters_count' => count($readings),
            'current_day' => $currentDayNumber,
            'total_days' => $totalDays,
            'starting_day' => $this->starting_day->toDateString(),
            'days_until_start' => $daysUntilStart,
            'has_started' => $daysUntilStart === 0,
            'current_streak' => $currentStreak,
            'best_streak' => max($currentStreak, $bestStreak),
            'has_submitted_quiz_today' => $hasSubmittedQuizToday,
            'readings' => $readings,
        ];
    }

    /**
     * Calculate a reader's exact lag status against the plan schedule.
     * Shared by the reader-facing endpoints and the admin progress board.
     */
    public function lagFor(Reader $reader, bool $includeToday = true): array
    {
        $query = $reader->studyDays()->latest('id');
        if (! $includeToday) {
            $query->whereDate('created_at', '<', today());
        }
        $lastStudy = $query->first();
        $actualOrderId = 0;

        if ($lastStudy) {
            $lastOrder = Order::where('plan_id', $this->id)
                ->where('chapter_id', $lastStudy->last_studied_chapter_id)
                ->first();

            if ($lastOrder) {
                $actualOrderId = $lastOrder->id;
            }
        }

        $daysElapsed = $this->starting_day->startOfDay()->diffInDays(now()->startOfDay()) + 1;

        if ($daysElapsed < 1) {
            return [
                'is_lagging' => false,
                'current_day_number' => 0,
                'actual_order_id' => $actualOrderId,
                'lagging_chapters' => 0,
                'lagging_verses' => 0,
            ];
        }

        $schedule = $this->getSchedule();
        if ($schedule === []) {
            return [
                'is_lagging' => false,
                'current_day_number' => 0,
                'actual_order_id' => $actualOrderId,
                'lagging_chapters' => 0,
                'lagging_verses' => 0,
            ];
        }

        $targetDayIndex = min($daysElapsed - 1, count($schedule) - 1);
        $targetDayData = $schedule[$targetDayIndex];

        $targetChapters = $targetDayData['chapters'];
        $targetOrderId = end($targetChapters)['order_id'];

        if ($actualOrderId >= $targetOrderId) {
            return [
                'is_lagging' => false,
                'current_day_number' => $daysElapsed,
                'target_day_number' => $targetDayData['day'],
                'actual_order_id' => $actualOrderId,
                'target_order_id' => $targetOrderId,
                'lagging_chapters' => 0,
                'lagging_verses' => 0,
            ];
        }

        $missedOrders = Order::where('plan_id', $this->id)
            ->where('id', '>', $actualOrderId)
            ->where('id', '<=', $targetOrderId)
            ->with('chapter')
            ->get();

        return [
            'is_lagging' => true,
            'current_day_number' => $daysElapsed,
            'target_day_number' => $targetDayData['day'],
            'actual_order_id' => $actualOrderId,
            'target_order_id' => $targetOrderId,
            'lagging_chapters' => $missedOrders->count(),
            'lagging_verses' => $missedOrders->sum(fn ($o) => $o->chapter->num_verses),
        ];
    }

    /**
     * Clear the cached schedule (e.g., when the daily limit changes).
     */
    public function clearScheduleCache()
    {
        Cache::forget("plan_{$this->id}_schedule");
        Cache::forget("plan_{$this->id}_schedule_v2");
        Cache::forget("plan_{$this->id}_schedule_v3");
    }
}
