<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Reader extends Model
{
    protected $fillable = [
        'phone_number',
        'name',
        'chat_id',
    ];

    /**
     * Groups this reader belongs to.
     */
    public function groups(): BelongsToMany
    {
        return $this->belongsToMany(Group::class, 'members');
    }

    /**
     * Streak records for this reader.
     */
    public function streaks(): HasMany
    {
        return $this->hasMany(Streak::class);
    }

    /**
     * Score records for this reader.
     */
    public function scores(): HasMany
    {
        return $this->hasMany(Score::class);
    }

    /**
     * Study day records for this reader.
     */
    public function studyDays(): HasMany
    {
        return $this->hasMany(StudyDay::class);
    }
}
