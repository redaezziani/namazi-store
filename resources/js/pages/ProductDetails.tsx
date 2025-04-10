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

        toast.success("Added to cart", {
            description: "Item has been added to your cart",
            action: {
                label: "View Cart",
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
                <div className="container mx-auto mt-32 px-4">
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
                <div className="container mx-auto mt-32 px-4">
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

    // Prepare image gallery
    const images = [product.cover_image, ...(product.preview_images || [])].filter(Boolean) as string[];

    return (
        <>
            <Head title={product.name} />
            <StoreHeader />

            <main className="container mx-auto mt-32 px-4">
                <div className="mb-6 flex items-center text-sm text-gray-500">
                    <a href="/" className="hover:text-gray-800">Home</a>
                    <span className="mx-2">/</span>
                    <a href={`/category/${product.category}`} className="hover:text-gray-800">{product.category}</a>
                    <span className="mx-2">/</span>
                    <span className="text-gray-800">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                    {/* Product Images */}
                    <div className="space-y-4">
                        <Swiper
                            spaceBetween={10}
                            navigation={true}
                            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                            modules={[FreeMode, Navigation, Thumbs]}
                            className="aspect-square w-full overflow-hidden bg-gray-100"
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

                        {images.length > 1 && (
                            <Swiper
                                onSwiper={setThumbsSwiper}
                                spaceBetween={10}
                                slidesPerView={4}
                                freeMode={true}
                                watchSlidesProgress={true}
                                modules={[FreeMode, Navigation, Thumbs]}
                                className="thumbs mt-4 h-24"
                            >
                                {images.map((image, index) => (
                                    <SwiperSlide key={index} className="cursor-pointer overflow-hidden rounded border">
                                        <img
                                            src={image}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="h-full w-full object-cover"
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col">
                        <div>
                            <h1 className="text-2xl font-medium text-gray-900 sm:text-3xl">{product.name}</h1>
                            <p className="mt-1 text-lg font-light text-gray-500">{product.category}</p>
                            <div className="mt-4 flex items-center justify-between">
                                <p className="text-2xl font-medium text-gray-900">{displayPrice}</p>
                                <button
                                    onClick={handleFavoriteToggle}
                                    className="flex items-center justify-center rounded-full p-2 hover:bg-gray-100"
                                    aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`h-6 w-6 cursor-pointer transition-colors duration-200 ${
                                            favorited ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-gray-600'
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
                        </div>

                        <Separator className="my-6" />

                        {/* Product description */}
                        <div className="prose prose-sm max-w-none">
                            <p>{product.description}</p>
                        </div>

                        <Separator className="my-6" />

                        {/* Product options */}
                        <div className="space-y-6">
                            {/* Size selector */}
                            {product.sizes && product.sizes.length > 0 && (
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Size</label>
                                    <div className="flex flex-wrap gap-2">
                                        {product.sizes.map((size) => (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() => setSelectedSize(size)}
                                                className={`inline-flex h-10 min-w-10 items-center justify-center rounded-md border px-3 py-2 text-sm font-medium transition-colors
                                                    ${selectedSize === size
                                                    ? 'border-neutral-900 bg-neutral-900 text-white'
                                                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                                }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Color selector */}
                            {product.colors && product.colors.length > 0 && (
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Color</label>
                                    <div className="flex flex-wrap gap-2">
                                        {product.colors.map((color) => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => setSelectedColor(color)}
                                                className={`relative h-10 w-10 rounded-full border-2 transition-transform
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
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Quantity</label>
                                <div className="flex w-32 items-center rounded-md border">
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
                                        className="h-10 w-12 border-0 text-center focus:outline-none"
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
                        </div>

                        {/* Add to cart button */}
                        <div className="mt-8">
                            <button
                                type="button"
                                onClick={handleAddToCart}
                                className="w-full rounded-md bg-black px-5 py-3 text-white transition-colors hover:bg-gray-800"
                            >
                                Add to Cart
                            </button>
                        </div>

                        {/* Product meta */}
                        <div className="mt-6 text-sm text-gray-500">
                            <div className="flex items-center">
                                <span className="mr-2 font-medium">SKU:</span> {product.sku}
                            </div>
                            {product.stock !== undefined && product.stock !== null && (
                                <div className="mt-1 flex items-center">
                                    <span className="mr-2 font-medium">Availability:</span>
                                    <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                </div>
                            )}
                            <div className="mt-1 flex items-center">
                                <span className="mr-2 font-medium">Category:</span> {product.category}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
