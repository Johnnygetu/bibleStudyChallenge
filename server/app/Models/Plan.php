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
