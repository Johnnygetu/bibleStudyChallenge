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
}

