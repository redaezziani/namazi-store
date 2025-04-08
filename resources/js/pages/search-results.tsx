import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from '@/hooks/use-search-params';
import ProductCard from './ui/card-group/card';
import { useSearchHistory } from '@/hooks/use-search-history';

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

const SearchResults = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { searchParams } = useSearchParams();
  const query = searchParams.get('q') || '';
  const { saveSearch } = useSearchHistory();

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get('/api/store/products/search', {
          params: { q: query }
        });

        setProducts(response.data.data || []);

        // Save the search query to history if results were found
        if (response.data.data && response.data.data.length > 0) {
          saveSearch(query);
        }
      } catch (err) {
        console.error('Error fetching search results:', err);
        setError('Failed to load search results');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-medium mb-6">
        {query ? `Search results for "${query}"` : 'All Products'}
      </h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md text-red-700 mb-6">
          {error}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">No products found</h2>
          <p className="text-gray-500">
            Try searching with different keywords or browse our categories
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
