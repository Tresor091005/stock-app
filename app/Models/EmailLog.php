<?php

namespace App\Models;

use App\Enums\EmailType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmailLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'recipient',
        'subject',
        'content',
        'sent_at',
    ];

    protected $casts = [
        'sent_at' => 'datetime',
        'type' => EmailType::class,
    ];
}
