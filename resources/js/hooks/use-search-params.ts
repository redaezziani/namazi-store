import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export function useSearchParams() {
  const { url } = usePage();
  const [searchParams, setSearchParams] = useState<URLSearchParams>(
    new URLSearchParams(window.location.search)
  );

  useEffect(() => {
    // Update search params when URL changes
    setSearchParams(new URLSearchParams(window.location.search));
  }, [url]);

  return { searchParams };
}
