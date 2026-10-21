<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PostLike extends Model
{
    protected $fillable = [
        'post_id',
        'reader_id',
    ];

    /**
     * Post the like belongs to. post_id is a UUID string key, so the foreign
     * key is explicit.
     */
    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class, 'post_id');
    }

    /**
     * Reader who pressed the like.
     */
    public function reader(): BelongsTo
    {
        return $this->belongsTo(Reader::class, 'reader_id');
    }
}
