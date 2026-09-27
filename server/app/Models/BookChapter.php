<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookChapter extends Model
{
    protected $fillable = [
        'book',
        'chapter_number',
        'num_verses',
    ];
}
