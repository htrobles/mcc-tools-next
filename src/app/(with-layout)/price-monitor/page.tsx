import PageContainer from '@/components/PageContainer';
import { PriceMonitorPagination } from '@/components/priceMonitor/PriceMonitorPagination';
import { PRICE_MONITOR_PAGE_SIZE } from '@/lib/priceMonitor/constants';
import { getPriceMonitorProducts } from '@/lib/priceMonitor/getPriceMonitorProducts';
import PriceMonitorSearch from '@/components/priceMonitor/PriceMonitorSearch';
import PriceMonitorAddDropdown from '@/components/priceMonitor/PriceMonitorAddDropdown';
import PriceMonitorClient from '@/components/priceMonitor/PriceMonitorClient';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import PriceMonitorBrandSelector from '@/components/priceMonitor/PriceMonitorBrandSelector';
import PriceMonitorCategorySelector from '@/components/priceMonitor/PriceMonitorCategorySelector';
import PriceMonitorHeader from '@/components/priceMonitor/PriceMonitorHeader';
import ProductMonitorAdvancedSearchContextProvider from '@/lib/priceMonitor/contexts/PriceMonitorAdvancedSearchContext';

export default async function PriceMonitor({
  searchParams,
}: {
  searchParams: Promise<{ page: string; search?: string }>;
}) {
  const { page, search } = await searchParams;
  const pageNumber = parseInt(page || '1');

  const { products, total } = await getPriceMonitorProducts(pageNumber, search);
  const totalPages = Math.ceil(total / PRICE_MONITOR_PAGE_SIZE);

  return (
    <PageContainer>
      <ProductMonitorAdvancedSearchContextProvider>
        <div className="space-y-4">
          <PriceMonitorHeader />
          <PriceMonitorClient products={products} search={search} />

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {(pageNumber - 1) * PRICE_MONITOR_PAGE_SIZE + 1} to{' '}
                {Math.min(pageNumber * PRICE_MONITOR_PAGE_SIZE, total)} of{' '}
                {total} results
              </div>
              <PriceMonitorPagination
                currentPage={pageNumber}
                totalPages={totalPages}
              />
            </div>
          )}
        </div>
      </ProductMonitorAdvancedSearchContextProvider>
    </PageContainer>
  );
}
