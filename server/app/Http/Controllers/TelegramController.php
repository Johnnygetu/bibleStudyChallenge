<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\Reader;
use GuzzleHttp\Client;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use SplFileObject;
use Swagger\Client\Api\ConvertDocumentApi;
use Swagger\Client\Configuration;

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

    /**
     * Send today's reading card graphic to the Telegram group.
     *
     * The group chat id comes from TELEGRAM_GROUP_CHAT_ID and the bot token
     * from TELEGRAM_BOT_TOKEN — the same pair the group reading broadcast
     * posts its text to. The PNG from generateDailyCardImage is attached as
     * a multipart photo upload, so no URL or file system access is needed
     * on Telegram's side.
     */
    public function sendDailyCardImage(Request $request): JsonResponse
    {
        // Same shared-secret protection the other broadcast routes use, so an
        // open internet caller cannot spam card generations.
        $broadcastToken = config('services.telegram.broadcast_token');

        if ($broadcastToken && ! hash_equals((string) $broadcastToken, (string) ($request->header('X-Broadcast-Token') ?? $request->input('token')))) {
            return response()->json(['ok' => false, 'error' => 'invalid broadcast token'], 401);
        }

        $chatId = config('services.telegram.group_chat_id')
            ?? env('TELEGRAM_GROUP_CHAT_ID');

        if (! $chatId) {
            Log::error('Daily card image: group chat id not configured');

            return response()->json(['ok' => false, 'error' => 'group chat id not configured'], 500);
        }

        $botToken = config('services.telegram.bot_token')
            ?? env('TELEGRAM_BOT_TOKEN');

        if (! $botToken) {
            Log::error('Daily card image: bot token not configured');

            return response()->json(['ok' => false, 'error' => 'bot token not configured'], 500);
        }

        $png = $this->generateDailyCardImage();

        if ($png === null) {
            return response()->json(['ok' => false, 'error' => 'failed to generate the card image'], 500);
        }

        try {
            $response = Http::attach('photo', $png, 'daily-card.png')
                ->post("https://api.telegram.org/bot{$botToken}/sendPhoto", [
                    'chat_id' => $chatId,
                ]);

            if (! $response->successful()) {
                Log::error('Daily card image: sendPhoto failed', [
                    'chat_id' => $chatId,
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return response()->json(['ok' => false, 'error' => 'failed to send card image'], 500);
            }
        } catch (\Throwable $e) {
            Log::error('Daily card image: sendPhoto exception', [
                'chat_id' => $chatId,
                'error' => $e->getMessage(),
            ]);

            return response()->json(['ok' => false, 'error' => 'failed to send card image'], 500);
        }

        return response()->json([
            'ok' => true,
            'sent' => true,
            'chat_id' => $chatId,
        ]);
    }

    /**
     * Render today's reading card graphic to PNG bytes with the Cloudmersive
     * HTML-to-PNG API (free tier, 600 conversions per month).
     *
     * The card data comes from the current plan's schedule — the same plan
     * day, total and chapter list the group broadcast announces, so the
     * graphic agrees with the messages the group already receives. The
     * layout lives in the 'graphic' blade view.
     *
     * Cloudmersive converts the HTML and returns a hosted URL per page
     * rather than raw bytes. Those bytes are fetched and passed through GD:
     * center-cropped to the card's 4:5 ratio and resampled to exactly
     * 1080x1350, ready for a Telegram photo upload.
     *
     * The converted page also gets its own generous render time, since the
     * service can take well over the 30 second web request limit.
     *
     * No route points here yet; the destination chat is specified later by
     * the sender.
     *
     * @return string|null Raw PNG bytes ready for a Telegram photo upload, or null on any failure.
     */
    public function generateDailyCardImage(): ?string
    {
        // The Cloudmersive conversion panel regularly takes longer than the
        // 30 second web request limit.
        set_time_limit(180);

        $apiKey = config('services.cloudmersive.api_key')
            ?? env('CLOUDMERSIVE_API_KEY');

        if (! $apiKey) {
            Log::error('Card image generation: Cloudmersive API key not configured');

            return null;
        }

        $plan = Plan::current();

        if (! $plan) {
            Log::error('Card image generation: no plan configured');

            return null;
        }

        $schedule = $plan->getSchedule();

        if ($schedule === []) {
            Log::error('Card image generation: the plan has no chapters', [
                'plan_id' => $plan->id,
            ]);

            return null;
        }

        // Same day arithmetic as the plan's lag logic: day 1 is the plan's
        // starting day. A plan that has not started yet, or has run out of
        // days, has no card to render.
        $dayNumber = (int) $plan->starting_day->startOfDay()->diffInDays(now()->startOfDay()) + 1;
        $totalDays = count($schedule);

        if ($dayNumber < 1 || $dayNumber > $totalDays) {
            Log::error('Card image generation: the plan is not running today', [
                'plan_id' => $plan->id,
                'day_number' => $dayNumber,
                'total_days' => $totalDays,
            ]);

            return null;
        }

        $readings = $schedule[$dayNumber - 1]['chapters'];

        // The card's headline carries today's date on the Ethiopian calendar,
        // e.g. "የዛሬ ጥቅምት 10 ንባባችን".
        $ethiopianToday = $this->gregorianToEthiopian((int) now()->year, (int) now()->month, (int) now()->day);

        $html = view('graphic', [
            'month' => $ethiopianToday['month'],
            'day' => $ethiopianToday['day'],
            'currentDay' => $dayNumber,
            'totalDays' => $totalDays,
            'readings' => $readings,
        ])->render();

        $tempHtmlPath = storage_path('app/daily-card.html');
        file_put_contents($tempHtmlPath, $html);

        try {
            $configuration = Configuration::getDefaultConfiguration()
                ->setApiKey('Apikey', $apiKey);

            $apiInstance = new ConvertDocumentApi(new Client, $configuration);

            $result = $apiInstance->convertDocumentHtmlToPng(new SplFileObject($tempHtmlPath));

            if (! $result->getSuccessful()) {
                Log::error('Card image generation: the conversion was not successful', [
                    'plan_id' => $plan->id,
                ]);

                return null;
            }

            $pages = $result->getPngResultPages() ?? [];

            if ($pages === []) {
                Log::error('Card image generation: the conversion returned no pages', [
                    'plan_id' => $plan->id,
                ]);

                return null;
            }

            // The card is a single full-page document, so the first page is
            // the whole graphic. Its bytes go straight back to the caller for
            // the Telegram upload — nothing is persisted.
            $download = Http::timeout(60)
                ->connectTimeout(30)
                ->get($pages[0]->getUrl());

            if (! $download->successful()) {
                Log::error('Card image generation: failed to download the converted PNG', [
                    'plan_id' => $plan->id,
                    'status' => $download->status(),
                ]);

                return null;
            }

            // The converter renders its own page size (a Letter-sized PDF
            // raster when left to its defaults), so force the exact card
            // geometry: center-crop to the 4:5 ratio, then resample to
            // 1080x1350.
            $source = imagecreatefromstring($download->body());

            if ($source === false) {
                Log::error('Card image generation: the converted PNG is not a readable image', [
                    'plan_id' => $plan->id,
                ]);

                return null;
            }

            $sourceWidth = imagesx($source);
            $sourceHeight = imagesy($source);

            $cropWidth = $sourceWidth;
            $cropHeight = $sourceHeight;

            if ($sourceWidth / $sourceHeight > 1080 / 1350) {
                $cropWidth = (int) round($sourceHeight * 1080 / 1350);
            } else {
                $cropHeight = (int) round($sourceWidth * 1350 / 1080);
            }

            $card = imagecreatetruecolor(1080, 1350);
            imagecopyresampled(
                $card,
                $source,
                0,
                0,
                intdiv($sourceWidth - $cropWidth, 2),
                intdiv($sourceHeight - $cropHeight, 2),
                1080,
                1350,
                $cropWidth,
                $cropHeight,
            );

            ob_start();
            imagepng($card);

            imagedestroy($source);
            imagedestroy($card);

            return (string) ob_get_clean();
        } catch (\Throwable $e) {
            Log::error('Card image generation failed', [
                'plan_id' => $plan->id,
                'error' => $e->getMessage(),
            ]);

            return null;
        } finally {
            @unlink($tempHtmlPath);
        }
    }

    /**
     * Convert a Gregorian date to its Ethiopian calendar date.
     *
     * The Amharic month name is returned directly so callers can build
     * display-ready strings (e.g. a "10 ጥቅምት 2019" headline) without
     * re-mapping the month number.
     *
     * @param  int  $year  Gregorian year.
     * @param  int  $month  Gregorian month, 1-12.
     * @param  int  $day  Gregorian day, 1-31.
     * @return array{month: string, day: int} Amharic month name and Ethiopian day of month.
     */
    private function gregorianToEthiopian(int $year, int $month, int $day): array
    {
        // Julian Day Number for the Gregorian date (PHP builtin).
        $jd = gregoriantojd($month, $day, $year);

        // Ethiopian conversion (Beyene-Kudlek): the Amete Mihret epoch sits
        // at JD 1723856, with the year rolling over every 4-year 1461-day
        // cycle (13th month has 5 days, or 6 on the Ethiopian leap year).
        $daysSinceEpoch = $jd - 1723856;
        $r = $daysSinceEpoch % 1461;
        $eYear = 4 * intdiv($daysSinceEpoch, 1461) + intdiv($r, 365) - ($r === 1460 ? 1 : 0);
        $n = ($r % 365) + 365 * intdiv($r, 1460);
        $eMonth = intdiv($n, 30) + 1;
        $eDay = ($n % 30) + 1;

        // Ethiopian month names in Amharic
        $months = [
            1 => 'መስከረም', 2 => 'ጥቅምት', 3 => 'ሕዳር', 4 => 'ታኅሣሥ',
            5 => 'ጥር', 6 => 'የካቲት', 7 => 'መጋቢት', 8 => 'ሚያዝያ',
            9 => 'ግንቦት', 10 => 'ሰኔ', 11 => 'ሐምሌ', 12 => 'ነሐሴ', 13 => 'ጳጉሜ',
        ];

        return [
            'month' => $months[$eMonth],
            'day' => $eDay,
        ];
    }
}
