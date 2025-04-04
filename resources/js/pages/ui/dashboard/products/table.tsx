import axios from 'axios';
import { useEffect, useId, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronsLeft, ChevronsRight, Delete } from 'lucide-react';
import FilterBar, { FilterValues } from './filter-bar';
import { ProductSheet } from './product-sheet';
import DeleteProduct from './delete';

// Enhanced Product interface with more properties
interface Product {
    id: string | number;
    name: string;
    description?: string;
    price: number;
    stock: number;
    quantity: number;
    status: string;
    is_active: boolean;
    is_featured: boolean;
    category?: string | { name: string };
    category_id?: number;
    slug: string;
    sku: string;
    cover_image?: string;
    colors?: string[];
    sizes?: string[];
    type?: string;
    created_at?: string;
    updated_at?: string;
}

// Pagination interface to match Laravel's pagination structure
interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    links: {
        next: string | null;
        prev: string | null;
    };
    from: number;
    to: number;
}

interface Category {
    id: number | string;
    name: string;
}

export default function ProductsTable() {
    const id = useId();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [filters, setFilters] = useState<FilterValues>({
        search: '',
        category: null,
        status: null,
        featured: null,
        priceRange: null,
    });
    const [isAddProductOpen, setIsAddProductOpen] = useState(false);

    // Pagination state
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        perPage: 8,
        total: 0,
        from: 0,
        to: 0,
    });

    // Fetch categories for the filter dropdown
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // In a real application, you'd fetch this from your API
                // const response = await axios.get<Category[]>('/api/categories');
                // setCategories(response.data);

                // For now, let's use some dummy data
                setCategories([
                    { id: 1, name: 'Electronics' },
                    { id: 2, name: 'Clothing' },
                    { id: 3, name: 'Home & Kitchen' },
                    { id: 4, name: 'Books' },
                    { id: 5, name: 'Toys' },
                ]);
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
        };

        fetchCategories();
    }, []);

    const fetchProducts = async (page = 1) => {
        try {
            setLoading(true);

            // Build query parameters for filtering
            const params = new URLSearchParams();

            // Add pagination parameters
            params.append('page', page.toString());
            params.append('per_page', pagination.perPage.toString());

            // Add existing filter parameters
            if (filters.search) {
                params.append('search', filters.search);
            }

            if (filters.category) {
                params.append('category_id', filters.category);
            }

            if (filters.status) {
                params.append('active', filters.status === 'active' ? 'true' : 'false');
            }

            if (filters.featured) {
                params.append('featured', filters.featured);
            }

            if (filters.priceRange?.min) {
                params.append('min_price', filters.priceRange.min);
            }

            if (filters.priceRange?.max) {
                params.append('max_price', filters.priceRange.max);
            }

            const queryString = params.toString();
            const url = `/api/products${queryString ? `?${queryString}` : ''}`;

            const response = await axios.get<PaginatedResponse<Product>>(url);

            // Check if the response has a data property (paginated response)
            if (response.data && Array.isArray(response.data.data)) {
                setProducts(response.data.data);

                // Update pagination state from response
                setPagination({
                    currentPage: response.data.current_page,
                    lastPage: response.data.last_page,
                    perPage: response.data.per_page,
                    total: response.data.total,
                    from: response.data.from,
                    to: response.data.to,
                });
            } else if (Array.isArray(response.data)) {
                // Fallback for non-paginated response
                setProducts(response.data);
            } else {
                setProducts([]);
                setError('Unexpected API response format');
            }
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to load products. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Reset to page 1 when filters change
        fetchProducts(1);
    }, [filters]);

    // Handle filter changes from the FilterBar component
    const handleFilterChange = (newFilters: FilterValues) => {
        setFilters(newFilters);
    };

    // Handle pagination page change
    const handlePageChange = (page: number) => {
        if (page < 1 || page > pagination.lastPage) return;
        fetchProducts(page);
    };

    // Calculate total price of all products on current page
    const totalPrice =
        Array.isArray(products) && products.length > 0 ? products.reduce((sum, product) => sum + (product.price || 0), 0).toFixed(2) : '0.00';

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const { currentPage, lastPage } = pagination;
        const pageNumbers = [];

        // Show max 5 page numbers
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(lastPage, startPage + 4);

        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers;
    };

    return (
        <div className="mt-6 flex w-full flex-col items-start justify-start">
            <div className="mb-6 flex w-full items-center justify-between gap-x-2">
                <FilterBar onFilterChange={handleFilterChange} categories={categories} />

                <ProductSheet
                    onOpenChange={setIsAddProductOpen}
                    categories={categories}
                    isOpen={isAddProductOpen}
                    onSuccess={() => {
                        setIsAddProductOpen(false);
                        fetchProducts(pagination.currentPage);
                    }}
                />
            </div>

            <div className="bg-background w-full overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="h-11">
                                <Checkbox id={id} />
                            </TableHead>
                            <TableHead className="h-11">SKU</TableHead>
                            <TableHead className="h-11">Name</TableHead>
                            <TableHead className="h-11">Description</TableHead>
                            <TableHead className="h-11">Category</TableHead>
                            <TableHead className="h-11">Status</TableHead>
                            <TableHead className="h-11">Featured</TableHead>
                            <TableHead className="h-11 text-right">Price</TableHead>
                            <TableHead className="h-11 text-right">Stock</TableHead>
                            <TableHead className="h-11 text-right">Created</TableHead>
                            <TableHead className="h-11 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            // Loading skeleton with additional cells
                            Array.from({ length: 5 }).map((_, index) => (
                                <TableRow key={`loading-${index}`}>
                                    <TableCell>
                                        <Skeleton className="h-4 w-4" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-5 w-20" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-5 w-32" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-5 w-40" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-5 w-20" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-5 w-16" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-5 w-16" />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Skeleton className="ml-auto h-5 w-16" />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Skeleton className="ml-auto h-5 w-12" />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Skeleton className="ml-auto h-5 w-24" />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={10} className="text-center text-red-500">
                                    {error}
                                </TableCell>
                            </TableRow>
                        ) : products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={10} className="text-center">
                                    No products found
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <Checkbox id={`table-checkbox-${product.id}`} />
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>
                                        {product.description?.slice(0, 50)}
                                        {(product.description?.length ?? 0 > 50) ? '...' : ''}
                                    </TableCell>
                                    <TableCell>
                                        {typeof product.category === 'object' && product.category !== null
                                            ? product.category.name
                                            : product.category || 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={product.status === 'active' ? 'success' : 'secondary'} className="capitalize">
                                            {product.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {product.is_featured && (
                                            <Badge variant="outline" className="border-yellow-200 bg-yellow-50 text-yellow-800">
                                                Featured
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">
                                        <span className={product.stock <= 5 ? 'font-medium text-red-600' : ''}>{product.stock}</span>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-right text-xs">
                                        {new Date(product.created_at!).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="flex items-center justify-end gap-2 text-right">
                                        <DeleteProduct
                                        id={product.id}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsAddProductOpen(true);
                                            }}
                                            className="text-primary hover:text-primary/80"
                                        >
                                            Edit
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                    <TableFooter className="bg-transparent">
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={7}>Total</TableCell>
                            <TableCell className="text-right">${totalPrice}</TableCell>
                            <TableCell colSpan={2}></TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>

            {/* Pagination UI */}
            {!loading && !error && products.length > 0 && (
                <div className="mt-4 flex w-full flex-col items-center justify-between gap-4 px-1 sm:flex-row">
                    <div className="text-muted-foreground w-full text-sm">
                        Showing <span className="font-medium">{pagination.from}</span> to <span className="font-medium">{pagination.to}</span> of{' '}
                        <span className="font-medium">{pagination.total}</span> products
                    </div>

                    <Pagination>
                        <PaginationContent>
                            {/* First page button */}
                            <PaginationItem>
                                <PaginationLink
                                    onClick={() => handlePageChange(1)}
                                    disabled={pagination.currentPage === 1}
                                    aria-disabled={pagination.currentPage === 1}
                                >
                                    <ChevronsLeft className="h-4 w-4" />
                                </PaginationLink>
                            </PaginationItem>

                            {/* Previous page button */}
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                                    disabled={pagination.currentPage === 1}
                                    aria-disabled={pagination.currentPage === 1}
                                />
                            </PaginationItem>

                            {/* Page numbers */}
                            {getPageNumbers().map((page) => (
                                <PaginationItem key={page}>
                                    <PaginationLink isActive={page === pagination.currentPage} onClick={() => handlePageChange(page)}>
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            {/* Next page button */}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                                    disabled={pagination.currentPage === pagination.lastPage}
                                    aria-disabled={pagination.currentPage === pagination.lastPage}
                                />
                            </PaginationItem>

                            <PaginationItem>
                                <PaginationLink
                                    onClick={() => handlePageChange(pagination.lastPage)}
                                    disabled={pagination.currentPage === pagination.lastPage}
                                    aria-disabled={pagination.currentPage === pagination.lastPage}
                                >
                                    <ChevronsRight className="h-4 w-4" />
                                </PaginationLink>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
}
