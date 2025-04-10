import { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import StoreHeader from './ui/store-header';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/stores/useCartStore';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

interface Product {
    id: string | number;
    name: string;
    description?: string;
    price: number | null | undefined;
    stock: number | null | undefined;
    slug?: string;
    sku: string;
    cover_image?: string;
    preview_images?: string[];
    colors?: string[];
    sizes?: string[];
    is_featured: boolean;
    category: string;
    is_favorite?: boolean;
}

export default function ProductDetails() {
    const { props } = usePage();
    const { slug } = props as { slug: string };
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [quantity, setQuantity] = useState(1);
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
    const [favorited, setFavorited] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const { addItem } = useCartStore();
    const { auth } = usePage().props as any;

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/store/products/details/${slug}`);
                setProduct(response.data);
                setFavorited(response.data.is_favorite);

                // Set default selections if available
                if (response.data.sizes && response.data.sizes.length > 0) {
                    setSelectedSize(response.data.sizes[0]);
                }
                if (response.data.colors && response.data.colors.length > 0) {
                    setSelectedColor(response.data.colors[0]);
                }
            } catch (err) {
                setError('Failed to load product details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchProduct();
        }
    }, [slug]);

    const handleAddToCart = () => {
        if (!product || !product.price) return;

        if (product.sizes && product.sizes.length > 0 && !selectedSize) {
            toast.error("Please select a size");
            return;
        }

        if (product.colors && product.colors.length > 0 && !selectedColor) {
            toast.error("Please select a color");
            return;
        }

        addItem({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            quantity: quantity,
            image: product.cover_image,
            size: selectedSize,
            color: selectedColor,
            sku: product.sku,
        });

        toast.success("Added to bag", {
            description: "Item has been added to your bag",
            action: {
                label: "View Bag",
                onClick: () => {
                    window.location.href = '/cart';
                },
            },
        });
    };

    const handleQuantityChange = (amount: number) => {
        const newQuantity = quantity + amount;
        if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
            setQuantity(newQuantity);
        }
    };

    const handleFavoriteToggle = async () => {
        if (!auth?.user) {
            toast.error("Please login to add favorites", {
                description: "You need to be logged in to save favorites",
                action: {
                    label: "Login",
                    onClick: () => {
                        window.location.href = '/login';
                    },
                },
            });
            return;
        }

        if (!product) return;

        try {
            await axios.post(`/api/store/products/${product.id}/favorite`, {
                is_favorited: !favorited,
            });
            setFavorited(!favorited);
            toast.success(favorited ? "Removed from favorites" : "Added to favorites");
        } catch (error) {
            console.error('Error:', error);
            toast.error("Failed to update favorite status");
        }
    };

    if (loading) {
        return (
            <>
                <Head title="Loading Product" />
                <StoreHeader />
                <div className="container mx-auto mt-20 px-4">
                    <div className="flex h-[70vh] items-center justify-center">
                        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    </div>
                </div>
            </>
        );
    }

    if (error || !product) {
        return (
            <>
                <Head title="Product Not Found" />
                <StoreHeader />
                <div className="container mx-auto mt-20 px-4">
                    <div className="flex h-[70vh] flex-col items-center justify-center">
                        <h1 className="text-2xl font-medium text-gray-800">Product Not Found</h1>
                        <p className="mt-2 text-gray-500">The product you're looking for doesn't exist or has been removed.</p>
                        <a href="/" className="mt-6 rounded-md bg-black px-5 py-2 text-white">
                            Return to Home
                        </a>
                    </div>
                </div>
            </>
        );
    }

    const displayPrice = product.price !== undefined && product.price !== null
        ? formatCurrency(Number(product.price))
        : 'Price not available';

    const originalPrice = product.price !== undefined && product.price !== null
        ? formatCurrency(Number(product.price) * 2) // Simulating original price before discount
        : '';

    // Prepare image gallery
    const images = [product.cover_image, ...(product.preview_images || [])].filter(Boolean) as string[];

    const handlePrevSlide = () => {
        if (thumbsSwiper) {
            thumbsSwiper.slidePrev();
            setActiveIndex(thumbsSwiper.activeIndex);
        }
    };

    const handleNextSlide = () => {
        if (thumbsSwiper) {
            thumbsSwiper.slideNext();
            setActiveIndex(thumbsSwiper.activeIndex);
        }
    };

    return (
        <>
            <Head title={product.name} />
            <StoreHeader />

            <main className="container mx-auto mt-20 px-4 py-8">
                <div className="mb-6 flex items-center text-sm text-gray-500">
                    <a href="/" className="hover:text-gray-800">Home</a>
                    <span className="mx-2">/</span>
                    <a href="/women" className="hover:text-gray-800">Women</a>
                    <span className="mx-2">/</span>
                    <span className="text-gray-800 line-clamp-1">{product.name}</span>
                </div>

                <div className="grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-2">
                    {/* Product Images - Left side thumbnails + main image */}
                    <div className="flex gap-4">
                        {/* Vertical thumbnails */}
                        <div className="hidden w-20 flex-col gap-2 md:flex">
                            {images.map((image, index) => (
                                <div
                                    key={index}
                                    className={`cursor-pointer overflow-hidden border ${activeIndex === index ? 'border-black' : 'border-gray-200'}`}
                                    onClick={() => {
                                        if (thumbsSwiper) {
                                            thumbsSwiper.slideTo(index);
                                            setActiveIndex(index);
                                        }
                                    }}
                                >
                                    <img
                                        src={image}
                                        alt={`Thumbnail ${index + 1}`}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Main image with swiper */}
                        <div className="relative max-w-sm flex-1">
                            <Swiper
                                spaceBetween={10}
                                onSwiper={setThumbsSwiper}
                                onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                                className="aspect-[3/4] w-full overflow-hidden bg-gray-50"
                            >
                                {images.map((image, index) => (
                                    <SwiperSlide key={index}>
                                        <div className="relative h-full w-full">
                                            <img
                                                src={image}
                                                alt={`${product.name} - Image ${index + 1}`}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            {/* Custom navigation buttons */}
                            {images.length > 1 && (
                                <div className="absolute bottom-4 right-4 flex gap-2">
                                    <button
                                        onClick={handlePrevSlide}
                                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white  transition-transform hover:bg-gray-100"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="m15 18-6-6 6-6"/>
                                        </svg>
                                    </button>
                                    <button
                                        onClick={handleNextSlide}
                                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white  transition-transform hover:bg-gray-100"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="m9 18 6-6-6-6"/>
                                        </svg>
                                    </button>
                                </div>
                            )}

                            {/* Mobile thumbnails (visible on small screens) */}
                            <div className="mt-4 flex gap-2 md:hidden">
                                {images.slice(0, 4).map((image, index) => (
                                    <div
                                        key={index}
                                        className={`h-16 w-16 cursor-pointer overflow-hidden border ${activeIndex === index ? 'border-black' : 'border-gray-200'}`}
                                        onClick={() => {
                                            if (thumbsSwiper) {
                                                thumbsSwiper.slideTo(index);
                                                setActiveIndex(index);
                                            }
                                        }}
                                    >
                                        <img
                                            src={image}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                ))}
                                {images.length > 4 && (
                                    <div className="flex h-16 w-16 items-center justify-center border bg-gray-50 text-sm">
                                        +{images.length - 4}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col">
                        <div>
                            <h1 className="text-xl font-medium text-gray-900 sm:text-2xl">{product.name}</h1>

                            {/* Rating stars */}
                            <div className="mt-2 flex items-center">
                                <div className="flex">
                                    {Array(5).fill(0).map((_, i) => (
                                        <svg
                                            key={i}
                                            className={`h-4 w-4 ${i < 2 ? "text-yellow-400" : "text-gray-300"}`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="ml-2 text-sm text-gray-500">(54)</span>
                                <button className="ml-4 text-sm font-medium text-gray-500 underline">
                                    Share
                                </button>
                            </div>

                            {/* Price section */}
                            <div className="mt-4 flex items-center gap-2">
                                <p className="text-xl font-medium text-red-600">{displayPrice}</p>
                                <p className="text-sm text-gray-500 line-through">{originalPrice}</p>
                            </div>

                            {/* Payment options */}
                            <div className="mt-2 text-sm text-gray-600">
                                or 4 payments of $2.25 with
                                <span className="mx-1 font-semibold">
                                    <span className="text-blue-800">Pay</span><span className="text-blue-500">Pal</span>
                                </span>
                                <span className="mx-1 font-semibold">
                                    <span className="rounded bg-green-600 px-1 text-white">Affirm</span>
                                </span>
                                <span className="mx-1 font-semibold">
                                    <span className="rounded bg-pink-500 px-1 text-white">Klarna</span>
                                </span>
                            </div>

                            {/* Sale badge */}
                            <div className="mt-2">
                                <span className="font-medium text-red-600">50% Off! Prices as Marked</span>
                                <p className="text-sm text-gray-500">Final Sale</p>
                            </div>
                        </div>

                        <Separator className="my-6" />

                        {/* Size selector */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700">Size</label>
                                <button className="text-sm text-gray-500 underline">View Size Guide</button>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {['S/M', 'L/XL', '1X/2X', '3X/4X'].map((size) => (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() => setSelectedSize(size)}
                                        className={`inline-flex h-10 min-w-16 items-center justify-center rounded-none border px-4 py-2 text-sm font-medium transition-colors
                                            ${selectedSize === size
                                            ? 'border-black bg-white text-black'
                                            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color selector if needed */}
                        {product.colors && product.colors.length > 0 && (
                            <div className="mb-6">
                                <label className="mb-2 block text-sm font-medium text-gray-700">Color</label>
                                <div className="flex flex-wrap gap-2">
                                    {product.colors.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setSelectedColor(color)}
                                            className={`relative h-8 w-8 rounded-full border transition-transform
                                                ${selectedColor === color ? 'border-black scale-110' : 'border-gray-300'}`}
                                            style={{ backgroundColor: color }}
                                            title={color}
                                        >
                                            <span className="sr-only">Color: {color}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity selector */}
                        <div className="mb-6">
                            <label className="mb-2 block text-sm font-medium text-gray-700">Quantity</label>
                            <div className="flex w-32 items-center rounded-none border">
                                <button
                                    type="button"
                                    onClick={() => handleQuantityChange(-1)}
                                    disabled={quantity <= 1}
                                    className="inline-flex h-10 w-10 items-center justify-center text-gray-500 hover:text-gray-700 disabled:opacity-50"
                                >
                                    -
                                </button>
                                <input
                                    type="text"
                                    value={quantity}
                                    readOnly
                                    className="h-10 w-12 border-x border-gray-200 text-center focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleQuantityChange(1)}
                                    disabled={quantity >= (product.stock || 10)}
                                    className="inline-flex h-10 w-10 items-center justify-center text-gray-500 hover:text-gray-700 disabled:opacity-50"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Add to bag and favorite buttons */}
                        <div className="mt-2 flex gap-2">
                            <button
                                type="button"
                                onClick={handleAddToCart}
                                className="flex-1 rounded-none bg-black px-5 py-3 text-white transition-colors hover:bg-gray-800"
                            >
                                Add to Bag
                            </button>
                            <button
                                onClick={handleFavoriteToggle}
                                className="flex h-12 w-12 items-center justify-center border border-gray-300 hover:bg-gray-50"
                                aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-6 w-6 transition-colors duration-200 ${
                                        favorited ? 'text-red-500 fill-red-500' : 'text-gray-400'
                                    }`}
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
                            </button>
                        </div>

                        {/* Product details accordion */}
                        <div className="mt-8">
                            <div className="border-b border-t border-gray-200">
                                <button className="flex w-full items-center justify-between py-4 text-left">
                                    <span className="text-sm font-medium text-gray-900">Product Details</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                                        <path d="m6 9 6 6 6-6"/>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Similar styles section */}
                        <div className="mt-10">
                            <h3 className="mb-4 text-lg font-medium text-gray-900">SEE 20+ SIMILAR STYLES</h3>
                            <div className="grid grid-cols-4 gap-2">
                                {Array(4).fill(0).map((_, i) => (
                                    <a key={i} href="#" className="overflow-hidden border border-gray-200">
                                        <img
                                            src={`/api/placeholder/150/200`}
                                            alt="Similar product"
                                            className="aspect-[3/4] w-full object-cover"
                                        />
                                    </a>
                                ))}
                            </div>
                            <div className="mt-4 text-center">
                                <a href="#" className="inline-block rounded-full bg-black px-6 py-2 text-sm font-medium text-white">
                                    Shop Similar
                                </a>
                            </div>
                        </div>

                        {/* Style it with section */}
                        <div className="mt-10">
                            <h3 className="mb-4 text-lg font-medium text-gray-900">STYLE IT WITH</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {Array(2).fill(0).map((_, i) => (
                                    <div key={i} className="relative overflow-hidden border border-gray-200">
                                        <img
                                            src={`/api/placeholder/200/250`}
                                            alt="Style with product"
                                            className="aspect-[4/5] w-full object-cover"
                                        />
                                        <button className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/>
                                                <path d="M16.5 9.4 7.55 4.24"/>
                                                <polyline points="3.29 7 12 12 20.71 7"/>
                                                <line x1="12" y1="22" x2="12" y2="12"/>
                                                <circle cx="18.5" cy="15.5" r="2.5"/>
                                                <path d="M20.27 17.27 22 19"/>
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
