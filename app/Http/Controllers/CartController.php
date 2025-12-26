<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function index()
    {
        return Auth::user()->cartItems()->with('product.category')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => ['required', 'exists:products,id'],
        ]);

        $product_id = $request->input('product_id');
        $user = Auth::user();

        /** @var CartItem|null $cartItem */
        $cartItem = $user->cartItems()->where('product_id', $product_id)->first();

        if ($cartItem) {
            $cartItem->increment('quantity');
        } else {
            $user->cartItems()->create([
                'product_id' => $product_id,
                'quantity' => 1,
            ]);
        }

        return response()->json(['message' => 'Product added to cart.']);
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $quantity = $request->input('quantity');
        $user = Auth::user();

        $user->cartItems()->updateOrCreate(
            ['product_id' => $product->id], 
            ['quantity' => $quantity,]
        );

        return response()->json(['message' => 'Cart updated.']);
    }

    public function destroy(Product $product)
    {
        Auth::user()->cartItems()->where('product_id', $product->id)->delete();

        return response()->json(['message' => 'Product removed from cart.']);
    }
}
