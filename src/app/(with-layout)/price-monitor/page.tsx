import PageContainer from '@/components/PageContainer';
import { PriceMonitorPagination } from '@/components/priceMonitor/PriceMonitorPagination';
import { PRICE_MONITOR_PAGE_SIZE } from '@/lib/priceMonitor/constants';
import { getPriceMonitorProducts } from '@/lib/priceMonitor/getPriceMonitorProducts';
import PriceMonitorClient from '@/components/priceMonitor/PriceMonitorClient';
import PriceMonitorHeader from '@/components/priceMonitor/PriceMonitorHeader';
import ProductMonitorAdvancedSearchContextProvider from '@/lib/priceMonitor/contexts/PriceMonitorAdvancedSearchContext';

export default async function PriceMonitor({
  searchParams,
}: {
  searchParams: Promise<{
    page: string;
    search?: string;
    brand?: string;
    category?: string;
  }>;
}) {
  const { page, search, brand, category } = await searchParams;
  const pageNumber = parseInt(page || '1');

  const { products, total, totalPages } = await getPriceMonitorProducts({
    page: pageNumber,
    search,
    brand,
    category,
  });

  // Calculate display range
  const startItem = (pageNumber - 1) * PRICE_MONITOR_PAGE_SIZE + 1;
  const endItem = Math.min(pageNumber * PRICE_MONITOR_PAGE_SIZE, total);

  return (
    <PageContainer>
      <ProductMonitorAdvancedSearchContextProvider>
        <div className="space-y-4">
          <PriceMonitorHeader />
          <PriceMonitorClient products={products} search={search} />

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {startItem} to {endItem} of {total} results
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
