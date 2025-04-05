import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from "./card";
import CardsPagination from "./card-pagination";

interface CardGroupProps {
    title?: string;
    description?: string;
    urlQuery?: string;
    itemsPerPage?: number;
}

interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

const CardsGroup = ({ 
    title, 
    description, 
    urlQuery,
    itemsPerPage = 8 
}: CardGroupProps) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  
  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/store/products?page=${page}&per_page=${itemsPerPage}`);
      setProducts(response.data.data);
      setMeta({
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        per_page: response.data.per_page,
        total: response.data.total
      });
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProducts();
  }, [itemsPerPage]);

  const handlePageChange = (page: number) => {
    fetchProducts(page);
    // Scroll to the top of the section
    const element = document.getElementById(urlQuery || 'cards-group');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <section id={urlQuery || 'cards-group'} className="container mx-auto px-4 py-12">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id={urlQuery || 'cards-group'} className="container mx-auto px-4 py-12">
        <div className="text-center text-red-500">{error}</div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section
        aria-label={title || 'Products'}
        id={urlQuery || 'cards-group'}
        className="container mx-auto flex flex-col items-center justify-center gap-3 px-4 py-12"
      >
        <p className="text-gray-500">No products available</p>
      </section>
    );
  }

  return (
    <section
      aria-label={title}
      id={urlQuery || 'cards-group'}
      className="relative container mx-auto flex flex-col items-start mt-6 justify-start gap-4 px-4 py-2"
    >
      {title && (
        <h3 className="group relative inline-block text-2xl tracking-tight text-gray-800">
          {title}
          <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gray-800 transition-all duration-300 group-hover:w-full"></span>
        </h3>
      )}
      
      {description && <p className="text-sm text-gray-500">{description}</p>}
      
      <article className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product, index) => (
          <ProductCard key={product.id || index} product={product} />
        ))}
      </article>
      
      {meta && meta.last_page > 1 && (
        <CardsPagination
          currentPage={meta.current_page}
          totalPages={meta.last_page}
          onPageChange={handlePageChange}
        />
      )}
    </section>
  );
};

export default CardsGroup;
