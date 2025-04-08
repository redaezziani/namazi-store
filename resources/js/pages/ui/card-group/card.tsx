import { useRef, useState, useEffect } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from "framer-motion";
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import axios from 'axios';
import { useCartStore } from '@/stores/useCartStore';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

interface Product {
    id: string | number;
    name: string;
    description?: string;
    price: number | null | undefined;
    stock: number | null | undefined;
    slug?: string;
    sku: string;
    cover_image?: string;
    colors?: string[];
    sizes?: string[];
    is_featured: boolean;
    category: string;
    is_favorited?: boolean;
}

const ProductCard = ({ product }: { product: Product }) => {
    const displayPrice = product?.price !== undefined && product?.price !== null
        ? formatCurrency(Number(product.price))
        : 'Price not available';
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const stockAmount = product?.stock ?? 0;
    const { addItem, isInCart } = useCartStore();
    const productUrl = `/products/${product?.slug || product.id}`;
    const [addedToCart, setAddedToCart] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    const handleAddToCart = (size: string) => {
        if (!product.price) return;

        // Add item to cart with all necessary information
        addItem({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.cover_image,
            size: size,
            sku: product.sku,
        });

        // Show visual feedback
        setAddedToCart(true);
        toast("Added to cart");

        // Reset visual feedback after delay
        setTimeout(() => {
            setAddedToCart(false);
        }, 2000);
    };

    const handleSizeSelect = (size: string) => {
        setSelectedSize(size);
        handleAddToCart(size);
    };

    return (
        <article
            className="group col-span-1 flex w-full flex-col overflow-hidden transition-shadow"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <div className="border-border relative flex h-[30rem] justify-center border bg-neutral-200">
                <img src={product.cover_image} className='w-full object-contain' alt=''/>
                {product.sizes && product.sizes.length > 0 && (
                    <AnimatePresence>
                        {isHovering && (
                            <SizeSelector
                                sizes={product.sizes}
                                onSizeSelect={handleSizeSelect}
                                selectedSize={selectedSize ?? ''}
                            />
                        )}
                    </AnimatePresence>
                )}

                <AnimatePresence>
                    {addedToCart && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute bottom-24 left-0 right-0 flex justify-center"
                        >
                            <div className="rounded-full bg-black px-4 py-2 text-sm text-white shadow-lg">
                                Added to cart
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <div className="flex items-center justify-between py-1">
                <div className="flex flex-col items-start justify-start gap-1">
                    <h3 className="text-sm font-medium text-gray-800 hover:text-gray-600">{product.name}</h3>
                    <p className="text-sm text-gray-500">{displayPrice}</p>
                </div>
                <div className="flex items-center">
                    <FavoriteProduct isFavorited={product.is_favorited ?? false} id={product.id} />
                </div>
            </div>
        </article>
    );
};

interface FavoriteProductProps {
    isFavorited: boolean;
    id: string | number;
}

const FavoriteProduct = ({ isFavorited, id }: FavoriteProductProps) => {
    const props = usePage().props
    const { auth } = props;
    const [favorited, setFavorited] = useState(isFavorited);
    const [isLoading, setIsLoading] = useState(false);

    const handleProductLike = async () => {
        setIsLoading(true);
        try {
            const res = await axios.post(`/api/store/products/${id}/favorite`, {
                is_favorited: !favorited,
            });
            setFavorited(!favorited);
            setIsLoading(false);


        } catch (error) {
            console.error('Error:', error);
            setIsLoading(false);
        }
    };

    return (
        <button
            id={`favorite-product-${id}`}
            onClick={handleProductLike}
            disabled={isLoading}
            className="flex items-center justify-center rounded-full p-2 hover:bg-gray-100"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 cursor-pointer transition-colors duration-200 ${
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
    );
};


interface SizeSelectorProps {
    sizes: string[];
    onSizeSelect: (size: string) => void;
    selectedSize?: string;
}

const SizeSelector = ({ sizes = [], onSizeSelect, selectedSize }: SizeSelectorProps) => {
    const handleSizeSelect = (size: string) => {
        onSizeSelect(size);
    };

    const swiperRef = useRef<SwiperType | null>(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    const handlePrev = () => {
        swiperRef.current?.slidePrev();
    };

    const handleNext = () => {
        swiperRef.current?.slideNext();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute bottom-2 w-[80%] items-center gap-2 rounded-sm bg-white p-1.5 flex"
        >
            {!isBeginning && (
                <button
                    onClick={handlePrev}
                    className="absolute left-0 z-10 flex size-8 h-full items-center justify-center rounded-l-sm bg-white/80 px-1 hover:bg-white"
                    aria-label="Previous size"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-4 w-4"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
            )}

            <Swiper
                slidesPerView="auto"
                spaceBetween={8}
                className="size-selector-swiper p-1"
                onBeforeInit={(swiper) => {
                    swiperRef.current = swiper;
                }}
                onSlideChange={(swiper) => {
                    setIsBeginning(swiper.isBeginning);
                    setIsEnd(swiper.isEnd);
                }}
            >
                {sizes.map((size) => (
                    <SwiperSlide key={size} className="!w-auto">
                        <button
                            className={`
                                min-w-8 cursor-pointer rounded border px-2 py-1 text-xs font-semibold
                                transition-colors duration-200
                                ${selectedSize === size
                                    ? 'border-neutral-900 bg-neutral-900 text-white'
                                    : 'border-gray-300 hover:bg-gray-100'}
                            `}
                            type="button"
                            aria-label={`Select size ${size}`}
                            onClick={() => handleSizeSelect(size)}
                        >
                            {size}
                        </button>
                    </SwiperSlide>
                ))}
            </Swiper>

            {!isEnd && (
                <button
                    onClick={handleNext}
                    className="absolute right-0 z-10 flex h-full items-center justify-center rounded-r-sm bg-white/80 px-1 hover:bg-white"
                    aria-label="Next size"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-4 w-4"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
            )}
        </motion.div>
    );
};

export default ProductCard;
