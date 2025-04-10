import { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import StoreHeader from '@/pages/ui/store-header';
import ProductCard from '@/pages/ui/card-group/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown, ChevronLeft, Filter } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  slug: string;
  subcategories: string[];
}

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

export default function CategoryPage() {
  const { props } = usePage();
  const { slug } = props as { slug: string };

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSubcategories, setActiveSubcategories] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState('latest');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/store/categories/${slug}`);

        if (response.data) {
          setCategory(response.data.category);
          setProducts(response.data.products.data || []);

          // Set pagination data
          if (response.data.products) {
            setPagination({
              currentPage: response.data.products.current_page || 1,
              lastPage: response.data.products.last_page || 1,
              total: response.data.products.total || 0,
            });
          }
        }
      } catch (err) {
        console.error('Error fetching category:', err);
        setError('Failed to load category products');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCategory();
    }
  }, [slug]);

  const handleSubcategoryToggle = (subcategory: string) => {
    setActiveSubcategories(prev => {
      if (prev.includes(subcategory)) {
        return prev.filter(sub => sub !== subcategory);
      } else {
        return [...prev, subcategory];
      }
    });
  };

  const handleFilterApply = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      // Add subcategories filter
      if (activeSubcategories.length > 0) {
        activeSubcategories.forEach(sub => {
          params.append('subcategories[]', sub);
        });
      }

      // Add sort option
      params.append('sort', sortOption);

      const response = await axios.get(`/api/store/categories/${slug}?${params.toString()}`);

      if (response.data) {
        setProducts(response.data.products.data || []);

        // Update pagination
        if (response.data.products) {
          setPagination({
            currentPage: response.data.products.current_page || 1,
            lastPage: response.data.products.last_page || 1,
            total: response.data.products.total || 0,
          });
        }
      }

      setIsFilterOpen(false);
    } catch (err) {
      console.error('Error applying filters:', err);
      setError('Failed to filter products');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (page: number) => {
    if (page < 1 || page > pagination.lastPage) return;

    try {
      setLoading(true);
      const params = new URLSearchParams();

      // Add current filters
      if (activeSubcategories.length > 0) {
        activeSubcategories.forEach(sub => {
          params.append('subcategories[]', sub);
        });
      }

      // Add sort option
      params.append('sort', sortOption);

      // Add page number
      params.append('page', page.toString());

      const response = await axios.get(`/api/store/categories/${slug}?${params.toString()}`);

      if (response.data) {
        setProducts(response.data.products.data || []);

        // Update pagination
        if (response.data.products) {
          setPagination({
            currentPage: response.data.products.current_page || 1,
            lastPage: response.data.products.last_page || 1,
            total: response.data.products.total || 0,
          });
        }
      }
    } catch (err) {
      console.error('Error changing page:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head title={category?.name || 'Category'} />
      <StoreHeader />

      <main className="container mx-auto mt-20 px-4 py-8">
        {loading && !category ? (
          <div className="space-y-6">
            {/* Category header skeleton */}
            <div className="animate-pulse bg-gray-200 h-[200px] w-full rounded-lg"></div>

            {/* Products grid skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-[3/4] w-full mb-2"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded text-red-700 mb-6">
            {error}
          </div>
        ) : category ? (
          <>
            {/* Category Header */}
            <div className="relative mb-8 rounded-lg overflow-hidden">
              {category.image ? (
                <div className="aspect-[21/9] w-full">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-6">
                    <h1 className="text-3xl font-bold text-white mb-2">{category.name}</h1>
                    <p className="text-white/80 max-w-2xl">{category.description}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-100 p-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{category.name}</h1>
                  <p className="text-gray-600 max-w-2xl">{category.description}</p>
                </div>
              )}
            </div>

            {/* Filters and sorting */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div className="flex items-center">
                <Button variant="outline" size="sm" onClick={() => window.history.back()}>
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Back
                </Button>

                <Separator orientation="vertical" className="mx-4 h-8" />

                <p className="text-sm text-gray-500">
                  Showing <span className="font-medium">{products.length}</span> of <span className="font-medium">{pagination.total}</span> products
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="h-10">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                      {activeSubcategories.length > 0 && (
                        <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs text-white">
                          {activeSubcategories.length}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-[300px] sm:w-[400px]">
                    <div className="py-6">
                      <h3 className="text-lg font-medium mb-4">Filter Products</h3>

                      {category.subcategories?.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-sm font-medium mb-3">Subcategories</h4>
                          <div className="space-y-2">
                            {category.subcategories.map((subcategory, idx) => (
                              <div key={idx} className="flex items-center">
                                <Checkbox
                                  id={`subcategory-${idx}`}
                                  checked={activeSubcategories.includes(subcategory)}
                                  onCheckedChange={() => handleSubcategoryToggle(subcategory)}
                                />
                                <label htmlFor={`subcategory-${idx}`} className="ml-2 text-sm">
                                  {subcategory}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 mt-8">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => setActiveSubcategories([])}
                        >
                          Reset
                        </Button>
                        <Button
                          className="flex-1"
                          onClick={handleFilterApply}
                        >
                          Apply Filters
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

                <Select value={sortOption} onValueChange={(value) => {
                  setSortOption(value);
                  setTimeout(() => handleFilterApply(), 100);
                }}>
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
            </div>

            {/* Active filters display */}
            {activeSubcategories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {activeSubcategories.map((subcategory, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm"
                  >
                    {subcategory}
                    <button
                      onClick={() => {
                        handleSubcategoryToggle(subcategory);
                        setTimeout(() => handleFilterApply(), 100);
                      }}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setActiveSubcategories([]);
                    setTimeout(() => handleFilterApply(), 100);
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 aspect-[3/4] w-full mb-2"></div>
                    <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-xl font-medium mb-2">No products found</h2>
                <p className="text-gray-500 mb-6">
                  Try adjusting your filters or browse other categories
                </p>
                <Button onClick={() => {
                  setActiveSubcategories([]);
                  setTimeout(() => handleFilterApply(), 100);
                }}>
                  Reset Filters
                </Button>
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
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <h2 className="text-xl font-medium mb-2">Category not found</h2>
            <p className="text-gray-500 mb-6">
              The category you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => window.location.href = '/categories'}>
              Browse All Categories
            </Button>
          </div>
        )}
      </main>
    </>
  );
}
