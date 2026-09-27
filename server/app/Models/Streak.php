<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Streak extends Model
{
    protected $fillable = [
        'reader_id',
        'count',
    ];

    /**
     * The reader this streak belongs to.
     */
    public function reader(): BelongsTo
    {
        return $this->belongsTo(Reader::class);
    }
}
