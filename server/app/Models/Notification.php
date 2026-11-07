<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'notification_image_path',
        'notification_content',
        'notification_sent',
        'post_time',
    ];

    protected function casts(): array
    {
        return [
            'notification_sent' => 'boolean',
            'post_time' => 'datetime',
        ];
    }
}
