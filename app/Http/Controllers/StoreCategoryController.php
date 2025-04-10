<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Favorite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StoreCategoryController extends Controller
{
    /**
     * Get all categories with product counts
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function getAllCategories()
    {
        $categories = Category::withCount('products')
            ->orderBy('name')
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'description' => $category->description,
                    'image' => $category->image,
                    'slug' => $category->slug,
                    'product_count' => $category->products_count,
                    'subcategories' => $category->subcategories ?? [],
                ];
            });

        return response()->json([
            'data' => $categories
        ]);
    }

    /**
     * Get a specific category with its products
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $slug
     * @return \Illuminate\Http\Response
     */
    public function getCategoryWithProducts(Request $request, $slug)
    {
        $category = Category::where('slug', $slug)->first();

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        $query = Product::where('category_id', $category->id);

        // Filter by subcategories if specified
        if ($request->has('subcategories')) {
            $subcategories = $request->subcategories;
            $query->where(function($q) use ($subcategories) {
                foreach ($subcategories as $subcategory) {
                    // Assumes subcategory is stored in a field directly or can be queried
                    // This might need adjustment based on your actual data structure
                    $q->orWhereJsonContains('subcategory', $subcategory);
                }
            });
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

        // Paginate the products
        $perPage = $request->get('per_page', 12);
        $products = $query->paginate($perPage);

        // Get user's favorite products
        $user = Auth::user();
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

        return response()->json([
            'category' => [
                'id' => $category->id,
                'name' => $category->name,
                'description' => $category->description,
                'image' => $category->image,
                'slug' => $category->slug,
                'subcategories' => $category->subcategories ?? [],
            ],
            'products' => $products
        ]);
    }
}
