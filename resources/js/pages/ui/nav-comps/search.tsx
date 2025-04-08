import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SearchIcon, XIcon, ArrowRightIcon, ClockIcon, TrendingUpIcon } from 'lucide-react';
import { useState, useEffect, useRef, FormEvent } from 'react';
import { useSearch } from '@/hooks/use-search';
import { useSearchHistory } from '@/hooks/use-search-history';
import { Link, router } from '@inertiajs/react';
import { useOnClickOutside } from '@/hooks/use-click-outside';

interface SearchResultItem {
  id: string | number;
  name: string;
  price: number;
  sku: string;
  slug: string;
  category: string;
  cover_image: string;
  description?: string;
}

// Trending items (can be replaced with real trending data from an API)
const trendingItems = [
  { id: 1, name: 'Oversized blazer', category: 'Outerwear' },
  { id: 2, name: 'High-waisted jeans', category: 'Bottoms' },
  { id: 3, name: 'Silk blouse', category: 'Tops' },
  { id: 4, name: 'Platform boots', category: 'Footwear' },
  { id: 5, name: 'Structured tote', category: 'Accessories' },
];

const SearchProducts = () => {
  const [open, setOpen] = useState(false);
  const { query, setQuery, results, isLoading } = useSearch();
  const { recentSearches, saveSearch, clearSearchHistory } = useSearchHistory();
  const inputRef = useRef<HTMLInputElement>(null);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Focus the input when the search sheet opens
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Handle click outside to close results
  useOnClickOutside(resultsRef, () => setShowResults(false));

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();

    if (!query.trim()) return;

    // Save search query to history
    saveSearch(query);

    // Close the search sheet
    setOpen(false);

    // Navigate to search results page
    router.get(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleSearchItemClick = (searchQuery: string) => {
    setQuery(searchQuery);

    // Save to search history
    saveSearch(searchQuery);

    // Navigate to search results page
    router.get(`/search?q=${encodeURIComponent(searchQuery)}`);

    // Close the sheet
    setOpen(false);
  };

  const handleProductClick = (product: SearchResultItem) => {
    // Save search to history
    saveSearch(product.name);

    // Close the sheet
    setOpen(false);

    // Navigate to product page
    router.get(`/products/${product.slug || product.id}`);
  };

  const clearSearch = () => {
    setQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button className="group flex items-center" aria-label="Search">
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
          </button>
        </SheetTrigger>
        <SheetContent side="top" className="h-[85vh] w-full overflow-y-auto px-4 sm:px-6">
          <div className="mx-auto mt-6 w-2xl">
            <form onSubmit={handleSearch} className="relative mb-8">
              <Input
                ref={inputRef}
                type="search"
                placeholder="Search for products, brands, and more..."
                className="h-12 pr-10 text-base rounded-none"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
              />
              {query ? (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              ) : (
                <span className="flex absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-gray-400 items-center">
                  <SearchIcon className="h-5 w-5" />
                </span>
              )}

              {/* Search Results Dropdown */}
              {showResults && query.trim() && (
                <div
                  ref={resultsRef}
                  className="absolute z-10 w-full bg-white mt-1 border border-gray-200  max-h-[70vh] overflow-y-auto"
                >
                  {isLoading ? (
                    <div className="p-4 text-center text-gray-500">Loading results...</div>
                  ) : results.length > 0 ? (
                    <div className="py-2">
                      <h3 className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">Products</h3>
                      {results.map((result) => (
                        <div
                          key={result.id}
                          className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center"
                          onClick={() => handleProductClick(result)}
                        >
                          {result.cover_image && (
                            <div className="h-12 w-12 bg-gray-100 flex-shrink-0 mr-3">
                              <img src={result.cover_image} alt={result.name} className="h-full w-full object-cover" />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="text-sm font-medium">{result.name}</div>
                            <div className="text-xs text-gray-500">{result.category}</div>
                          </div>
                          <div className="text-sm font-medium">
                            ${Number(result.price).toFixed(2)}
                          </div>
                        </div>
                      ))}
                      <div className="px-4 py-2 border-t">
                        <button
                          className="w-full flex items-center justify-center text-sm text-blue-600 hover:text-blue-800 py-1"
                          onClick={handleSearch}
                        >
                          See all results <ArrowRightIcon className="ml-1 h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ) : query.length > 0 ? (
                    <div className="p-4 text-center text-gray-500">No results found</div>
                  ) : null}
                </div>
              )}
            </form>

            <div className="space-y-8">
              {!query ? (
                <>
                  {/* Recent searches */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-500 flex items-center">
                        <ClockIcon className="h-4 w-4 mr-2" /> Recent searches
                      </h3>
                      {recentSearches.length > 0 && (
                        <Button
                          variant="link"
                          className="h-auto p-0 text-xs text-gray-500"
                          onClick={clearSearchHistory}
                        >
                          Clear all
                        </Button>
                      )}
                    </div>
                    {recentSearches.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((search, index) => (
                          <button
                            key={index}
                            className="rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-800 transition-colors hover:bg-gray-200"
                            onClick={() => handleSearchItemClick(search)}
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No recent searches</p>
                    )}
                  </div>

                  {/* Trending searches */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-500 flex items-center">
                      <TrendingUpIcon className="h-4 w-4 mr-2" /> Trending now
                    </h3>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {trendingItems.map((item) => (
                        <button
                          key={item.id}
                          className="flex items-center justify-between rounded-md p-2 text-left transition-colors hover:bg-gray-50"
                          onClick={() => handleSearchItemClick(item.name)}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{item.name}</span>
                          </div>
                          <span className="text-xs text-gray-500">{item.category}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SearchProducts;
