<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\DailyReadingBroadcastController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\LeaderboardController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\ProgressController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\ReaderController;
use App\Http\Controllers\TelegramController;
use App\Http\Controllers\TelegramLeaderboardController;
use Illuminate\Support\Facades\Route;

Route::get('test', fn () => response(['message' => 'Test'], 200));

Route::apiResource('admins', AdminController::class);
Route::get('readers/by-chat/{chatId}', [ReaderController::class, 'showByChatId']);
Route::apiResource('readers', ReaderController::class);
Route::get('questions/by-chapters', [QuestionController::class, 'byChapters'])->name('questions.by-chapters');
Route::post('questions/bulk', [QuestionController::class, 'bulkStore'])->name('questions.bulk');
Route::apiResource('questions', QuestionController::class);
Route::apiResource('groups', GroupController::class);
Route::post('groups/assign-random', [GroupController::class, 'assignRandom'])->name('groups.assign-random');
Route::post('groups/{group}/swap', [GroupController::class, 'swapMember'])->name('groups.swap');
Route::put('groups/{group}/members/{reader}/leader', [GroupController::class, 'setLeader'])->name('groups.set-leader');
Route::get('leaderboard', [LeaderboardController::class, 'index'])->name('leaderboard.index');
Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard.index');
Route::get('progress', [ProgressController::class, 'index'])->name('progress.index');
Route::get('readers/{reader}/plans/{plan}/daily-readings', [ReaderController::class, 'dailyReadings']);
Route::get('readers/{reader}/plans/{plan}/lag-status', [ReaderController::class, 'lagStatus']);
Route::post('readers/{reader}/plans/{plan}/save-progress', [ReaderController::class, 'saveProgress']);
Route::post('readers/{reader}/scores', [ReaderController::class, 'storeScore'])->name('scores.store');

Route::get('plans/{plan}/schedule', [PlanController::class, 'schedule']);
Route::patch('plans/{plan}/daily-verse-limit', [PlanController::class, 'updateDailyVerseLimit']);

// Daily broadcast: every reader gets today's reading over Telegram.
Route::post('telegram/daily-readings', DailyReadingBroadcastController::class)->name('telegram.daily-readings');

// Leaderboard broadcast: the standings go to the Telegram group.
Route::post('telegram/leaderboard', TelegramLeaderboardController::class)->name('telegram.leaderboard');
Route::post('telegram', [TelegramController::class, 'webhook'])->name('telegram.webhook');
