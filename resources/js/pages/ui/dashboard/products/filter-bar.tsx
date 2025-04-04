import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FilterIcon, Search, SlidersHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import React, { useState } from 'react';

export interface FilterValues {
  search: string;
  category: string | null;
  status: string | null;
  featured: string | null;
  priceRange: { min: string; max: string } | null;
}

interface FilterBarProps {
  onFilterChange: (filters: FilterValues) => void;
  categories: { id: string | number; name: string }[];
}

export default function FilterBar({ onFilterChange, categories }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterValues>({
    search: '',
    category: null,
    status: null,
    featured: null,
    priceRange: null,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedFilters = {
      ...filters,
      search: e.target.value,
    };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleCategoryChange = (value: string) => {
    const updatedFilters = {
      ...filters,
      category: value === 'all' ? null : value,
    };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleStatusChange = (value: string) => {
    const updatedFilters = {
      ...filters,
      status: value === 'all' ? null : value,
    };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleFeaturedChange = (value: string) => {
    const updatedFilters = {
      ...filters,
      featured: value === 'all' ? null : value,
    };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      search: '',
      category: null,
      status: null,
      featured: null,
      priceRange: null,
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  // Calculate active filters count for the badge
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.status) count++;
    if (filters.featured) count++;
    if (filters.priceRange) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className=" w-full space-y-4">
      <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div className="relative w-full max-w-md">
          <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input
            placeholder="Search products..."
            className="pl-9"
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>

        <div className="flex items-center gap-2 self-end">
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="h-9 px-2 text-xs"
            >
              Clear filters
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9">
                <FilterIcon className="mr-2 h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-2 h-5 min-w-5 px-1 flex items-center justify-center"
                  >
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <span>Category</span>
                    {filters.category && (
                      <Badge variant="outline" className="ml-auto">1</Badge>
                    )}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="max-h-60 overflow-y-auto">
                      <DropdownMenuItem onClick={() => handleCategoryChange('all')}>
                        <span>All Categories</span>
                        {!filters.category && <CheckIcon className="ml-auto h-4 w-4" />}
                      </DropdownMenuItem>
                      {categories.map((category) => (
                        <DropdownMenuItem
                          key={category.id}
                          onClick={() => handleCategoryChange(category.id.toString())}
                        >
                          <span>{category.name}</span>
                          {filters.category === category.id.toString() &&
                            <CheckIcon className="ml-auto h-4 w-4" />
                          }
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <span>Status</span>
                    {filters.status && (
                      <Badge variant="outline" className="ml-auto">1</Badge>
                    )}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => handleStatusChange('all')}>
                        <span>All Status</span>
                        {!filters.status && <CheckIcon className="ml-auto h-4 w-4" />}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange('active')}>
                        <span>Active</span>
                        {filters.status === 'active' && <CheckIcon className="ml-auto h-4 w-4" />}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange('inactive')}>
                        <span>Inactive</span>
                        {filters.status === 'inactive' && <CheckIcon className="ml-auto h-4 w-4" />}
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <span>Featured</span>
                    {filters.featured && (
                      <Badge variant="outline" className="ml-auto">1</Badge>
                    )}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => handleFeaturedChange('all')}>
                        <span>All Products</span>
                        {!filters.featured && <CheckIcon className="ml-auto h-4 w-4" />}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleFeaturedChange('true')}>
                        <span>Featured Only</span>
                        {filters.featured === 'true' && <CheckIcon className="ml-auto h-4 w-4" />}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleFeaturedChange('false')}>
                        <span>Not Featured</span>
                        {filters.featured === 'false' && <CheckIcon className="ml-auto h-4 w-4" />}
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={handleResetFilters} className="text-destructive focus:text-destructive">
                Reset All Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

// Helper Check Icon Component
function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
