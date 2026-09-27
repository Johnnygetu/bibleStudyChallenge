<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plan extends Model
{
    protected $fillable = [
        'name',
        'no_days',
        'starting_day',
        'reading_days_per_week',
    ];

    protected function casts(): array
    {
        return [
            'starting_day' => 'date',
        ];
    }

    /**
     * Chronological order entries for this plan.
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }
}
