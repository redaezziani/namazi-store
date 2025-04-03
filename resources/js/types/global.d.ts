import type { route as routeFn } from 'ziggy-js';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
    const route: typeof routeFn;

    interface Window {
        Echo: Echo;
        Pusher: typeof Pusher;
    }
}

export {};
