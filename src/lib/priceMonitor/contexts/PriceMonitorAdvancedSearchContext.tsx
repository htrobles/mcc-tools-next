'use client';

import getProductBrabds from '@/lib/getProductBrands';
import getProductCategories from '@/lib/getProductCategories';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

type ProductMonitorAdvancedSearchContextType = {
  showAdvancedSearch: boolean;
  handleToggleAdvancedSearch: () => void;
  brands: string[];
  categories: string[];
  loading: boolean;
};

export const ProductMonitorAdvancedSearchContext =
  createContext<ProductMonitorAdvancedSearchContextType | null>(null);

export default function ProductMonitorAdvancedSearchContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const handleToggleAdvancedSearch = () => {
    setShowAdvancedSearch(!showAdvancedSearch);
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
        handleToggleAdvancedSearch,
        brands,
        categories,
        loading,
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
