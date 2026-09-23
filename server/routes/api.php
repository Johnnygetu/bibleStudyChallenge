<?php

use App\Http\Controllers\TgUserController;
use Illuminate\Support\Facades\Route;

Route::post('/tg-users', [TgUserController::class, 'store']);
Route::get('/tg-users/{chatId}', [TgUserController::class, 'show']);
