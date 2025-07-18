'use client';

import Link from 'next/link';
import PriceMonitorAddDropdown from './PriceMonitorAddDropdown';
import PriceMonitorBrandSelector from './PriceMonitorBrandSelector';
import PriceMonitorCategorySelector from './PriceMonitorCategorySelector';
import PriceMonitorSearch from './PriceMonitorSearch';
import { Switch } from '../ui/switch';
import { usePriceMonitorSearch } from '../../lib/priceMonitor/contexts/PriceMonitorSearchContext';
import { Button } from '../ui/button';
import { Search } from 'lucide-react';
const PriceMonitorHeader = () => {
  const {
    withCompetitorPricesOnly,
    setWithCompetitorPricesOnly,
    handleClearSearch,
    handleSearch,
    search,
    selectedBrand,
    selectedCategory,
  } = usePriceMonitorSearch();

  const showClearButton = search || selectedBrand || selectedCategory;

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex gap-x-2">
              <PriceMonitorSearch />
              <PriceMonitorBrandSelector />
              <PriceMonitorCategorySelector />
              <Button type="submit" className="space-x-2">
                <Search size={14} /> <span>Search</span>
              </Button>

              {showClearButton && (
                <Button
                  type="submit"
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
                checked={withCompetitorPricesOnly}
                onCheckedChange={setWithCompetitorPricesOnly}
              />
              With competitor prices only
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PriceMonitorHeader;
