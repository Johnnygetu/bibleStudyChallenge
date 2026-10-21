<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Post extends Model
{
    use HasUuids;

    protected $fillable = [
        'readerId',
        'postContent',
    ];

    /**
     * Reader who wrote the post. The posts migration stores the key in the
     * camelCase `readerId` column, so the foreign key is explicit.
     */
    public function reader(): BelongsTo
    {
        return $this->belongsTo(Reader::class, 'readerId');
    }
}
