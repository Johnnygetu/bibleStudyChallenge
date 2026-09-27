<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Answer extends Model
{
    protected $fillable = [
        'question_id',
        'correct_answer',
        'answer_text',
    ];

    protected function casts(): array
    {
        return [
            'correct_answer' => 'boolean',
        ];
    }

    /**
     * The question this answer belongs to.
     */
    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }
}
