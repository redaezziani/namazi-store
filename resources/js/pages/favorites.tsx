import { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import StoreHeader from './ui/store-header';
import ProductCard from './ui/card-group/card';
import { Button } from '@/components/ui/button';
import { HeartOff } from 'lucide-react';

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
  is_favorited: boolean;
}

export default function Favorites() {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { auth } = usePage().props as any;

  useEffect(() => {
    if (!auth?.user) {
      window.location.href = '/login';
      return;
    }

    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/store/favorites');
      setFavorites(response.data.data);
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError('Failed to load your favorite products');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (productId: string | number) => {
    try {
      await axios.post(`/api/store/products/${productId}/favorite`, {
        is_favorited: false,
      });

      // Remove the product from favorites
      setFavorites(favorites.filter(product => product.id !== productId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  return (
    <>
      <Head title="My Favorites" />
      <StoreHeader />

      <main className="container mx-auto mt-20 px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-medium text-gray-900">My Favorites</h1>
          <p className="mt-1 text-gray-500">Products you've saved for later</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(4).fill(0).map((_, i) => (
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
        ) : favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-gray-100 p-6">
              <HeartOff className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-medium mb-2">No favorites yet</h2>
            <p className="text-gray-500 mb-6 max-w-md">
              Products you mark as favorites will appear here for easy access.
            </p>
            <Button onClick={() => window.location.href = '/products'}>
              Browse Products
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <div key={product.id} className="group relative">
                <ProductCard product={product} />
                <button
                  onClick={() => handleRemoveFavorite(product.id)}
                  className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove from favorites"
                  title="Remove from favorites"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-500 fill-red-500"
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
            ))}
          </div>
        )}
      </main>
    </>
  );
}
