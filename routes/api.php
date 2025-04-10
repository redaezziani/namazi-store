<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RabbitMQController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\StoreProductController;
use App\Http\Controllers\StoreCategoryController;
use App\Http\Controllers\StoreOrderController;
use App\Http\Controllers\ScrapeController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/rabbitmq/publish', [RabbitMQController::class, 'publish']);

// Product Routes
Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index']);
    Route::post('/', [ProductController::class, 'store'])->middleware('auth:sanctum');
    Route::get('/{id}', [ProductController::class, 'show']);
    Route::put('/{id}', [ProductController::class, 'update'])->middleware('auth:sanctum');
    Route::delete('/{id?}', [ProductController::class, 'destroy'])->middleware('auth:sanctum');
});

// Product search routes
Route::get('/products/search', [ProductController::class, 'search']);

// Add additional API routes for other resources
Route::middleware('auth:sanctum')->group(function () {
    // Category routes
    // Route::apiResource('categories', CategoryController::class);

    // Order routes
    // Route::apiResource('orders', OrderController::class);

    // Discount routes
    // Route::apiResource('discounts', DiscountController::class);

    // Coupon routes
    // Route::apiResource('coupons', CouponController::class);

    // User/Customer routes (admin only)
    // Route::apiResource('users', UserController::class);

    // Favorites routes
    // Route::apiResource('favorites', FavoriteController::class);

    // Add this new route for getting user's favorites
    Route::get('/store/favorites', [StoreProductController::class, 'getUserFavorites']);

    // Order routes
    Route::get('/store/orders', [StoreOrderController::class, 'getUserOrders']);
    Route::get('/store/orders/{id}', [StoreOrderController::class, 'getOrderById']);

    // Add checkout route
    Route::post('/store/checkout', [StoreOrderController::class, 'checkout']);
});

// Store search routes
Route::get('/store/products/search', [StoreProductController::class, 'searchProducts']);

// Add this new route for filtered products
Route::get('/store/products/filter', [StoreProductController::class, 'getFilteredProducts']);

// Add this route for getting product details
Route::get('/store/products/details/{slug}', [StoreProductController::class, 'getProductDetails']);

// Add these new routes for categories
Route::get('/store/categories', [StoreCategoryController::class, 'getAllCategories']);
Route::get('/store/categories/{slug}', [StoreCategoryController::class, 'getCategoryWithProducts']);

// Search history routes (for authenticated users only)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/store/search/history', [StoreProductController::class, 'saveSearchHistory']);
    Route::get('/store/search/history', [StoreProductController::class, 'getSearchHistory']);
    Route::delete('/store/search/history', [StoreProductController::class, 'clearSearchHistory']);
});

Route::post('/store/products/{id}/favorite', [StoreProductController::class, 'setFavorite'])->middleware('auth:sanctum');

Route::get('/store/products', [StoreProductController::class, 'getAllProducts']);

// scrape
Route::post('/scrape', [ScrapeController::class, 'store']);

