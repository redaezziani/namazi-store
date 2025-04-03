import Echo from 'laravel-echo';
import io from 'socket.io-client';

window.io = io;

window.Echo = new Echo({
    broadcaster: 'socket.io',
    host: `${window.location.hostname}:6001`, // Ensure this matches your WebSocket server's host and port
});

window.Echo.channel('rabbitmq-messages')
    .listen('RabbitMQMessageReceived', (event) => {
        const messageContainer = document.getElementById('message-container');
        const messageElement = document.createElement('div');
        messageElement.textContent = `${event.timestamp}: ${event.message}`;
        messageContainer.appendChild(messageElement);
    });
