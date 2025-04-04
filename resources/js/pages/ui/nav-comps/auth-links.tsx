import React from 'react'
import { Link, usePage } from '@inertiajs/react'
import axios from 'axios';

interface User {
    name: string;
}

interface PageProps extends Record<string, unknown> {
    auth: {
        user: User | null;
    };
}

const AuthLinks = () => {
    const { auth } = usePage<PageProps>().props

    const handleLogout = async () => {
        try {
            // Get the CSRF token from the cookie instead of meta tag
            const token = document.cookie
                .split('; ')
                .find(row => row.startsWith('XSRF-TOKEN='))
                ?.split('=')[1];

            // Decode the URI component if token exists
            const csrfToken = token ? decodeURIComponent(token) : null;

            if (!csrfToken) {
                console.error('CSRF token not found');
                return;
            }

            // Include the CSRF token in the request headers
            const res = await axios.post('/logout', {}, {
                headers: {
                    'X-XSRF-TOKEN': csrfToken,
                    'Accept': 'application/json'
                },
                withCredentials: true  // Important for maintaining session cookies
            });

            if (res.status === 200 || res.status === 204) {
                window.location.href = '/login';
            }
        } catch (error) {
            console.error('Logout failed:', error);
            // If the error is due to session expiration, redirect to login anyway
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                window.location.href = '/login';
            }
        }
    }

    return (
        <>
            {auth.user ? (
                <div className="hidden md:flex space-x-6 items-center" role="navigation" aria-label="User navigation">
                    <Link href="/profile" className="text-gray-600 hover:text-black uppercase text-sm tracking-wider font-light transition-colors">
                        {auth.user.name}
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="text-gray-600 hover:text-black uppercase text-sm tracking-wider font-light transition-colors cursor-pointer"
                        type="button"
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <div className="hidden md:flex space-x-6 items-center" role="navigation" aria-label="User navigation">
                    <Link href="/login" className="text-gray-600 hover:text-black uppercase text-sm tracking-wider font-light transition-colors">
                        Login
                    </Link>
                    <Link href="/register" className="text-gray-600 hover:text-black uppercase text-sm tracking-wider font-light transition-colors">
                        Register
                    </Link>
                </div>
            )}
        </>
    )
}

export default AuthLinks
