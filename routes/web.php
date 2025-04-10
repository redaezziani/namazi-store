<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\MessageController;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\ProductScraperController;

require __DIR__.'/auth.php';
require __DIR__.'/settings.php';


Route::get('/', function () {
    return Inertia::render('welcome', [
        'title' => 'Welcome to My Application',
        'description' => 'This is a sample application using Inertia.js and Laravel.',
    ]);
})->name('home');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('/dashboard')->group(function () {
        Route::get('/', function () {
            return Inertia::render('dashboard', [
                'title' => 'Dashboard',
                'description' => 'This is your dashboard.',
            ]);
        })->name('dashboard');

        Route::prefix('products')->group(function () {
            Route::get('/', function () {
                return Inertia::render('products/index', [
                    'title' => 'Products',
                    'description' => 'Manage your products here.',
                ]);
            })->name('products.index');
        });
    })->name('dashboard');
});

Route::middleware(['auth'])->group(function () {
    // Admin product scraping routes
});

// Add this route for product details
Route::get('/products/{slug}', function ($slug) {
    return Inertia::render('ProductDetails', [
        'slug' => $slug
    ]);
})->name('product.details');

// Add this route where other web routes are defined
Route::get('/products', function () {
    return Inertia::render('products');
})->name('products');

// Add this route for the favorites page
Route::middleware(['auth'])->get('/favorites', function () {
    return Inertia::render('favorites');
})->name('favorites');

// Add this route for the orders page
Route::middleware(['auth'])->get('/orders', function () {
    return Inertia::render('orders');
})->name('orders');

// Add these routes for cart and checkout
Route::get('/cart', function () {
    return Inertia::render('cart');
})->name('cart');

Route::middleware(['auth'])->get('/checkout', function () {
    return Inertia::render('checkout');
})->name('checkout');

// Add this route for order confirmation
Route::middleware(['auth'])->get('/orders/{id}', function ($id) {
    return Inertia::render('order-confirmation', [
        'orderId' => $id
    ]);
})->name('order.confirmation');



