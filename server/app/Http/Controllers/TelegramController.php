<?php

namespace App\Http\Controllers;

use App\Models\Reader;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TelegramController extends Controller
{
    /**
     * Telegram webhook entry point.
     *
     * Only handles the /start command; every other update is acknowledged and ignored.
     *
     * For /start, checks whether the sender's chat_id exists in the readers table.
     * - If found: "Welcome back" + Continue Plan button
     * - If not: welcome message + Start Plan button
     *
     * Both buttons open the Mini App via Telegram's web_app inline button.
     */
    public function webhook(Request $request): JsonResponse
    {
        $update = $request->all();

        // Only react to /start (also accepts "/start@MyBot" and "/start payload").
        $messageText = trim($update['message']['text'] ?? '');
        $command = strtolower(strtok($messageText, " \n\t") ?: '');
        $isStartCommand = $command === '/start' || str_starts_with($command, '/start@');

        if (! $isStartCommand) {
            return response()->json(['ok' => true]);
        }

        $chatId = $update['message']['chat']['id']
            ?? $update['message']['from']['id']
            ?? $update['edited_message']['chat']['id']
            ?? $update['channel_post']['chat']['id']
            ?? $update['callback_query']['message']['chat']['id']
            ?? $update['callback_query']['from']['id']
            ?? $update['my_chat_member']['chat']['id']
            ?? null;

        if (! $chatId) {
            Log::warning('Telegram webhook: missing chat id', ['update' => $update]);

            return response()->json(['ok' => false, 'error' => 'missing chat id']);
        }

        $firstName = $update['message']['from']['first_name']
            ?? $update['edited_message']['from']['first_name']
            ?? $update['callback_query']['from']['first_name']
            ?? null;

        // "registered for the plan" = reader row with this chat_id exists.
        // The column is unique and links a Telegram user to a Reader.
        $reader = Reader::where('chat_id', $chatId)->first();
        $isRegistered = $reader !== null;

        $displayName = $reader?->name ?? $firstName ?? 'there';

        if ($isRegistered) {
            $text = "Welcome back, {$displayName}! 👋\n\nGreat to see you again. Continue your Bible study plan where you left off.";
            $buttonText = 'Continue Plan';
        } else {
            $text = "Welcome! 🙏\n\nWelcome to Bible Study Challenge.\nStart your daily reading plan and grow in the Word every day.";
            $buttonText = 'Start Plan';
        }

        $miniAppUrl = config('services.telegram.mini_app_url')
            ?? env('TELEGRAM_MINI_APP_URL')
            ?? env('MINI_APP_URL')
            ?? config('app.url');

        if (! $miniAppUrl) {
            Log::error('Telegram webhook: mini app URL not configured');

            return response()->json(['ok' => false, 'error' => 'mini app url not configured'], 500);
        }

        $botToken = config('services.telegram.bot_token')
            ?? env('TELEGRAM_BOT_TOKEN');

        if (! $botToken) {
            Log::error('Telegram webhook: bot token not configured');

            return response()->json(['ok' => false, 'error' => 'bot token not configured'], 500);
        }

        // Send the message with a Mini App web_app button.
        try {
            $response = Http::timeout(10)->post("https://api.telegram.org/bot{$botToken}/sendMessage", [
                'chat_id' => $chatId,
                'text' => $text,
                'parse_mode' => 'HTML',
                'reply_markup' => [
                    'inline_keyboard' => [
                        [
                            [
                                'text' => $buttonText,
                                'web_app' => ['url' => $miniAppUrl],
                            ],
                        ],
                    ],
                ],
            ]);

            if (! $response->successful()) {
                Log::error('Telegram sendMessage failed', [
                    'chat_id' => $chatId,
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return response()->json(['ok' => false, 'error' => 'failed to send message'], 500);
            }
        } catch (\Throwable $e) {
            Log::error('Telegram sendMessage exception', [
                'chat_id' => $chatId,
                'error' => $e->getMessage(),
            ]);

            return response()->json(['ok' => false, 'error' => 'failed to send message'], 500);
        }

        return response()->json(['ok' => true]);
    }
}
