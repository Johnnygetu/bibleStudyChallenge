<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['chat_id', 'full_name'])]
class TelegramUser extends Model
{
    /** @var string */
    protected $table = 'tg_users';
    protected $fillable = [
        'chat_id',
        'full_name',
    ];
}
