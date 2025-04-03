<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\MessageController;
use Illuminate\Support\Facades\Log;

require __DIR__.'/auth.php';
require __DIR__.'/settings.php';



Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/', function () {
        return Inertia::render('welcome', [
            'title' => 'Welcome to My Application',
            'description' => 'This is a sample application using Inertia.js and Laravel.',
        ]);
    })->name('home');
});

