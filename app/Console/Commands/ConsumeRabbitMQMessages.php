<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Bschmitt\Amqp\Facades\Amqp;
use App\Events\RabbitMQMessageReceived;

class ConsumeRabbitMQMessages extends Command
{
    protected $signature = 'rabbitmq:consume';
    protected $description = 'Consume messages from RabbitMQ queue';

    public function handle()
    {
        $this->info('Waiting for messages. To exit press CTRL+C');

        Amqp::consume('message_queue', function ($message, $resolver) {
            $data = json_decode($message->body, true);

            // Broadcast the message
            event(new RabbitMQMessageReceived($data['message'], $data['timestamp']));

            $resolver->acknowledge();
        });
    }
}
