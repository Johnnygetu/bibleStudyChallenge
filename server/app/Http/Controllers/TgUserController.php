<?php

namespace App\Http\Controllers;

use App\Models\TelegramUser;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TgUserController extends Controller
{
    /**
     * Register a Telegram user from the client side.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate(
            [
                'chat_id' => ['required', 'integer'],
                'full_name' => ['required', 'string', 'max:255'],
            ],
            [
                'chat_id.required' => 'The Telegram chat ID is required.',
                'chat_id.integer' => 'The Telegram chat ID must be a valid integer.',
                'full_name.required' => 'The full name is required.',
                'full_name.string' => 'The full name must be a text value.',
                'full_name.max' => 'The full name may not be longer than 255 characters.',
            ]
        );

        try {
            $user = TelegramUser::create($validated);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'The Telegram user could not be saved. Please try again later.',
            ], 500);
        }

        return response()->json($user, 201);
    }

    /**
     * Fetch a Telegram user by chat id.
     */
    public function show(string $chatId): JsonResponse
    {
        if (! preg_match('/^-?\d+$/', $chatId)) {
            return response()->json([
                'message' => 'The Telegram chat ID must be a valid integer.',
            ], 422);
        }

        try {
            $user = TelegramUser::where('chat_id', (int) $chatId)->first();
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'The Telegram user could not be retrieved. Please try again later.',
            ], 500);
        }

        if ($user === null) {
            return response()->json([
                'message' => 'No Telegram user was found for this chat ID.',
            ], 404);
        }

        return response()->json($user);
    }
}
