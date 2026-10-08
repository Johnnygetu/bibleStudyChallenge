<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Resend, Postmark, AWS, and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'telegram' => [
        'bot_token' => env('TELEGRAM_BOT_TOKEN'),
        'mini_app_url' => env('TELEGRAM_MINI_APP_URL', env('MINI_APP_URL')),
        // The group that receives the leaderboard broadcast. A supergroup id
        // looks like -1001234567890.
        'group_chat_id' => env('TELEGRAM_GROUP_CHAT_ID'),
        // Optional shared secret for the daily broadcast route. When set, the
        // caller must send it back as an X-Broadcast-Token header (or a token
        // in the request body).
        'broadcast_token' => env('TELEGRAM_BROADCAST_TOKEN'),
    ],

];
