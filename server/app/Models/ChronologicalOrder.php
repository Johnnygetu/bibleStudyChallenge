<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChronologicalOrder extends Model
{
    /** @var string */
    protected $table = 'chronological_order';

    protected $fillable = [
        'chapter_id',
    ];

    /**
     * The chapter that occupies this position in the chronological order.
     */
    public function chapter(): BelongsTo
    {
        return $this->belongsTo(BookChapter::class, 'chapter_id');
    }
}
