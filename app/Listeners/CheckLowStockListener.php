<?php

namespace App\Listeners;

use App\Enums\EmailType;
use App\Events\OrderCreated;
use App\Models\EmailLog;
use App\Models\User;
use App\Notifications\LowStockNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Notification;

class CheckLowStockListener implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(OrderCreated $event): void
    {
        $order = $event->order;
        $lowStockProducts = [];

        foreach ($order->items as $item) {
            $product = $item->product;
            if ($product->stock_quantity <= 5) {
                $lowStockProducts[] = $product;
            }
        }

        if (count($lowStockProducts) > 0) {
            $admins = User::where('role', 'admin')->get();
            $subject = 'Low Stock Warning';
            $content = 'The following products are low in stock: ';
            foreach ($lowStockProducts as $product) {
                $content .= "{$product->name} (Stock: {$product->stock_quantity}), ";
            }
            $content = rtrim($content, ', ');

            Notification::send($admins, new LowStockNotification($lowStockProducts));

            foreach ($admins as $admin) {
                EmailLog::create([
                    'type' => EmailType::LOW_STOCK,
                    'recipient' => $admin->email,
                    'subject' => $subject,
                    'content' => $content,
                    'sent_at' => now(),
                ]);
            }
        }
    }
}
