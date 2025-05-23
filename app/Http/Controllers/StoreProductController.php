<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Favorite;
use App\Models\SearchHistory;
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
    $products = Product::with('category')->latest()->paginate($perPage);
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

/**
 * Search for products to display in the store frontend
 */
public function searchProducts(Request $request)
{
    $query = $request->get('q', '');
    $limit = $request->get('limit', 10);
    $user = Auth::user();

    if (empty($query)) {
        return response()->json([
            'data' => []
        ]);
    }

    $products = Product::where('name', 'like', "%{$query}%")
        ->orWhere('description', 'like', "%{$query}%")
        ->orWhere('sku', 'like', "%{$query}%")
        ->with('category')
        ->limit($limit)
        ->get();

    $favoriteProductIds = [];
    if ($user) {
        $favoriteProductIds = Favorite::where('user_id', $user->id)->pluck('product_id')->toArray();
    }

    $products = $products->map(function ($product) use ($favoriteProductIds) {
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
            'is_favorited' => in_array($product->id, $favoriteProductIds),
        ];
    });

    return response()->json([
        'data' => $products
    ]);
}

/**
 * Save search history for the user
 */
public function saveSearchHistory(Request $request)
{
    $user = Auth::user();

    // Return empty response if no user is logged in
    if (!$user) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $validator = Validator::make($request->all(), [
        'query' => 'required|string|max:255',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'message' => 'Validation error',
            'errors' => $validator->errors()
        ], 422);
    }

    $searchQuery = $request->input('query');

    // Save to search history (you need to create the SearchHistory model)
    $search = new SearchHistory([
        'user_id' => $user->id,
        'query' => $searchQuery,
    ]);

    $search->save();

    return response()->json(['message' => 'Search saved successfully']);
}

/**
 * Get user's search history
 */
public function getSearchHistory(Request $request)
{
    $user = Auth::user();

    if (!$user) {
        return response()->json(['data' => []]);
    }

    $limit = $request->get('limit', 5);

    $searches = SearchHistory::where('user_id', $user->id)
        ->orderBy('created_at', 'desc')
        ->limit($limit)
        ->pluck('query')
        ->unique()
        ->values();

    return response()->json(['data' => $searches]);
}

/**
 * Clear user's search history
 */
public function clearSearchHistory()
{
    $user = Auth::user();

    if (!$user) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    SearchHistory::where('user_id', $user->id)->delete();

    return response()->json(['message' => 'Search history cleared successfully']);
}

public function getProductDetails(Request $request, $slug)
{
    $product = Product::with('category')->where('slug', $slug)->first();

    if (!$product) {
        return response()->json(['message' => 'Product not found'], 404);
    }

    $user = Auth::user();
    $isFavorited = false;

    if ($user) {
        $isFavorited = Favorite::where('user_id', $user->id)
            ->where('product_id', $product->id)
            ->exists();
    }

    $productData = [
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
        'preview_images' => $product->preview_images,
        'is_favorite' => $isFavorited,
    ];

    return response()->json($productData);
}

/**
 * Get filtered products for the store frontend
 */
public function getFilteredProducts(Request $request)
{
    $perPage = $request->get('per_page', 12);
    $query = Product::with('category');
    $user = Auth::user();

    // Apply search filter
    if ($request->has('search')) {
        $searchTerm = $request->search;
        $query->where(function($q) use ($searchTerm) {
            $q->where('name', 'like', "%{$searchTerm}%")
              ->orWhere('description', 'like', "%{$searchTerm}%")
              ->orWhere('sku', 'like', "%{$searchTerm}%");
        });
    }

    // Apply category filter
    if ($request->has('category')) {
        $query->whereHas('category', function($q) use ($request) {
            $q->where('name', $request->category);
        });
    }

    // Apply size filter
    if ($request->has('sizes')) {
        $sizes = $request->sizes;
        $query->where(function($q) use ($sizes) {
            foreach ($sizes as $size) {
                // This assumes sizes are stored as a JSON array in the database
                $q->orWhereJsonContains('sizes', $size);
            }
        });
    }

    // Apply color filter
    if ($request->has('colors')) {
        $colors = $request->colors;
        $query->where(function($q) use ($colors) {
            foreach ($colors as $color) {
                // This assumes colors are stored as a JSON array in the database
                $q->orWhereJsonContains('colors', $color);
            }
        });
    }

    // Apply price range filter
    if ($request->has('min_price')) {
        $query->where('price', '>=', $request->min_price);
    }

    if ($request->has('max_price')) {
        $query->where('price', '<=', $request->max_price);
    }

    // Apply sorting
    $sortBy = $request->get('sort', 'latest');
    switch ($sortBy) {
        case 'price_low':
            $query->orderBy('price', 'asc');
            break;
        case 'price_high':
            $query->orderBy('price', 'desc');
            break;
        case 'name_asc':
            $query->orderBy('name', 'asc');
            break;
        case 'name_desc':
            $query->orderBy('name', 'desc');
            break;
        case 'latest':
        default:
            $query->latest();
            break;
    }

    // Get available categories for the filter
    $availableCategories = Product::with('category')
        ->get()
        ->pluck('category.name')
        ->filter()
        ->unique()
        ->values();

    $products = $query->paginate($perPage);

    // Get user's favorite products
    $favoriteProductIds = [];
    if ($user) {
        $favoriteProductIds = Favorite::where('user_id', $user->id)->pluck('product_id')->toArray();
    }

    // Transform product data
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
            'is_favorited' => in_array($product->id, $favoriteProductIds),
        ];
    });

    // Add available categories to the response
    $products->additional = [
        'available_categories' => $availableCategories
    ];

    return response()->json($products);
}

/**
 * Get user's favorite products
 */
public function getUserFavorites()
{
    $user = Auth::user();

    if (!$user) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $favoriteIds = Favorite::where('user_id', $user->id)->pluck('product_id');
    $products = Product::with('category')->whereIn('id', $favoriteIds)->get();

    $favorites = $products->map(function ($product) {
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
            'is_favorited' => true,
        ];
    });

    return response()->json([
        'data' => $favorites
    ]);
}

}

