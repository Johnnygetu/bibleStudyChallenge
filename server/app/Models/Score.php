<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Score extends Model
{
    protected $fillable = [
        'score',
        'reader_id',
    ];

    /**
     * The reader this score belongs to.
     */
    public function reader(): BelongsTo
    {
        return $this->belongsTo(Reader::class);
    }
}