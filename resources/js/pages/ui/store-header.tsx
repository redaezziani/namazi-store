import { Link } from '@inertiajs/react';
import { ArrowRightIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import AuthLinks from './nav-comps/auth-links';
import Cart from './nav-comps/cart';
import SearchProducts from './nav-comps/search';

const StoreHeader = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const mainLinks = [
        { name: 'Home', href: '/' },
        { name: 'Products', href: '/products' },
        { name: 'Categories', href: '/categories' },
        { name: 'Contact', href: '/contact' },
    ];

    const userLinks = [
        { name: 'Login', href: '/login' },
        { name: 'Register', href: '/register' },
        { name: 'Search', href: '/search' },
        { name: 'Cart(0)', href: '/cart' },
        { name: 'Like', href: '/like' },
    ];

    return (
        <header
            className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-white/90   backdrop-blur-md' : 'bg-white'}`}
        >
            <div className="dark bg-muted border-border border-b text-foreground px-4 py-3">
                <p className="flex justify-center text-sm">
                    <a href="#" className="group">
                        <span className="me-1 text-base leading-none">✨</span>
                        Introducing transactional and marketing emails
                        <ArrowRightIcon
                            className="ms-2 -mt-0.5 inline-flex opacity-60 transition-transform group-hover:translate-x-0.5"
                            size={16}
                            aria-hidden="true"
                        />
                    </a>
                </p>
            </div>
            <div className="container mx-auto flex py-2 items-center justify-between px-4">
                {/* Logo */}
                <div className="text-xl font-bold tracking-tighter">
                    <Link href="/" className="text-black transition hover:text-gray-700">
                        <span className="font-light">NAMA</span>
                        <span className="font-bold">ZI</span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:block">
                    <ul className="flex space-x-8" role="navigation" aria-label="Main navigation">
                        {mainLinks.map((link) => (
                            <li key={link.name}>
                                <Link
                                    href={link.href}
                                    className="text-sm font-light tracking-wider text-gray-600 uppercase transition-colors hover:text-black"
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* User Links - Desktop */}
                <div className="hidden items-center space-x-6 md:flex" role="navigation" aria-label="User navigation">
                    <Cart />
                    <SearchProducts />
                    <AuthLinks />

                    {/* {userLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-gray-600 hover:text-black text-sm transition-colors"
                        >
                            {link.name === 'Search' ? (
                                <span className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </span>
                            ) : link.name === 'Cart(0)' ? (
                                <span className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </span>
                            ) : link.name === 'Like' ? (
                                <span className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </span>
                            ) : (
                                link.name
                            )}
                        </Link>
                    ))} */}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="flex items-center md:hidden"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-expanded={isMobileMenuOpen}
                    aria-controls="mobile-menu"
                    aria-label="Toggle mobile menu"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {isMobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            <div
                id="mobile-menu"
                className={`overflow-hidden transition-all duration-300 md:hidden ${isMobileMenuOpen ? 'max-h-screen border-t py-4' : 'max-h-0'}`}
            >
                <div className="container mx-auto px-4">
                    <nav className="mb-6 flex flex-col space-y-4">
                        {mainLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="py-2 font-light tracking-wide text-gray-600 uppercase hover:text-black"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                    <div className="flex flex-wrap gap-6 border-t pt-4">
                        {userLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="inline-flex items-center space-x-1 text-gray-600 hover:text-black"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.name === 'Search' ? (
                                    <>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                            />
                                        </svg>
                                        <span>Search</span>
                                    </>
                                ) : link.name === 'Cart(0)' ? (
                                    <>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                            />
                                        </svg>
                                        <span>Cart (0)</span>
                                    </>
                                ) : link.name === 'Like' ? (
                                    <>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                            />
                                        </svg>
                                        <span>Favorites</span>
                                    </>
                                ) : (
                                    link.name
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default StoreHeader;
