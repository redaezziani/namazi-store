<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RabbitMQController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\StoreProductController;

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
    Route::delete('/{id}', [ProductController::class, 'destroy'])->middleware('auth:sanctum');
});

// Add additional API routes for other resources
Route::middleware('auth:sanctum')->group(function() {
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
});

// this is for store product
Route::get('/store/products', [StoreProductController::class, 'getAllProducts']);
