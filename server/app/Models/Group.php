<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Group extends Model
{
    protected $fillable = [
        'name',
    ];

    /**
     * Readers that belong to this group.
     */
    public function readers(): BelongsToMany
    {
        return $this->belongsToMany(Reader::class, 'members')->withPivot('is_leader');
    }
}
