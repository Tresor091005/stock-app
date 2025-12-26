<?php

namespace App\Http\Controllers;

use App\Models\EmailLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EmailLogController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $query = EmailLog::query()->where('recipient', $user->email);

        $emailLogs = $query->latest()->paginate(10);

        return Inertia::render('email-logs/index', [
            'emailLogs' => $emailLogs,
        ]);
    }

    public function show(EmailLog $emailLog)
    {
        $user = Auth::user();
        abort_unless(
            $user->email === $emailLog->recipient,
            403,
            'You are not authorized to view this email log.'
        );

        return Inertia::render('email-logs/show', [
            'emailLog' => $emailLog,
        ]);
    }
}
