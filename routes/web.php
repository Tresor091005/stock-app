<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\CommandController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmailLogController;
use App\Http\Controllers\ShopController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('categories', \App\Http\Controllers\CategoryController::class)->names('categories');
    Route::resource('products', \App\Http\Controllers\ProductController::class)->names('products');

    Route::get('/shop', [ShopController::class, 'index'])->name('shop.index');

    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::put('/cart/{product}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/{product}', [CartController::class, 'destroy'])->name('cart.destroy');

    Route::resource('orders', \App\Http\Controllers\OrderController::class)->names('orders');
    Route::patch('orders/{order}/status', [\App\Http\Controllers\OrderController::class, 'updateStatus'])->name('orders.updateStatus');

    Route::resource('users', \App\Http\Controllers\UserController::class)->only(['index', 'show'])->names('users');
    Route::resource('email-logs', EmailLogController::class)->only(['index', 'show'])->names('email-logs');

    Route::post('/commands/send-daily-sales-report', [CommandController::class, 'sendDailySalesReport'])
        ->name('commands.sendDailySalesReport');
});

require __DIR__.'/settings.php';
