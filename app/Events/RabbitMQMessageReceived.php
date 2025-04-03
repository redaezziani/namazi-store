<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class RabbitMQMessageReceived implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public $message;
    public $timestamp;

    public function __construct($message, $timestamp)
    {
        $this->message = $message;
        $this->timestamp = $timestamp;
    }

    public function broadcastOn()
    {
        return new Channel('rabbitmq-messages');
    }
}
