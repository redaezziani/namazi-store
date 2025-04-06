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



