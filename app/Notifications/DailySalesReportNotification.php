<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DailySalesReportNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public Collection $orders)
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $mailMessage = (new MailMessage)
            ->subject('Daily Sales Report for ' . now()->format('Y-m-d'));

        if ($this->orders->isEmpty()) {
            return $mailMessage->line('There were no sales today.');
        }

        $totalRevenue = $this->orders->sum('total_amount');
        $totalOrders = $this->orders->count();

        $mailMessage->line("Here is the summary of today's sales:")
                    ->line("Total Orders: {$totalOrders}")
                    ->line("Total Revenue: $" . number_format($totalRevenue, 2))
                    ->line("---");

        $mailMessage->line("Products Sold:");

        $this->orders->flatMap(fn ($order) => $order->items)
            ->groupBy('product.name')
            ->each(function ($items, $productName) use ($mailMessage) {
                $quantity = $items->sum('quantity');
                $mailMessage->line("- {$productName}: {$quantity} sold");
            });

        $mailMessage->action('View Dashboard', url('/dashboard'));

        return $mailMessage;
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
