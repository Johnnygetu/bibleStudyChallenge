<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\LeaderboardController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\ProgressController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\ReaderController;
use Illuminate\Support\Facades\Route;

Route::get('test', fn () => response(['message' => 'Test'], 200));

Route::apiResource('admins', AdminController::class);
Route::apiResource('readers', ReaderController::class);
Route::get('questions/by-chapters', [QuestionController::class, 'byChapters'])->name('questions.by-chapters');
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
