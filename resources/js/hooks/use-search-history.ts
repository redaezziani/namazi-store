import { useState, useEffect } from 'react';
import axios from 'axios';

export function useSearchHistory() {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSearchHistory = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get('/api/store/search/history');
      setRecentSearches(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch search history:', err);
      setError('Failed to load recent searches');
    } finally {
      setIsLoading(false);
    }
  };

  const saveSearch = async (query: string) => {
    if (!query.trim()) return;

    try {
      await axios.post('/api/store/search/history', { query });
      // Update local state to immediately reflect the change
      setRecentSearches(prev => [query, ...prev.filter(item => item !== query)].slice(0, 5));
    } catch (err) {
      console.error('Failed to save search:', err);
    }
  };

  const clearSearchHistory = async () => {
    try {
      await axios.delete('/api/store/search/history');
      setRecentSearches([]);
    } catch (err) {
      console.error('Failed to clear search history:', err);
      setError('Failed to clear search history');
    }
  };

  // Load search history on component mount
  useEffect(() => {
    fetchSearchHistory();
  }, []);

  return {
    recentSearches,
    isLoading,
    error,
    saveSearch,
    clearSearchHistory,
    refreshHistory: fetchSearchHistory,
  };
}
