<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudyDay extends Model
{
    protected $fillable = [
        'reader_id',
        'last_studied_chapter_id',
    ];

    /**
     * The reader this study day belongs to.
     */
    public function reader(): BelongsTo
    {
        return $this->belongsTo(Reader::class);
    }

    /**
     * The last studied chapter.
     */
    public function lastStudiedChapter(): BelongsTo
    {
        return $this->belongsTo(BookChapter::class, 'last_studied_chapter_id');
    }
}
