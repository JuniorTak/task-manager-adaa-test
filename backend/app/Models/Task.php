<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    use HasFactory;

    // Add the fillable attributes for mass assignment.
    protected $fillable = [
        'title',
        'description',
        'image',
        'due_date',
        'completed',
        'user_id',
    ];

    /**
     * Define the relationship between Task and User.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
