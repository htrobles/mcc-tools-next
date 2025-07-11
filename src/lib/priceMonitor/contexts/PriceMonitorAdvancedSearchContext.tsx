'use client';

import getProductBrabds from '@/lib/getProductBrands';
import getProductCategories from '@/lib/getProductCategories';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

type ProductMonitorAdvancedSearchContextType = {
  showAdvancedSearch: boolean;
  search: string;
  brands: string[];
  categories: string[];
  loading: boolean;
  selectedBrand?: string;
  selectedCategory?: string;
  handleToggleAdvancedSearch: () => void;
  setSearch: (search: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  handleClearSearch: () => void;
  setSelectedBrand: (brand: string) => void;
  setSelectedCategory: (category: string) => void;
};

export const ProductMonitorAdvancedSearchContext =
  createContext<ProductMonitorAdvancedSearchContextType | null>(null);

export default function ProductMonitorAdvancedSearchContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [showAdvancedSearch, setShowAdvancedSearch] = useState(
    !!searchParams.size
  );
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState<string>();
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);

    if (search.trim()) {
      params.set('search', search.trim());
    } else {
      params.delete('search');
    }

    if (selectedBrand) {
      params.set('brand', selectedBrand);
    } else {
      params.delete('brand');
    }

    if (selectedCategory) {
      params.set('category', selectedCategory);
    } else {
      params.delete('category');
    }

    // Reset to page 1 when searching
    params.delete('page');

    router.push(`/price-monitor?${params.toString()}`);
  };

  const handleClearSearch = () => {
    setSearch('');
    const params = new URLSearchParams(searchParams);
    params.delete('search');
    params.delete('page');
    params.delete('brand');
    params.delete('category');
    router.push(`/price-monitor?${params.toString()}`);
  };

  const handleToggleAdvancedSearch = () => {
    setShowAdvancedSearch(!showAdvancedSearch);
    if (!showAdvancedSearch) {
      setSelectedBrand(undefined);
      setSelectedCategory(undefined);
    }
  };

  const initiate = async () => {
    const brandsData = await getProductBrabds();
    const categoriesData = await getProductCategories();

    setBrands(brandsData);
    setCategories(categoriesData);
    setLoading(false);
  };

  useEffect(() => {
    initiate();
  }, []);

  return (
    <ProductMonitorAdvancedSearchContext.Provider
      value={{
        showAdvancedSearch,
        brands,
        categories,
        loading,
        search,
        selectedBrand,
        selectedCategory,
        handleToggleAdvancedSearch,
        setSearch,
        handleSearch,
        handleClearSearch,
        setSelectedBrand,
        setSelectedCategory,
      }}
    >
      {children}
    </ProductMonitorAdvancedSearchContext.Provider>
  );
}

export function usePriceMonitorAdvancedSearch() {
  const context = useContext(ProductMonitorAdvancedSearchContext);

  if (!context) {
    throw new Error(
      'usePriceMonitorAdvancedSearch must be used within a ProductMonitorAdvancedSearchContextProvider'
    );
  }

  return context;
}
