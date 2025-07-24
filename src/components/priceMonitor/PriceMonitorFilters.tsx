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
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="space-y-2 w-full">
          <div className="flex justify-between items-center">
            <div className="flex gap-x-2 flex-wrap">
              <PriceMonitorSearch />
              <PriceMonitorBrandSelector />
              <PriceMonitorCategorySelector />
              <Button type="submit" className="space-x-2">
                <Search size={14} /> <span>Search</span>
              </Button>

              {showClearButton && hasActiveFilters && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClearSearch}
                >
                  Clear
                </Button>
              )}
            </div>
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
        </div>
      </form>
    </div>
  );
};

export default PriceMonitorFilters;
