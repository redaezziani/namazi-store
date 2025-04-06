<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Favorite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Response;
use Illuminate\Support\Str;


class StoreProductController extends Controller
{
    
public function getAllProducts(Request $request)
{
    $perPage = $request->get('per_page', 10); 
    $products = Product::with('category')->paginate($perPage);
    $user = Auth::user();
    
    
    $favoriteProductIds = [];
    if ($user) {
        $favoriteProductIds = Favorite::where('user_id', $user->id)->pluck('product_id')->toArray();
    }
    
    $products->getCollection()->transform(function ($product) use ($favoriteProductIds) {
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
            'is_favorite' => in_array($product->id, $favoriteProductIds),
        ];
    });
    
    return response()->json($products);
}

// set the product as favorite

public function setFavorite(Request $request, $id)
{
    $user = Auth::user();

    if (!$user) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $isFavorited = $request->input('is_favorited', false);

    $favorite = Favorite::where('user_id', $user->id)->where('product_id', $id)->first();

    if ($isFavorited && !$favorite) {
        Favorite::create([
            'user_id' => $user->id,
            'product_id' => $id,
        ]);
    } elseif (!$isFavorited && $favorite) {
        $favorite->delete();
    }

    return response()->json(['message' => 'Favorite updated successfully.']);
}

}

