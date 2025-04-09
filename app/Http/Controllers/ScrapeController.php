<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class ScrapeController extends Controller
{
    /**
     * Store products from uploaded JSON file.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            // Validate the uploaded file
            $request->validate([
                'file' => 'required|file|mimes:json,txt',
            ]);

            // Get contents of uploaded JSON file
            $json = file_get_contents($request->file('file')->getRealPath());
            $products = json_decode($json, true);

            if (!is_array($products)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid JSON structure.',
                ], 400);
            }

            Log::info('Processing ' . count($products) . ' products from file.');

            $savedCount = 0;
            $category = Category::inRandomOrder()->first();

            if (!$category) {
                return response()->json([
                    'success' => false,
                    'message' => 'No categories found in the database.'
                ], 500);
            }

            foreach ($products as $productData) {
                try {
                    // Validate product data
                    // log the product data
                    Log::info('Product data: ', $productData);

                    $name = $productData['name'] ?? 'Unnamed Product';
                    $slug = $productData['slug'] ?? Str::slug($name);
                    $description = $productData['description'] ?? '';
                    $price = (float)($productData['price'] ?? 0);
                    $sizes = !empty($productData['sizes']) ? explode('@', $productData['sizes']) : [];
                    $colors = !empty($productData['colors']) ? explode('@', $productData['colors']) : [];
                    $images = !empty($productData['prev_imgs']) ? explode('@', $productData['prev_imgs']) : [];

                    $slug = $productData['slug'] ?? Str::slug($name);

                    // Check if the slug already exists
                    if (Product::where('slug', $slug)->exists()) {
                        $slug = $slug . '-' . uniqid(); // Append a unique identifier to make the slug unique
                    }

                    $product = new Product();
                    $product->forceFill([
                        'name' => $name,
                        'slug' => $slug,
                        'description' => $description,
                        'price' => $price,
                        'sizes' => $sizes,
                        'colors' => $colors,
                        'quantity' => $productData['quantity'] ?? 1,
                        'sku' => strtoupper(Str::random(8)),
                        'cover_image' => $productData['cover_img'] ?? null,
                        'preview_images' => $images,
                        'type' => 'Clothing',
                        'is_featured' => false,
                        'is_active' => true,
                        'category_id' => $category->id,
                    ])->save();


                    $savedCount++;

                } catch (\Exception $productException) {
                    Log::error('Product import error: ' . $productException->getMessage());
                    Log::error('Stack Trace: ' . $productException->getTraceAsString()); // Logs the full stack trace

                    return response()->json([
                        'success' => false,
                        'message' => 'Failed to save product',
                        'error' => $productException->getMessage()
                    ], 500);
                }
            }



            return response()->json([
                'success' => true,
                'message' => "Successfully saved $savedCount products",
                'saved_count' => $savedCount,
                'total_received' => count($products)
            ], 201);

        } catch (\Exception $e) {
            Log::error('Product import error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to save products',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
