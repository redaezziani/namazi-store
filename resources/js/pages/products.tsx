import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import StoreHeader from './ui/store-header';
import ProductCard from './ui/card-group/card';
import { Button } from '@/components/ui/button';
import { usePagination } from '@/hooks/use-pagination';
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface Product {
  id: string | number;
  name: string;
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

interface FilterState {
  search: string;
  category: string | null;
  sizes: string[];
  colors: string[];
  priceRange: [number, number];
  sort: string;
}

const initialPriceRange: [number, number] = [0, 1000];

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 12,
    total: 0,
  });

  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableSizes, setAvailableSizes] = useState<string[]>([
    'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', 'S/M', 'L/XL', '1X/2X', '3X/4X'
  ]);
  const [availableColors, setAvailableColors] = useState<string[]>([
    'black', 'white', 'gray', 'red', 'blue', 'green', 'yellow', 'purple', 'pink', 'orange', 'brown'
  ]);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: null,
    sizes: [],
    colors: [],
    priceRange: initialPriceRange,
    sort: 'latest',
  });

  useEffect(() => {
    fetchProducts();
  }, [filters, pagination.currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      params.append('page', pagination.currentPage.toString());
      params.append('per_page', pagination.perPage.toString());

      if (filters.search) {
        params.append('search', filters.search);
      }

      if (filters.category) {
        params.append('category', filters.category);
      }

      if (filters.sizes.length > 0) {
        filters.sizes.forEach(size => {
          params.append('sizes[]', size);
        });
      }

      if (filters.colors.length > 0) {
        filters.colors.forEach(color => {
          params.append('colors[]', color);
        });
      }

      params.append('min_price', filters.priceRange[0].toString());
      params.append('max_price', filters.priceRange[1].toString());
      params.append('sort', filters.sort);

      const response = await axios.get(`/api/store/products/filter?${params.toString()}`);

      setProducts(response.data.data);
      setPagination({
        currentPage: response.data.current_page,
        lastPage: response.data.last_page,
        perPage: response.data.per_page,
        total: response.data.total,
      });

      // Extract unique categories for the filter
      if (response.data.available_categories) {
        setAvailableCategories(response.data.available_categories);
      }

    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.lastPage) {
      setPagination({
        ...pagination,
        currentPage: page,
      });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      search: e.target.value,
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleCategoryChange = (category: string) => {
    setFilters({
      ...filters,
      category: category === 'all' ? null : category,
    });
  };

  const handleSizeToggle = (size: string) => {
    setFilters({
      ...filters,
      sizes: filters.sizes.includes(size)
        ? filters.sizes.filter(s => s !== size)
        : [...filters.sizes, size],
    });
  };

  const handleColorToggle = (color: string) => {
    setFilters({
      ...filters,
      colors: filters.colors.includes(color)
        ? filters.colors.filter(c => c !== color)
        : [...filters.colors, color],
    });
  };

  const handlePriceChange = (value: number[]) => {
    setFilters({
      ...filters,
      priceRange: [value[0], value[1]] as [number, number],
    });
  };

  const handleSortChange = (sort: string) => {
    setFilters({
      ...filters,
      sort,
    });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: null,
      sizes: [],
      colors: [],
      priceRange: initialPriceRange,
      sort: 'latest',
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.sizes.length > 0) count++;
    if (filters.colors.length > 0) count++;
    if (filters.priceRange[0] > initialPriceRange[0] || filters.priceRange[1] < initialPriceRange[1]) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <>
      <Head title="Shop All Products" />
      <StoreHeader />

      <main className="container mx-auto mt-20 px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-medium text-gray-900">Shop All Products</h1>
          <p className="mt-1 text-gray-500">Browse our latest collections</p>
        </div>

        {/* Mobile filter toggle */}
        <div className="flex items-center justify-between mb-6 md:hidden">
          <Button
            variant="outline"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-black text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>

          <Select value={filters.sort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="price_low">Price: Low to High</SelectItem>
              <SelectItem value="price_high">Price: High to Low</SelectItem>
              <SelectItem value="name_asc">Name: A to Z</SelectItem>
              <SelectItem value="name_desc">Name: Z to A</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters sidebar */}
          <aside className={`w-full md:w-64 ${filtersOpen ? 'block' : 'hidden'} md:block`}>
            <div className="flex items-center justify-between md:hidden mb-4">
              <h2 className="font-medium">Filters</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFiltersOpen(false)}
              >
                <X size={16} />
              </Button>
            </div>

            {/* Search filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Search</h3>
              <form onSubmit={handleSearchSubmit} className="relative">
                <Input
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={handleSearchChange}
                  className="pr-9"
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  <Search size={16} />
                </button>
              </form>
            </div>

            <Separator className="my-4" />

            {/* Category filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Category</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Checkbox
                    id="cat-all"
                    checked={filters.category === null}
                    onCheckedChange={() => handleCategoryChange('all')}
                  />
                  <label htmlFor="cat-all" className="ml-2 text-sm">All Categories</label>
                </div>

                {availableCategories.map((category) => (
                  <div key={category} className="flex items-center">
                    <Checkbox
                      id={`cat-${category}`}
                      checked={filters.category === category}
                      onCheckedChange={() => handleCategoryChange(category)}
                    />
                    <label htmlFor={`cat-${category}`} className="ml-2 text-sm">{category}</label>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-4" />

            {/* Size filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Size</h3>
              <div className="grid grid-cols-3 gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeToggle(size)}
                    className={`px-2 py-1 text-sm border text-center
                      ${filters.sizes.includes(size)
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <Separator className="my-4" />

            {/* Color filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Color</h3>
              <div className="flex flex-wrap gap-2">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorToggle(color)}
                    className={`h-8 w-8 rounded-full border transition-transform
                      ${filters.colors.includes(color)
                        ? 'border-black scale-110 ring-1 ring-black'
                        : 'border-gray-300'
                      }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  >
                    <span className="sr-only">Color: {color}</span>
                  </button>
                ))}
              </div>
            </div>

            <Separator className="my-4" />

            {/* Price range filter */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Price</h3>
                <span className="text-sm text-gray-500">
                  {formatCurrency(filters.priceRange[0])} - {formatCurrency(filters.priceRange[1])}
                </span>
              </div>

              <Slider
                defaultValue={[filters.priceRange[0], filters.priceRange[1]]}
                value={[filters.priceRange[0], filters.priceRange[1]]}
                onValueChange={handlePriceChange}
                max={1000}
                step={10}
                className="mt-6"
              />
            </div>

            <Separator className="my-4" />

            {/* Reset filters */}
            <Button
              variant="outline"
              className="w-full"
              onClick={clearFilters}
              disabled={activeFilterCount === 0}
            >
              Reset Filters
            </Button>
          </aside>

          {/* Main content */}
          <div className="flex-1">
            {/* Desktop sorting controls */}
            <div className="hidden md:flex justify-between items-center mb-6">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">{products.length}</span> of{' '}
                <span className="font-medium">{pagination.total}</span> products
              </div>

              <Select value={filters.sort} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                  <SelectItem value="name_asc">Name: A to Z</SelectItem>
                  <SelectItem value="name_desc">Name: Z to A</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active filters display */}
            {activeFilterCount > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {filters.category && (
                  <div className="rounded-full border px-3 py-1 text-sm flex items-center gap-1">
                    Category: {filters.category}
                    <button
                      onClick={() => handleCategoryChange('all')}
                      className="ml-1 text-gray-400 hover:text-gray-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                {filters.sizes.length > 0 && (
                  <div className="rounded-full border px-3 py-1 text-sm flex items-center gap-1">
                    Sizes: {filters.sizes.join(', ')}
                    <button
                      onClick={() => setFilters({...filters, sizes: []})}
                      className="ml-1 text-gray-400 hover:text-gray-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                {filters.colors.length > 0 && (
                  <div className="rounded-full border px-3 py-1 text-sm flex items-center gap-1">
                    Colors: {filters.colors.length} selected
                    <button
                      onClick={() => setFilters({...filters, colors: []})}
                      className="ml-1 text-gray-400 hover:text-gray-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                {(filters.priceRange[0] > initialPriceRange[0] || filters.priceRange[1] < initialPriceRange[1]) && (
                  <div className="rounded-full border px-3 py-1 text-sm flex items-center gap-1">
                    Price: {formatCurrency(filters.priceRange[0])} - {formatCurrency(filters.priceRange[1])}
                    <button
                      onClick={() => setFilters({...filters, priceRange: initialPriceRange})}
                      className="ml-1 text-gray-400 hover:text-gray-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                <button
                  onClick={clearFilters}
                  className="rounded-full bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Product grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 aspect-[3/4] w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-50 p-4 rounded text-red-700 mb-6">
                {error}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-xl font-medium mb-2">No products found</h2>
                <p className="text-gray-500 mb-6">
                  Try adjusting your filters or browse all products
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.lastPage > 1 && !loading && (
              <div className="mt-10 flex justify-center">
                <nav className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={pagination.currentPage === 1}
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                  >
                    <ChevronDown className="rotate-90 h-4 w-4" />
                  </Button>

                  {Array.from({ length: pagination.lastPage }, (_, i) => i + 1)
                    .filter(page =>
                      page === 1 ||
                      page === pagination.lastPage ||
                      (page >= pagination.currentPage - 1 && page <= pagination.currentPage + 1)
                    )
                    .map((page, i, array) => (
                      <React.Fragment key={page}>
                        {i > 0 && array[i - 1] !== page - 1 && (
                          <span className="text-gray-400">...</span>
                        )}
                        <Button
                          variant={pagination.currentPage === page ? "default" : "outline"}
                          size="icon"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      </React.Fragment>
                    ))
                  }

                  <Button
                    variant="outline"
                    size="icon"
                    disabled={pagination.currentPage === pagination.lastPage}
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                  >
                    <ChevronDown className="rotate-270 h-4 w-4" />
                  </Button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
