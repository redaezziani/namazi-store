<?php

namespace App\Http\Controllers;

use App\Events\NewMessage;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    /**
     * Send a new message.
     */
    public function send(Request $request)
    {
        $validated = $request->validate([
            'message' => 'required|string|max:255',
        ]);

        // Broadcast the message
        event(new NewMessage($validated['message']));

        return response()->json(['success' => true]);
    }
}
