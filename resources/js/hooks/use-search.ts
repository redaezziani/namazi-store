import { useState, useEffect } from 'react';
import axios from 'axios';
import { useDebounce } from './use-debounce';

interface SearchResult {
  id: string | number;
  name: string;
  price: number;
  sku: string;
  slug: string;
  category: string;
  cover_image: string;
  description?: string;
}

export function useSearch(initialQuery: string = '') {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const fetchResults = async () => {
      // Don't search if query is empty
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get('/api/store/products/search', {
          params: { q: debouncedQuery, limit: 10 },
        });

        setResults(response.data.data || []);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to fetch search results');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
  };
}
