<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BookChapter extends Model
{
    protected $fillable = [
        'book',
        'chapter_number',
        'num_verses',
    ];

    /**
     * Chronological order occurrences for this book chapter.
     */
    public function chronologicalOrders(): HasMany
    {
        return $this->hasMany(ChronologicalOrder::class, 'chapter_id');
    }

    /**
     * Questions associated with this book chapter.
     */
    public function questions(): HasMany
    {
        return $this->hasMany(Question::class, 'chapter_id');
    }

    /**
     * Study day records referencing this chapter.
     */
    public function studyDays(): HasMany
    {
        return $this->hasMany(StudyDay::class, 'last_studied_chapter_id');
    }
}
