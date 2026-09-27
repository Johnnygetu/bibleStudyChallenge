<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\ReaderController;
use Illuminate\Support\Facades\Route;

Route::get('test', fn() => response(['message' => 'Test'], 200));

Route::apiResource('admins', AdminController::class);
Route::apiResource('readers', ReaderController::class);
