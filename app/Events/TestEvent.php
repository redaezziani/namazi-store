<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class TestEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;

    // To handle FAIL errors in queue broadcasting
    public $tries = 1;
    public $maxExceptions = 1;

    /**
     * Create a new event instance.
     */
    public function __construct(string $message)
    {
        $this->message = $message;
        Log::info('TestEvent created with message: ' . $message);
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): array
    {
        Log::info('Broadcasting on test-channel');
        return [
            new Channel('test-channel'),
        ];
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        Log::info('Broadcasting data: ' . json_encode(['message' => $this->message]));
        return [
            'message' => $this->message,
            'timestamp' => time(),
        ];
    }

    /**
     * Get the event's broadcast name.
     */
    public function broadcastAs(): string
    {
        Log::info('Broadcasting as: TestEvent');
        return 'TestEvent';
    }
}
