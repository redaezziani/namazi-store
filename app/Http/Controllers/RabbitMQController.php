<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;
use Exception;

class RabbitMQController extends Controller
{
    /**
     * Publish a message to RabbitMQ queue.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function publish(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
        ]);

        try {
            // RabbitMQ connection details (you may want to move these to .env)
            $connection = new AMQPStreamConnection(
                env('RABBITMQ_HOST', 'localhost'),
                env('RABBITMQ_PORT', 5672),
                env('RABBITMQ_USER', 'guest'),
                env('RABBITMQ_PASSWORD', 'guest')
            );

            $channel = $connection->channel();

            // Declare a queue
            $queueName = env('RABBITMQ_QUEUE', 'default_queue');
            $channel->queue_declare($queueName, false, true, false, false);

            // Create a message
            $message = new AMQPMessage($request->message, [
                'delivery_mode' => AMQPMessage::DELIVERY_MODE_PERSISTENT
            ]);

            // Publish the message
            $channel->basic_publish($message, '', $queueName);

            // Close the channel and connection
            $channel->close();
            $connection->close();

            return response()->json(['success' => true]);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
