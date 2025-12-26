<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        abort_unless(Auth::user()->role === UserRole::ADMIN, 403, 'You are not authorized to view this page.');

        $users = User::paginate(10);

        return Inertia::render('users/index', [
            'users' => $users,
        ]);
    }

    public function show(User $user)
    {
        abort_unless(Auth::user()->role === UserRole::ADMIN, 403, 'You are not authorized to view this page.');
        
        $user->load(['orders.items.product']);

        return Inertia::render('users/show', [
            'user' => $user,
            'orders' => $user->orders
        ]);
    }
}
