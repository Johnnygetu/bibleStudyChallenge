<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\ReaderController;
use Illuminate\Support\Facades\Route;

Route::get('test', fn() => response(['message' => 'Test'], 200));

Route::apiResource('admins', AdminController::class);
Route::apiResource('readers', ReaderController::class);
Route::get('readers/{reader}/plans/{plan}/daily-readings', [ReaderController::class, 'dailyReadings']);
Route::get('readers/{reader}/plans/{plan}/lag-status', [ReaderController::class, 'lagStatus']);
Route::post('readers/{reader}/plans/{plan}/save-progress', [ReaderController::class, 'saveProgress']);

Route::get('plans/{plan}/schedule', [PlanController::class, 'schedule']);
Route::patch('plans/{plan}/daily-verse-limit', [PlanController::class, 'updateDailyVerseLimit']);
