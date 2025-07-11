'use client';

import Link from 'next/link';
import PriceMonitorAddDropdown from './PriceMonitorAddDropdown';
import PriceMonitorBrandSelector from './PriceMonitorBrandSelector';
import PriceMonitorCategorySelector from './PriceMonitorCategorySelector';
import PriceMonitorSearch from './PriceMonitorSearch';
import { Switch } from '../ui/switch';
import { usePriceMonitorSearch } from '../../lib/priceMonitor/contexts/PriceMonitorSearchContext';
const PriceMonitorHeader = () => {
  const { withCompetitorPricesOnly, setWithCompetitorPricesOnly } =
    usePriceMonitorSearch();

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex gap-x-2">
          <PriceMonitorSearch />

          <div className="flex items-center gap-x-2">
            <Switch
              checked={withCompetitorPricesOnly}
              onCheckedChange={setWithCompetitorPricesOnly}
            />
            With competitor prices only
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/price-monitor/imports" className="text-sm">
            Product Imports
          </Link>
          <PriceMonitorAddDropdown />
        </div>
      </div>
      <div className="flex gap-x-2">
        <PriceMonitorBrandSelector />
        <PriceMonitorCategorySelector />
      </div>
    </div>
  );
};

export default PriceMonitorHeader;
