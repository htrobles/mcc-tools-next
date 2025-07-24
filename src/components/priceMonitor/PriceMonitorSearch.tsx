'use client';

import { Input } from '../ui/input';
import {
  usePriceMonitorFilterActions,
  usePriceMonitorFilters,
} from '@/lib/priceMonitor/contexts/PriceMonitorSearchContext';

const PriceMonitorSearch = () => {
  const { filters } = usePriceMonitorFilters();
  const { setSearch } = usePriceMonitorFilterActions();

  return (
    <Input
      name="search"
      placeholder="Search product title or SKU..."
      className="w-96"
      value={filters.search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
};

export default PriceMonitorSearch;
