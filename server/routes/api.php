<?php

use App\Http\Controllers\ChronologicalOrderController;
use App\Http\Controllers\TgUserController;
use Illuminate\Support\Facades\Route;

Route::post('/tg-users', [TgUserController::class, 'store']);
Route::get('/tg-users/{chatId}', [TgUserController::class, 'show']);

Route::get('/chronological-orders', [ChronologicalOrderController::class, 'index']);
Route::post('/chronological-orders', [ChronologicalOrderController::class, 'storeRange']);
Route::post('/chronological-order', [ChronologicalOrderController::class, 'storeRange']);
Route::match(['get', 'post'], '/chronological-orders/{start_id}/{end_id}', [ChronologicalOrderController::class, 'storeRange']);
Route::match(['get', 'post'], '/chronological-order/{start_id}/{end_id}', [ChronologicalOrderController::class, 'storeRange']);

Route::get('test', function () {
    return response([
        'message' => 'Test',
    ], 200);
});

