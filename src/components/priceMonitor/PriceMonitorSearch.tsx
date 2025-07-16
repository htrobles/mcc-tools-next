'use client';

import { Input } from '../ui/input';
import { usePriceMonitorSearch } from '@/lib/priceMonitor/contexts/PriceMonitorSearchContext';

const PriceMonitorSearch = () => {
  const { search, setSearch, handleSearch } = usePriceMonitorSearch();

  return (
    <Input
      name="search"
      placeholder="Search product title or SKU..."
      className="w-52"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
};

export default PriceMonitorSearch;
