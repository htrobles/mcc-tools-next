'use client';

import Link from 'next/link';
import PriceMonitorAddDropdown from './PriceMonitorAddDropdown';
import PriceMonitorBrandSelector from './PriceMonitorBrandSelector';
import PriceMonitorCategorySelector from './PriceMonitorCategorySelector';
import PriceMonitorSearch from './PriceMonitorSearch';
import { Switch } from '../ui/switch';
import { twMerge } from 'tailwind-merge';
import ProductMonitorAdvancedSearchContextProvider, {
  usePriceMonitorAdvancedSearch,
} from '../../lib/priceMonitor/contexts/PriceMonitorAdvancedSearchContext';
const PriceMonitorHeader = () => {
  const { showAdvancedSearch, handleToggleAdvancedSearch } =
    usePriceMonitorAdvancedSearch();

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex gap-x-2">
          <PriceMonitorSearch />
          <div className="flex items-center gap-x-2">
            <Switch
              checked={showAdvancedSearch}
              onCheckedChange={handleToggleAdvancedSearch}
            />
            Advanced search
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/price-monitor/imports" className="text-sm">
            Product Imports
          </Link>
          <PriceMonitorAddDropdown />
        </div>
      </div>
      <div className={twMerge('flex gap-x-2', !showAdvancedSearch && 'hidden')}>
        <PriceMonitorBrandSelector />
        <PriceMonitorCategorySelector />
      </div>
    </div>
  );
};

export default PriceMonitorHeader;
