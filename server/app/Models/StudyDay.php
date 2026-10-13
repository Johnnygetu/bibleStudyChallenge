<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
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
     * Order by the position a study day records, newest first.
     *
     * Study days are normally inserted in the order the reader reads, so this
     * matches `latest('id')`. The exception is an admin override, which is
     * recorded as the reader's position at the start of today (backdated just
     * before today) so it restarts today's reading: ordering by when a
     * position was recorded keeps such a row from shadowing a real reading
     * that is recorded later on.
     *
     * @param  Builder<StudyDay>  $query
     * @return Builder<StudyDay>
     */
    public function scopeNewestPosition(Builder $query): Builder
    {
        return $query->orderByDesc('created_at')->orderByDesc('id');
    }

    /**
     * The last studied chapter.
     */
    public function lastStudiedChapter(): BelongsTo
    {
        return $this->belongsTo(BookChapter::class, 'last_studied_chapter_id');
    }
}
