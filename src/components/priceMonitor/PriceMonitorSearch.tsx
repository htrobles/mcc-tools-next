'use client';

import { twMerge } from 'tailwind-merge';
import { Input } from '../ui/input';
import {
  usePriceMonitorFilterActions,
  usePriceMonitorFilters,
} from '@/lib/priceMonitor/contexts/PriceMonitorSearchContext';

const PriceMonitorSearch = ({ className }: { className?: string }) => {
  const { filters } = usePriceMonitorFilters();
  const { setSearch } = usePriceMonitorFilterActions();

  return (
    <Input
      name="search"
      placeholder="Search product title or SKU..."
      className={twMerge('', className)}
      value={filters.search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
};

export default PriceMonitorSearch;
