<?php
$orders = App\Models\Order::with('chapter')->orderBy('id')->get();
for ($limit = 175; $limit <= 200; $limit++) {
    $dayNumber = 1;
    $currentDayVerses = 0;
    $currentDayChapters = 0;
    foreach ($orders as $order) {
        $verseCount = $order->chapter->num_verses;
        if ($currentDayVerses + $verseCount > $limit && $currentDayChapters > 0) {
            $dayNumber++;
            $currentDayVerses = 0;
            $currentDayChapters = 0;
        }
        $currentDayChapters++;
        $currentDayVerses += $verseCount;
    }
    echo "Limit $limit verses -> $dayNumber days\n";
}
