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
        $cacheKey = "plan_{$this->id}_schedule";

        return Cache::rememberForever($cacheKey, function () {
            $orders = $this->orders()->with('chapter')->orderBy('id')->get();
            
            $schedule = [];
            $dayNumber = 1;
            $currentDayVerses = 0;
            $currentDayChapters = [];

            foreach ($orders as $order) {
                $chapter = $order->chapter;
                $verseCount = $chapter->num_verses;

                // If adding this chapter exceeds the limit (and we already have at least one chapter today)
                if ($currentDayVerses + $verseCount > $this->daily_verse_limit && count($currentDayChapters) > 0) {
                    $schedule[] = [
                        'day' => $dayNumber,
                        'total_verses' => $currentDayVerses,
                        'chapters' => $currentDayChapters,
                    ];
                    $dayNumber++;
                    $currentDayVerses = 0;
                    $currentDayChapters = [];
                }

                $currentDayChapters[] = [
                    'order_id' => $order->id,
                    'book' => $chapter->book,
                    'chapter_number' => $chapter->chapter_number,
                    'num_verses' => $verseCount,
                ];
                $currentDayVerses += $verseCount;
            }

            // Add the final day
            if (count($currentDayChapters) > 0) {
                $schedule[] = [
                    'day' => $dayNumber,
                    'total_verses' => $currentDayVerses,
                    'chapters' => $currentDayChapters,
                ];
            }

            return $schedule;
        });
    }

    /**
     * Clear the cached schedule (e.g., when the daily limit changes).
     */
    public function clearScheduleCache()
    {
        Cache::forget("plan_{$this->id}_schedule");
    }
}
