<?php
$plan = App\Models\Plan::first();
if ($plan) {
    $plan->daily_verse_limit = 189;
    $plan->no_days = 180;
    $plan->save();
    $plan->clearScheduleCache();
    echo "Updated Plan successfully!\n";
} else {
    echo "Plan not found.\n";
}
