<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Events\OrderCreated;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $query = Order::with(['user:id,name', 'items.product:id,name']);

        if ($user->role !== \App\Enums\UserRole::ADMIN) {
            $query->where('user_id', $user->id);
        }

        $orders = $query->latest()->paginate(10);

        return Inertia::render('orders/index', [
            'orders' => $orders,
        ]);
    }

    public function show(Order $order)
    {
        $user = Auth::user();
        abort_if(
            !($user->role === \App\Enums\UserRole::ADMIN || $user->id === $order->user_id),
            403,
            'You are not authorized to view this order.'
        );

        $order->load(['user', 'items.product']);

        return Inertia::render('orders/show', [
            'order' => $order,
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        $cartItems = $user->cartItems()->with('product')->get();

        if ($cartItems->isEmpty()) {
            return redirect()->back()->with('error', 'Your cart is empty.');
        }

        try {
            DB::beginTransaction();

            $totalAmount = $cartItems->sum(function ($cartItem) {
                return $cartItem->quantity * $cartItem->product->price;
            });

            $order = Order::create([
                'user_id' => $user->id,
                'total_amount' => $totalAmount,
                'status' => OrderStatus::PENDING,
            ]);

            foreach ($cartItems as $cartItem) {
                $order->items()->create([
                    'product_id' => $cartItem->product_id,
                    'quantity' => $cartItem->quantity,
                    'price' => $cartItem->product->price,
                ]);

                $product = $cartItem->product;
                if ($product->stock_quantity < $cartItem->quantity) {
                    throw new \Exception('Not enough stock for product: ' . $product->name);
                }
                $product->decrement('stock_quantity', $cartItem->quantity);
            }

            $user->cartItems()->delete();

            DB::commit();

            event(new OrderCreated($order));

            return redirect()->back()->with('success', 'Order placed successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Failed to place order: ' . $e->getMessage());
        }
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => ['required', Rule::in(array_column(OrderStatus::cases(), 'value'))],
        ]);

        $newStatus = OrderStatus::from($request->status);
        $user = Auth::user();

        abort_unless($user->role === \App\Enums\UserRole::ADMIN, 403,  'This action is unauthorized.');

        if ($newStatus === OrderStatus::PROCESSING && $order->status !== OrderStatus::PENDING) {
            return redirect()->back()->with('error', 'Order can only be processed from pending status.');
        }

        if (in_array($newStatus, [OrderStatus::COMPLETED, OrderStatus::CANCELLED]) && $order->status !== OrderStatus::PROCESSING) {
            return redirect()->back()->with('error', 'Set Order status to processing first.');
        }

        try {
            DB::beginTransaction();

            if ($newStatus === OrderStatus::CANCELLED && $order->status !== OrderStatus::CANCELLED) {
                foreach ($order->items as $item) {
                    Product::find($item->product_id)->increment('stock_quantity', $item->quantity);
                }
            }

            $order->status = $newStatus;
            $order->save();

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Failed to update order status: ' . $e->getMessage());
        }

        return redirect()->back()->with('success', 'Order status updated successfully.');
    }

    public function destroy(Order $order)
    {
        if (in_array($order->status, [OrderStatus::PROCESSING, OrderStatus::COMPLETED])) {
            return redirect()->back()->with('error', 'Processing or completed orders cannot be deleted.');
        }

        $user = Auth::user();

        abort_if(
            !($user->role === \App\Enums\UserRole::ADMIN || $user->id === $order->user_id),
            403,
            'You are not authorized to delete this order.'
        );

        try {
            DB::beginTransaction();

            if ($order->status === OrderStatus::PENDING) {
                foreach ($order->items as $item) {
                    Product::find($item->product_id)->increment('stock_quantity', $item->quantity);
                }
            }

            $order->delete();

            DB::commit();

            return redirect()->back()->with('success', 'Order deleted successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Failed to delete order: ' . $e->getMessage());
        }
    }
}
