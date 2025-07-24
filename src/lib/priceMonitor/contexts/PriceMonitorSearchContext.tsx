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
  useCallback,
  useMemo,
} from 'react';

export interface PriceMonitorFilters {
  search: string;
  brand?: string;
  category?: string;
  withCompetitorPricesOnly: boolean;
}

export interface PriceMonitorSearchState {
  filters: PriceMonitorFilters;
  brands: string[];
  categories: string[];
  loading: boolean;
  hasActiveFilters: boolean;
  selectedProducts: string[];
}

export interface PriceMonitorSearchActions {
  setSearch: (search: string) => void;
  setBrand: (brand: string) => void;
  setCategory: (category: string) => void;
  setWithCompetitorPricesOnly: (enabled: boolean) => void;
  handleSearch: (e: React.FormEvent) => void;
  handleClearSearch: () => void;
  handleCompetitorPricesToggle: (checked: boolean) => void;
  updateFilters: (filters: Partial<PriceMonitorFilters>) => void;
  setSelectedProducts: (products: string[]) => void;
}

type PriceMonitorSearchContextType = PriceMonitorSearchState &
  PriceMonitorSearchActions;

export const PriceMonitorSearchContext =
  createContext<PriceMonitorSearchContextType | null>(null);

export default function PriceMonitorSearchContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // State
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  // Filters state
  const [filters, setFilters] = useState<PriceMonitorFilters>({
    search: searchParams.get('search') || '',
    brand: searchParams.get('brand') || undefined,
    category: searchParams.get('category') || undefined,
    withCompetitorPricesOnly:
      searchParams.get('withCompetitorPricesOnly') === 'true',
  });

  // Computed values
  const hasActiveFilters = useMemo(() => {
    return !!(
      filters.search.trim() ||
      filters.brand ||
      filters.category ||
      filters.withCompetitorPricesOnly
    );
  }, [filters]);

  // Memoized state object
  const searchState = useMemo<PriceMonitorSearchState>(
    () => ({
      filters,
      brands,
      categories,
      loading,
      hasActiveFilters,
      selectedProducts,
    }),
    [filters, brands, categories, loading, hasActiveFilters, selectedProducts]
  );

  // URL update function
  const updateSearchParams = useCallback(
    (newFilters?: Partial<PriceMonitorFilters>) => {
      const params = new URLSearchParams(searchParams);
      const updatedFilters = { ...filters, ...newFilters };

      // Update search param
      if (updatedFilters.search.trim()) {
        params.set('search', updatedFilters.search.trim());
      } else {
        params.delete('search');
      }

      // Update brand param
      if (updatedFilters.brand) {
        params.set('brand', updatedFilters.brand);
      } else {
        params.delete('brand');
      }

      // Update category param
      if (updatedFilters.category) {
        params.set('category', updatedFilters.category);
      } else {
        params.delete('category');
      }

      // Update competitor prices param
      if (updatedFilters.withCompetitorPricesOnly) {
        params.set('withCompetitorPricesOnly', 'true');
      } else {
        params.delete('withCompetitorPricesOnly');
      }

      // Reset to page 1 when filters change
      params.delete('page');

      router.push(`/price-monitor?${params.toString()}`);
    },
    [filters, searchParams, router]
  );

  // Filter setters
  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  const setBrand = useCallback((brand: string) => {
    setFilters((prev) => ({ ...prev, brand: brand || undefined }));
  }, []);

  const setCategory = useCallback((category: string) => {
    setFilters((prev) => ({ ...prev, category: category || undefined }));
  }, []);

  const setWithCompetitorPricesOnly = useCallback((enabled: boolean) => {
    setFilters((prev) => ({ ...prev, withCompetitorPricesOnly: enabled }));
  }, []);

  // Action handlers
  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      updateSearchParams();
    },
    [updateSearchParams]
  );

  const handleCompetitorPricesToggle = useCallback(
    (checked: boolean) => {
      setWithCompetitorPricesOnly(checked);
      updateSearchParams({ withCompetitorPricesOnly: checked });
    },
    [setWithCompetitorPricesOnly, updateSearchParams]
  );

  const handleClearSearch = useCallback(() => {
    const clearedFilters: PriceMonitorFilters = {
      search: '',
      brand: undefined,
      category: undefined,
      withCompetitorPricesOnly: false,
    };

    setFilters(clearedFilters);

    const params = new URLSearchParams(searchParams);
    params.delete('search');
    params.delete('brand');
    params.delete('category');
    params.delete('withCompetitorPricesOnly');
    params.delete('page');

    router.push(`/price-monitor?${params.toString()}`);
  }, [searchParams, router]);

  const updateFilters = useCallback(
    (newFilters: Partial<PriceMonitorFilters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
      updateSearchParams(newFilters);
    },
    [updateSearchParams]
  );

  // Memoized actions object
  const searchActions = useMemo<PriceMonitorSearchActions>(
    () => ({
      setSearch,
      setBrand,
      setCategory,
      setWithCompetitorPricesOnly,
      handleSearch,
      handleClearSearch,
      handleCompetitorPricesToggle,
      updateFilters,
      setSelectedProducts,
    }),
    [
      setSearch,
      setBrand,
      setCategory,
      setWithCompetitorPricesOnly,
      handleSearch,
      handleClearSearch,
      handleCompetitorPricesToggle,
      updateFilters,
      setSelectedProducts,
    ]
  );

  // Data fetching
  const initiate = useCallback(async () => {
    try {
      setLoading(true);
      const [brandsData, categoriesData] = await Promise.all([
        getProductBrabds(),
        getProductCategories(),
      ]);

      setBrands(brandsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load filter data:', error);
      // You might want to add error state handling here
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initiate();
  }, [initiate]);

  // Context value
  const contextValue = useMemo<PriceMonitorSearchContextType>(
    () => ({
      ...searchState,
      ...searchActions,
    }),
    [searchState, searchActions]
  );

  return (
    <PriceMonitorSearchContext.Provider value={contextValue}>
      {children}
    </PriceMonitorSearchContext.Provider>
  );
}

export function usePriceMonitorSearch() {
  const context = useContext(PriceMonitorSearchContext);

  if (!context) {
    throw new Error(
      'usePriceMonitorSearch must be used within a PriceMonitorSearchContextProvider'
    );
  }

  return context;
}

// Convenience hooks for specific filter types
export function usePriceMonitorFilters() {
  const { filters, hasActiveFilters } = usePriceMonitorSearch();
  return { filters, hasActiveFilters };
}

export function usePriceMonitorFilterActions() {
  const {
    setSearch,
    setBrand,
    setCategory,
    setWithCompetitorPricesOnly,
    handleSearch,
    handleClearSearch,
    handleCompetitorPricesToggle,
    updateFilters,
    setSelectedProducts,
  } = usePriceMonitorSearch();

  return {
    setSearch,
    setBrand,
    setCategory,
    setWithCompetitorPricesOnly,
    handleSearch,
    handleClearSearch,
    handleCompetitorPricesToggle,
    updateFilters,
    setSelectedProducts,
  };
}
