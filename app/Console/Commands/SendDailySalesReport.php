<?php

namespace App\Console\Commands;

use App\Enums\EmailType;
use App\Models\EmailLog;
use App\Models\Order;
use App\Models\User;
use App\Notifications\DailySalesReportNotification;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Notification;

class SendDailySalesReport extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sales:send-daily-report';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sends a daily report of all products sold that day to admin users.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Sending daily sales report...');

        $today = now()->startOfDay();
        $orders = Order::where('created_at', '>=', $today)->with('items.product')->get();
        $admins = User::where('role', 'admin')->get();

        if ($admins->isEmpty()) {
            $this->warn('No admin users found to send the report to.');
            return;
        }

        Notification::send($admins, new DailySalesReportNotification($orders));

        $subject = 'Daily Sales Report for ' . $today->format('Y-m-d');
        $content = "Daily sales report sent to all admins.";
        if ($orders->isEmpty()) {
            $content = 'There were no sales today.';
        }

        foreach ($admins as $admin) {
            EmailLog::create([
                'type' => EmailType::DAILY_REPORT,
                'recipient' => $admin->email,
                'subject' => $subject,
                'content' => $content,
                'sent_at' => now(),
            ]);
        }

        $this->info('Daily sales report sent successfully.');
    }
}
