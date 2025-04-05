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
}

const ProductCard = ({ product }: { product: Product }) => {
    const displayPrice = product?.price !== undefined && product?.price !== null ? `$${Number(product.price).toFixed(2)}` : 'Price not available';

    const stockAmount = product?.stock ?? 0;

    const productUrl = `/products/${product?.slug || product.id}`;

    return (
        <article className="col-span-1 group flex w-full flex-col overflow-hidden transition-shadow">
            <div className="border-border flex justify-center relative h-[30rem] border bg-neutral-200">
            {product.sizes && product.sizes.length > 0 && (
                        <SizeSelector sizes={product.sizes} onSizeSelect={(size) => console.log(`Selected size: ${size}`)} />
            )}
                
            </div>
            <div className="flex items-center justify-between py-1">
                <div className="flex flex-col items-start justify-start gap-1">
                    <h3 className="text-sm font-medium text-gray-800 hover:text-gray-600">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.price} DH </p>
                </div>
                <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                    </svg>
                </div>
            </div>
        </article>
    );
};


interface SizeSelectorProps {
    sizes: string[];
    onSizeSelect: (size: string) => void;
}

const SizeSelector = ({ sizes = [], onSizeSelect }: SizeSelectorProps) => {
    const handleSizeSelect = (size: string) => {
        onSizeSelect(size);
    };

    return (
        <div className=" absolute hidden bg-white rounded-sm transition-all ease-in-out duration-500 p-2 group-hover:flex bottom-2  items-center gap-2">
            {sizes.map((size) => (
                <button
                    key={size}
                    className="rounded border border-gray-300 min-w-8 px-2 py-1 text-xs font-semibold  hover:bg-gray-100"
                    onClick={() => handleSizeSelect(size)}
                >
                    {size}
                </button>
            ))}
        </div>
    );

}

export default ProductCard;
