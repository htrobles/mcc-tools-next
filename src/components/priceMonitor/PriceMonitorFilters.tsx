'use client';

import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  usePriceMonitorFilterActions,
  usePriceMonitorFilters,
} from '@/lib/priceMonitor/contexts/PriceMonitorSearchContext';
import PriceMonitorSearch from './PriceMonitorSearch';
import PriceMonitorBrandSelector from './PriceMonitorBrandSelector';
import PriceMonitorCategorySelector from './PriceMonitorCategorySelector';

interface PriceMonitorFiltersProps {
  showClearButton?: boolean;
  className?: string;
}

const PriceMonitorFilters = ({
  showClearButton = true,
  className = '',
}: PriceMonitorFiltersProps) => {
  const { filters, hasActiveFilters } = usePriceMonitorFilters();
  const { handleCompetitorPricesToggle, handleClearSearch, handleSearch } =
    usePriceMonitorFilterActions();

  return (
    <div className={`space-y-4 ${className}`}>
      <form onSubmit={handleSearch} className="space-y-2">
        <div className="flex gap-2 items-center">
          <div className="flex-1">
            <PriceMonitorSearch className="w-full" />
          </div>
          <PriceMonitorBrandSelector />
          <PriceMonitorCategorySelector />
          <Button type="submit" className="space-x-2">
            <Search size={14} /> <span>Search</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleClearSearch}
            disabled={!hasActiveFilters}
          >
            Clear
          </Button>
        </div>
        <div className="flex gap-x-2">
          <div className="flex items-center gap-x-2">
            <Switch
              checked={filters.withCompetitorPricesOnly}
              onCheckedChange={handleCompetitorPricesToggle}
            />
            <span className="text-sm text-muted-foreground">
              With competitor prices only
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PriceMonitorFilters;
