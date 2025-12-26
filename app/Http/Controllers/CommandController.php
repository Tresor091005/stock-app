<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Auth;

class CommandController extends Controller
{
    public function sendDailySalesReport()
    {
        $user = Auth::user();

        if ($user->role !== UserRole::ADMIN) {
            abort(403, 'You are not authorized to perform this action.');
        }

        try {
            Artisan::call('sales:send-daily-report');
            return redirect()->back()->with('success','Daily sales report command triggered successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error','Failed to trigger daily sales report command.');
        }
    }
}
