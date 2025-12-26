<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShopController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::with('category')
            ->when($request->input('category'), function ($query, $category) {
                $query->where('category_id', $category);
            })
            ->latest()
            ->paginate(12);

        return Inertia::render('shop/index', [
            'products' => $products,
            'categories' => Category::all(),
            'filters' => $request->only(['category']),
        ]);
    }
}
