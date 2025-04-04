import { useId, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import axios from "axios"

import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import FilterBar, { FilterValues } from "./filter-bar"
import { PlusCircle } from "lucide-react"
import { ProductSheet } from "./product-sheet"

// Enhanced Product interface with more properties
interface Product {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  quantity: number;
  status: string;
  is_active: boolean;
  is_featured: boolean;
  category?: string;
  category_id?: number;
  slug: string;
  sku: string;
  cover_image?: string;
  colors?: string[];
  sizes?: string[];
  type?: string;
  created_at?: string;
  updated_at?: string;
}

// Pagination interface to match Laravel's pagination structure
interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  links: {
    next: string | null;
    prev: string | null;
  };
  from: number;
  to: number;
}

interface Category {
  id: number | string;
  name: string;
}

export default function ProductsTable() {
  const id = useId()
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState<FilterValues>({
    search: "",
    category: null,
    status: null,
    featured: null,
    priceRange: null,
  });
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  // Fetch categories for the filter dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // In a real application, you'd fetch this from your API
        // const response = await axios.get<Category[]>('/api/categories');
        // setCategories(response.data);

        // For now, let's use some dummy data
        setCategories([
          { id: 1, name: 'Electronics' },
          { id: 2, name: 'Clothing' },
          { id: 3, name: 'Home & Kitchen' },
          { id: 4, name: 'Books' },
          { id: 5, name: 'Toys' },
        ]);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      // Build query parameters for filtering
      const params = new URLSearchParams();

      if (filters.search) {
        params.append('search', filters.search);
      }

      if (filters.category) {
        params.append('category_id', filters.category);
      }

      if (filters.status) {
        params.append('active', filters.status === 'active' ? 'true' : 'false');
      }

      if (filters.featured) {
        params.append('featured', filters.featured);
      }

      if (filters.priceRange?.min) {
        params.append('min_price', filters.priceRange.min);
      }

      if (filters.priceRange?.max) {
        params.append('max_price', filters.priceRange.max);
      }

      const queryString = params.toString();
      const url = `/api/products${queryString ? `?${queryString}` : ''}`;

      const response = await axios.get<PaginatedResponse<Product>>(url);

      // Check if the response has a data property (paginated response)
      if (response.data && Array.isArray(response.data.data)) {
        setProducts(response.data.data);
      } else if (Array.isArray(response.data)) {
        // Fallback for non-paginated response
        setProducts(response.data);
      } else {
        setProducts([]);
        setError('Unexpected API response format');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]); // Re-fetch when filters change

  // Handle filter changes from the FilterBar component
  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
  };

  // Calculate total price of all products, ensuring products is an array
  const totalPrice = Array.isArray(products) && products.length > 0
    ? products.reduce((sum, product) => sum + (product.price || 0), 0).toFixed(2)
    : '0.00';

  return (
    <div className="flex flex-col mt-6 justify-start items-start w-full">
      <div className="flex w-full items-center justify-between mb-6">
        <FilterBar
          onFilterChange={handleFilterChange}
          categories={categories}
        />

        <Button
          onClick={() => setIsAddProductOpen(true)}
          className="ml-auto"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="bg-background w-full overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-11">
                <Checkbox id={id} />
              </TableHead>
              <TableHead className="h-11">SKU</TableHead>
              <TableHead className="h-11">Name</TableHead>
              <TableHead className="h-11">Description</TableHead>
              <TableHead className="h-11">Category</TableHead>
              <TableHead className="h-11">Status</TableHead>
              <TableHead className="h-11">Featured</TableHead>
              <TableHead className="h-11 text-right">Price</TableHead>
              <TableHead className="h-11 text-right">Stock</TableHead>
              <TableHead className="h-11 text-right">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading skeleton with additional cells
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-5 w-12 ml-auto" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-5 w-24 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : error ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center text-red-500">{error}</TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center">No products found</TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Checkbox id={`table-checkbox-${product.id}`} />
                  </TableCell>
                  <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.description?.slice(0, 50)}{product.description?.length ?? 0 > 50 ? '...' : ''}</TableCell>
                  <TableCell>{product.category || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={product.status === 'active' ? 'success' : 'secondary'} className="capitalize">
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {product.is_featured && (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                        Featured
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <span className={product.stock <= 5 ? 'text-red-600 font-medium' : ''}>
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {new Date(product.created_at!).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          <TableFooter className="bg-transparent">
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={7}>Total</TableCell>
              <TableCell className="text-right">${totalPrice}</TableCell>
              <TableCell colSpan={2}></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      {/* Add Product Sheet */}
      <ProductSheet
        isOpen={isAddProductOpen}
        onOpenChange={setIsAddProductOpen}
        onSuccess={fetchProducts}
        categories={categories}
      />
    </div>
  )
}
