<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Basic WebSocket Test</title>
    <script src="https://js.pusher.com/7.0/pusher.min.js"></script>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .container { max-width: 800px; margin: 0 auto; }
        .card { border: 1px solid #ddd; border-radius: 4px; padding: 15px; margin-bottom: 20px; }
        .btn { background: #3490dc; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
        .message-list { border: 1px solid #eee; padding: 10px; max-height: 300px; overflow-y: auto; }
        .status { margin-bottom: 15px; }
        .connected { color: green; }
        .disconnected { color: red; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Basic WebSocket Test</h1>

        <div class="card">
            <div class="status">
                Connection Info:
                <ul>
                    <li>App Key: <strong>{{ env('REVERB_APP_KEY') }}</strong></li>
                    <li>Host: <strong>{{ env('REVERB_HOST') }}</strong></li>
                    <li>Port: <strong>{{ env('REVERB_PORT', 8080) }}</strong></li>
                </ul>
                Status: <span id="connection-status">Connecting...</span>
            </div>

            <button class="btn" id="test-btn">Send Test Message</button>
            <button class="btn" id="direct-test-btn" style="background-color: #28a745; margin-left: 10px;">Send Direct Test</button>
        </div>

        <div class="card">
            <h2>Messages</h2>
            <div class="message-list" id="messages">
                <p>No messages received yet</p>
            </div>
        </div>

        <div class="card">
            <h2>Debug Panel</h2>
            <button class="btn" id="debug-btn" style="background-color: #6c757d;">Show Debug Info</button>
            <div id="debug-panel" style="margin-top: 10px; display: none;">
                <pre id="debug-info" style="background: #f8f9fa; padding: 10px; border-radius: 4px; max-height: 200px; overflow: auto;"></pre>
            </div>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const statusEl = document.getElementById('connection-status');
            const messagesEl = document.getElementById('messages');
            const testBtn = document.getElementById('test-btn');
            const debugBtn = document.getElementById('debug-btn');
            const debugInfo = document.getElementById('debug-info');
            const debugPanel = document.getElementById('debug-panel');

            // Debug panel toggle
            debugBtn.addEventListener('click', function() {
                if (debugPanel.style.display === 'none') {
                    debugPanel.style.display = 'block';
                    debugBtn.textContent = 'Hide Debug Info';
                } else {
                    debugPanel.style.display = 'none';
                    debugBtn.textContent = 'Show Debug Info';
                }
            });

            function log(message) {
                console.log(message);
                debugInfo.textContent += message + '\n';
                debugInfo.scrollTop = debugInfo.scrollHeight;
            }

            // Enable pusher logging for debugging
            Pusher.logToConsole = true;

            // Get config from the page
            const appKey = '{{ env('REVERB_APP_KEY') }}';
            log('Using app key: ' + appKey);

            // Initialize Pusher
            const pusher = new Pusher(appKey, {
                wsHost: '{{ env('REVERB_HOST') }}',
                wsPort: {{ env('REVERB_PORT', 8080) }},
                wssPort: {{ env('REVERB_PORT', 8080) }},
                cluster: 'mt1',
                forceTLS: false,
                enabledTransports: ['ws', 'wss']
            });

            // Connection events
            pusher.connection.bind('connected', function() {
                log('Connected to Reverb!');
                statusEl.textContent = 'Connected';
                statusEl.className = 'connected';
            });

            pusher.connection.bind('disconnected', function() {
                log('Disconnected from Reverb');
                statusEl.textContent = 'Disconnected';
                statusEl.className = 'disconnected';
            });

            pusher.connection.bind('error', function(err) {
                log('Connection error: ' + (err.message || 'Unknown error'));
                statusEl.textContent = 'Error: ' + (err.message || 'Unknown error');
                statusEl.className = 'disconnected';
            });

            // Subscribe to channel
            const channel = pusher.subscribe('test-channel');

            // Listen for all possible event name variations
            const possibleEventNames = [
                'App\\Events\\TestEvent',
                'TestEvent',
                '.TestEvent',
                'App.Events.TestEvent'
            ];

            possibleEventNames.forEach(eventName => {
                log('Listening for event: ' + eventName);

                channel.bind(eventName, function(data) {
                    log('✓ Received ' + eventName + ': ' + JSON.stringify(data));
                    addMessage('Message: ' + data.message +
                        (data.timestamp ? ' (Timestamp: ' + data.timestamp + ')' : ''));
                });
            });

            // Listen for ALL events on this channel for debugging
            pusher.bind_global(function(eventName, data) {
                if (!eventName.startsWith('pusher:')) {
                    log('Global event received: ' + eventName);
                    log('Global event data: ' + JSON.stringify(data));

                    // If this looks like our test message, display it
                    if (data && (data.message || data.data && data.data.message)) {
                        const msg = data.message || data.data.message;
                        addMessage(`Global event ${eventName}: ${msg}`);
                    }
                }
            });

            // Send test message button
            testBtn.addEventListener('click', function() {
                log('Sending test message...');
                fetch('/reverb-test')
                    .then(response => response.text())
                    .then(text => {
                        log('Server response: ' + text);
                    })
                    .catch(err => {
                        log('Error sending test message: ' + err);
                    });
            });

            // Direct test button (bypassing queue)
            document.getElementById('direct-test-btn').addEventListener('click', function() {
                log('Sending direct test message...');
                fetch('/reverb-test-direct')
                    .then(response => response.text())
                    .then(text => {
                        log('Server response: ' + text);
                    })
                    .catch(err => {
                        log('Error sending direct test message: ' + err);
                    });
            });

            // Helper function to add message to the UI
            function addMessage(message) {
                if (messagesEl.querySelector('p')) {
                    messagesEl.innerHTML = '';
                }

                const messageEl = document.createElement('div');
                messageEl.textContent = message;
                messageEl.style.borderBottom = '1px solid #eee';
                messageEl.style.padding = '8px 0';

                messagesEl.appendChild(messageEl);
            }
        });
    </script>
</body>
</html>
