# Catch-up: constant +1 chapter per day, clamped to the group's last chapter

## Goal

A lagging reader should read **exactly one extra whole chapter** beyond their normal
verse-limited day, and their entire daily list must **never contain a chapter past
today's group reading** (`target_order_id`, the last chapter of today's scheduled day —
the same day `TelegramGroupReadingController` announces).

This replaces the current proportional rule
`dynamicLimit = baseLimit + ceil(lagging_verses / remainingDays)` with a constant rule.

## Decisions (confirmed with user)

- **Constant +1 chapter** replaces the proportional catch-up formula.
- **Clamp the whole day's list**: for a lagging reader, drop any chapter with
  `order_id > target_order_id` — not just the bonus chapter.
- **Patch both copies** of the logic (`ReaderController::dailyReadings` and
  `Plan::dailyReadingsFor`) with identical edits. Do **not** unify them in this change.
- "Group's last reading chapter" = `target_order_id` from `Plan::lagFor()` (last chapter
  of today's schedule day). Confirmed by `SetReaderProgressTest::test_rejects_a_chapter_beyond_todays_plan`.

## Why the clamp also scopes the bonus correctly (important)

`is_lagging` is true for **any** reader whose start-of-today position is before today's
schedule end — including an on-schedule reader who simply has not read today yet.
The clamp handles this for free:

- **On schedule** (position = end of yesterday's day): the normal verse-limited day
  re-groups into exactly today's schedule day, ending at `target_order_id`. The bonus
  chapter would be the first chapter of tomorrow → `> target_order_id` → filtered out.
  Result: no bonus, unchanged list.
- **Genuinely behind by a full day or more**: the normal day ends before `target_order_id`,
  so the bonus chapter fits and is kept. Net catch-up of 1 chapter/day.

No separate lag threshold is needed. Note `is_catch_up_mode` will still report `true` for
on-schedule readers who have not read today; that matches the existing meaning of the flag
and the reader UI does not display it.

## Files to change

1. `server/app/Models/Plan.php` — `dailyReadingsFor()` (used by the Telegram daily broadcast)
2. `server/app/Http/Controllers/ReaderController.php` — `dailyReadings()` (used by the app route)

Both must receive the **same** edit.

## Implementation steps

### 1. Replace the catch-up computation block

**`Plan.php`** — replace lines ~109–130. **`ReaderController.php`** — replace lines ~167–188.

Replace:
```php
$baseLimit = $plan->daily_verse_limit;
$dynamicLimit = $baseLimit;
$isCatchUpMode = false;
$extraVersesAdded = 0;

$lagData = $plan->lagFor($reader, false);

if ($lagData['is_lagging']) {
    $excessVerses = $lagData['lagging_verses'];
    $totalPlanDays = count($plan->getSchedule());
    $remainingDays = max(1, $totalPlanDays - $lagData['current_day_number'] + 1);
    $extraVersesAdded = (int) ceil($excessVerses / $remainingDays);
    $dynamicLimit = $baseLimit + $extraVersesAdded;
    $isCatchUpMode = true;
}
```

With (use `$this` in `Plan.php`, `$plan` in the controller):
```php
$baseLimit = (int) $plan->daily_verse_limit;
$lagData = $plan->lagFor($reader, false);
$isCatchUpMode = $lagData['is_lagging'];
$targetOrderId = $isCatchUpMode ? $lagData['target_order_id'] : null;
$extraVersesAdded = 0;
```
Remove `$dynamicLimit` here; it is recomputed at the end as
`$baseLimit + $extraVersesAdded`.

### 2. Replace the read loop (both files)

`Plan.php` lines ~152–175; `ReaderController.php` lines ~210–233.

```php
$versesUsed = 0;
$readings = [];
$bonusOrder = null;

foreach ($upcoming as $order) {
    $chapter = $order->chapter;

    $readings[] = [
        'order_id' => $order->id,
        'chapter_id' => $chapter->id,
        'book' => $chapter->book,
        'chapter_number' => $chapter->chapter_number,
        'num_verses' => $chapter->num_verses,
        'is_completed' => $order->id <= $currentOrderId,
    ];

    $versesUsed += $chapter->num_verses;

    // Normal day ends on the chapter that reaches the base limit.
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
```

Notes:
- Keep the existing `$upcoming` query, `$currentOrderId` lookup, and `is_completed` flag exactly as they are.
- `$targetOrderId` is only set when lagging; `lagFor()` always returns `target_order_id` on the
  lagging path and the clamp only runs when `$isCatchUpMode` is true, so no null guard is needed.
- No change to the day/streak/start-date/quiz metadata block.

### 3. Metadata semantics (no code change to the returned keys)

Keep the same response keys; their meaning is now:
- `is_catch_up_mode` — the reader is behind today's schedule (unchanged meaning).
- `extra_verses_added` — verses of the kept bonus chapter; `0` when none fits.
- `dynamic_verse_limit` — `base_verse_limit + extra_verses_added`.
- `verses_assigned` / `chapters_count` — totals of the final (clamped) list.

`DailyReadingBroadcastController` and `graphic.blade.php` read `readings`, `verses_assigned`,
`current_day`, `total_days`; all remain valid and the +1 shows up automatically.

## Validate

Run the narrowest affected set:
```
php artisan test --compact tests/Feature/DailyReadingsTest.php tests/Feature/DailyReadingBroadcastTest.php tests/Feature/SetReaderProgressTest.php
```
Then `vendor/bin/pint --dirty --format agent` for the modified PHP files.

### Test updates required

- **`DailyReadingsTest::test_a_reader_who_falls_behind_enters_catch_up_without_a_grace_period`**
  will FAIL as written: its 1-chapter plan has no chapter after the normal day, so
  `extra_verses_added` is now `0`. Repurpose it to assert `is_catch_up_mode => true` only
  (drop the `extra_verses_added > 0` assertion), or rebuild it on a multi-day plan.

### New tests to add

Use a plan whose chapters make each schedule day a small fixed number of chapters, and
studied positions set via `studyDays()->create(...)` back-dated before today (see
`DailyReadingBroadcastTest::test_does_not_send_when_the_reader_has_finished_the_plan` for
the back-dating pattern).

1. **Exactly one extra chapter** — reader one full schedule day behind. Assert
   `chapters_count` = normal-day chapter count + 1, the last reading is the chapter right
   after the normal day, and `extra_verses_added` equals that chapter's `num_verses`.
2. **Never passes the group's last chapter** — reader only slightly behind so the normal day
   alone would overshoot `target_order_id`. Assert the last reading's `order_id` equals
   `target_order_id` and none exceeds it.
3. **On-schedule reader gets no bonus** — reader finished yesterday's day (position at a
   schedule-day boundary). Assert `chapters_count` equals the normal day and last
   `order_id === target_order_id`, `extra_verses_added === 0`.
4. **Behind by more than a full day still only +1** — reader two-plus days behind. Assert
   exactly one bonus chapter (not a binge of the whole backlog).
5. **End of plan** — reader at the last chapter of the plan; assert no bonus and no crash.
6. **Ahead of schedule unchanged** — reader `actual_order_id > target_order_id`; assert
   normal behavior (no clamp, no bonus).

### Broadcast parity (guards the two copies)

Add to `DailyReadingBroadcastTest`: a lagging reader, then assert the Telegram message
lists exactly the same chapters the app's `daily-readings` endpoint returns (mirror
`test_the_broadcast_carries_the_same_readings_the_app_shows`). This fails if the two copies
drift.

### Existing behaviour to confirm still passes

`SetReaderProgressTest` (adjusted-position resumes today; override restarts today),
`StreakResetTest`, and `DailyReadingBroadcastTest::test_the_broadcast_carries_the_same_readings_the_app_shows`
should pass unchanged — they assert on the first reading and metadata, which the clamp
does not disturb. `DailyReadingsTest::test_never_reports_a_day_beyond_the_plans_length`
also passes.

## Risks / caveats

- **Duplication accepted**: the two copies must stay identical; the broadcast-parity test is
  the guard.
- **On-schedule flag**: `is_catch_up_mode` remains `true` for a behind-relative-to-today
  reader even when no bonus is added. Not user-visible today; note if that flag is ever
  surfaced.
- **Catch-up rate**: a constant +1 chapter/day closes the gap at ~1 chapter/day. A reader
  many chapters behind may not finish before the plan's end. This is the accepted tradeoff
  versus the previous proportional spread.
- No schema changes, no migrations, no schedule-cache invalidation needed.

## Out of scope

- Unifying the duplicated catch-up logic into one method.
- Any change to admin "falling behind" thresholds, `lagFor()`, or the messaging lagging audience.
- Reader-app UI changes (the +1 appears through the existing reading list and counts).
