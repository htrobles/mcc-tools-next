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

type PriceMonitorSearchContextType = {
  search: string;
  brands: string[];
  categories: string[];
  loading: boolean;
  selectedBrand?: string;
  selectedCategory?: string;
  withCompetitorPricesOnly: boolean;
  setSearch: (search: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  handleClearSearch: () => void;
  setSelectedBrand: (brand: string) => void;
  setSelectedCategory: (category: string) => void;
  setWithCompetitorPricesOnly: (withCompetitorPricesOnly: boolean) => void;
};

export const PriceMonitorSearchContext =
  createContext<PriceMonitorSearchContextType | null>(null);

export default function PriceMonitorSearchContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState<string>(
    searchParams.get('brand') || ''
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') || ''
  );
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [withCompetitorPricesOnly, setWithCompetitorPricesOnly] = useState(
    searchParams.get('withCompetitorPricesOnly') === 'true'
  );

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

    if (withCompetitorPricesOnly) {
      params.set('withCompetitorPricesOnly', 'true');
    } else {
      params.delete('withCompetitorPricesOnly');
    }

    // Reset to page 1 when searching
    params.delete('page');

    router.push(`/price-monitor?${params.toString()}`);
  };

  const handleClearSearch = () => {
    setSearch('');
    setSelectedBrand('');
    setSelectedCategory('');
    setWithCompetitorPricesOnly(false);

    const params = new URLSearchParams(searchParams);
    params.delete('search');
    params.delete('page');
    params.delete('brand');
    params.delete('category');
    router.push(`/price-monitor?${params.toString()}`);
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
    <PriceMonitorSearchContext.Provider
      value={{
        brands,
        categories,
        loading,
        search,
        selectedBrand,
        selectedCategory,
        withCompetitorPricesOnly,
        setWithCompetitorPricesOnly,
        setSearch,
        handleSearch,
        handleClearSearch,
        setSelectedBrand,
        setSelectedCategory,
      }}
    >
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
