<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Enums\UserRole;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalRevenue = Order::where('status', OrderStatus::COMPLETED)->sum('total_amount');
        $salesCount = Order::where('status', OrderStatus::COMPLETED)->count();
        $customersCount = User::where('role', UserRole::CUSTOMER)->count();
        $productsCount = Product::count();

        $recentOrders = Order::with('user')
            ->latest()
            ->take(5)
            ->get();

        $lowStockProducts = Product::where('stock_quantity', '<=', 10)
            ->with('category:id,name')
            ->orderBy('stock_quantity', 'asc')
            ->take(5)
            ->get();

        return Inertia::render('dashboard', [
            'stats' => [
                'totalRevenue' => (float) $totalRevenue,
                'salesCount' => $salesCount,
                'customersCount' => $customersCount,
                'productsCount' => $productsCount,
            ],
            'recentOrders' => $recentOrders,
            'lowStockProducts' => $lowStockProducts,
        ]);
    }
}
