import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import StoreHeader from '@/pages/ui/store-header';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ChevronRight, ShoppingBag } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  slug: string;
  product_count: number;
  subcategories: string[];
}

export default function CategoriesIndex() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [featuredCategory, setFeaturedCategory] = useState<Category | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/store/categories');

        if (response.data && Array.isArray(response.data.data)) {
          setCategories(response.data.data);

          // Set the first category with an image as the featured category
          const featured = response.data.data.find((cat: Category) => cat.image);
          if (featured) {
            setFeaturedCategory(featured);
          }
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <Head title="Shop by Category" />
      <StoreHeader />

      <main className="container mx-auto mt-20 px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-medium text-gray-900">Shop by Category</h1>
          <p className="mt-1 text-gray-500">Browse our products by category</p>
        </div>

        {loading ? (
          <div className="space-y-6">
            {/* Featured category skeleton */}
            <div className="animate-pulse bg-gray-200 h-[400px] w-full rounded-lg"></div>

            {/* Categories grid skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-40 rounded-lg mb-2"></div>
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
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-gray-100 p-6">
              <ShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-medium mb-2">No categories found</h2>
            <p className="text-gray-500 mb-6 max-w-md">
              We're currently updating our catalog. Please check back later.
            </p>
            <Button onClick={() => window.location.href = '/products'}>
              Browse All Products
            </Button>
          </div>
        ) : (
          <>
            {/* Featured category */}
            {featuredCategory && (
              <div className="relative overflow-hidden rounded-lg mb-12">
                <div className="aspect-[21/9] w-full">
                  <img
                    src={featuredCategory.image}
                    alt={featuredCategory.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-end p-6 sm:p-10">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    {featuredCategory.name}
                  </h2>
                  <p className="text-white/80 max-w-md mb-4 hidden sm:block">
                    {featuredCategory.description}
                  </p>
                  <Link href={`/categories/${featuredCategory.slug}`}>
                    <Button className="w-auto bg-white text-black hover:bg-gray-100">
                      Shop Now
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            <h2 className="text-xl font-medium mb-6">All Categories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="group rounded-lg border overflow-hidden transition-shadow hover:shadow-md"
                >
                  <div className="h-48 overflow-hidden bg-gray-50">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gray-100">
                        <ShoppingBag className="h-12 w-12 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{category.name}</h3>
                      <span className="text-sm text-gray-500">{category.product_count} products</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{category.description}</p>
                    {category.subcategories?.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-medium text-gray-500 uppercase mb-1">Popular subcategories:</p>
                        <div className="flex flex-wrap gap-1">
                          {category.subcategories.slice(0, 3).map((sub, idx) => (
                            <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {sub}
                            </span>
                          ))}
                          {category.subcategories.length > 3 && (
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                              +{category.subcategories.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="mt-4 flex items-center text-sm font-medium text-black">
                      Shop category <ChevronRight className="ml-1 h-4 w-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
    </>
  );
}
