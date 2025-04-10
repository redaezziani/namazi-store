import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Enable Pusher debug logging
Pusher.logToConsole = true;

window.Pusher = Pusher;

// Get the actual values, ensuring they're not undefined
const appKey = import.meta.env.VITE_REVERB_APP_KEY;
const host = import.meta.env.VITE_REVERB_HOST;
const port = import.meta.env.VITE_REVERB_PORT || '8080';

console.log('Initializing Echo with config:', {
    key: appKey,
    host: host,
    port: port
});

// Check if configuration is valid
if (!appKey || appKey === 'undefined' || appKey === 'your-app-key') {
    console.error('Invalid Reverb app key:', appKey);
    console.error('Make sure your .env and vite.config.js are properly configured');
}

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: appKey,
    wsHost: host,
    wsPort: parseInt(port),
    wssPort: parseInt(port),
    cluster: 'mt1', // Default cluster
    forceTLS: false,
    disableStats: true,
    enabledTransports: ['ws', 'wss'],
});

// Add connection status listeners
window.Echo.connector.pusher.connection.bind('connected', () => {
    console.log('Successfully connected to Reverb WebSocket server!');
});

window.Echo.connector.pusher.connection.bind('error', (error: any) => {
    console.error('Error connecting to Reverb WebSocket server:', error);
    console.log('Current configuration:', {
        key: appKey,
        host: host,
        port: port
    });
});


import axios from 'axios';

declare global {
    interface Window {
        axios: typeof axios;
    }
}

window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.withCredentials = true; // Important for authentication
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
