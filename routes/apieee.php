<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RabbitMQController;

Route::post('/rabbitmq/publish', [RabbitMQController::class, 'publish']);
// test get route
Route::get('/test', function (Request $request) {
    return response()->json([
        'message' => 'Hello, this is a test route!',
        'data' => $request->all(),
    ]);
});