<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class StoreProductController extends Controller
{
    public function getAllProducts(Request $request)
    {
        $perPage = $request->get('per_page', 10); 
        $products = Product::with('category')->paginate($perPage);
    
        $products->getCollection()->transform(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'price' => $product->price,
                'stock' => $product->quantity,
                'sku' => $product->sku,
                'slug' => $product->slug,
                'sizes' => $product->sizes,
                'colors' => $product->colors,
                'is_featured' => $product->is_featured,
                'category' => $product->category ? $product->category->name : 'Uncategorized',
                'cover_image' => $product->cover_image,
            ];
        });
    
        return response()->json($products);
    }
}
