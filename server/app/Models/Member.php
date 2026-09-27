<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Member extends Model
{
    protected $fillable = [
        'group_id',
        'reader_id',
    ];

    /**
     * The group this membership belongs to.
     */
    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }

    /**
     * The reader this membership belongs to.
     */
    public function reader(): BelongsTo
    {
        return $this->belongsTo(Reader::class);
    }
}
