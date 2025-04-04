import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SearchIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

// Sample data - replace with actual API calls in production
const recentSearches = ['Summer dress', 'Linen pants', 'Cotton shirt', 'Minimalist jewelry'];
const trendingItems = [
    { id: 1, name: 'Oversized blazer', category: 'Outerwear' },
    { id: 2, name: 'High-waisted jeans', category: 'Bottoms' },
    { id: 3, name: 'Silk blouse', category: 'Tops' },
    { id: 4, name: 'Platform boots', category: 'Footwear' },
    { id: 5, name: 'Structured tote', category: 'Accessories' },
];

const SearchProducts = () => {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Implement search functionality here
        console.log('Searching for:', searchQuery);
        // You would typically navigate to search results page or filter products
    };

    const clearSearch = () => {
        setSearchQuery('');
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
                    <div className="mx-auto mt-6 max-w-2xl">
                        <form onSubmit={handleSearch} className="relative mb-8">
                            <Input
                                type="search"
                                placeholder="Search for products, brands, and more..."
                                className="h-12 pr-10 text-base rounded-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                            />
                            {searchQuery ? (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <XIcon className="h-5 w-5" />
                                </button>
                            ) : (
                                <span className="flex absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-gray-400 items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </span>

                            )}
                        </form>

                        <div className="space-y-8">
                            {searchQuery ? (
                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium text-gray-500">Suggestions</h3>
                                    <div className="space-y-2">
                                        {/* This would be replaced with actual search results */}
                                        {trendingItems
                                            .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                            .map((item) => (
                                                <button
                                                    key={item.id}
                                                    className="flex w-full items-center justify-between rounded-md p-2 transition-colors hover:bg-gray-50"
                                                    onClick={() => {
                                                        setSearchQuery(item.name);
                                                        // handleSearch() would be called here in a real implementation
                                                    }}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <SearchIcon className="h-4 w-4 text-gray-400" />
                                                        <span>{item.name}</span>
                                                    </div>
                                                    <span className="text-xs text-gray-500">{item.category}</span>
                                                </button>
                                            ))}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Recent searches */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-medium text-gray-500">Recent searches</h3>
                                            <Button variant="link" className="h-auto p-0 text-xs text-gray-500">
                                                Clear all
                                            </Button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {recentSearches.map((search, index) => (
                                                <button
                                                    key={index}
                                                    className="rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-800 transition-colors hover:bg-gray-200"
                                                    onClick={() => setSearchQuery(search)}
                                                >
                                                    {search}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Trending searches */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-medium text-gray-500">Trending now</h3>
                                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                            {trendingItems.map((item) => (
                                                <button
                                                    key={item.id}
                                                    className="flex items-center justify-between rounded-md p-2 text-left transition-colors hover:bg-gray-50"
                                                    onClick={() => setSearchQuery(item.name)}
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
                            )}
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default SearchProducts;
