import PageContainer from '@/components/PageContainer';
import { PriceMonitorPagination } from '@/components/priceMonitor/PriceMonitorPagination';
import { PRICE_MONITOR_PAGE_SIZE } from '@/lib/priceMonitor/constants';
import { getPriceMonitorProducts } from '@/lib/priceMonitor/getPriceMonitorProducts';
import PriceMonitorSearch from '@/components/priceMonitor/PriceMonitorSearch';
import PriceMonitorAddDropdown from '@/components/priceMonitor/PriceMonitorAddDropdown';
import PriceMonitorClient from '@/components/priceMonitor/PriceMonitorClient';

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
      <div className="space-y-4">
        <div className="flex justify-between">
          <PriceMonitorSearch />
          <PriceMonitorAddDropdown />
        </div>

        <PriceMonitorClient products={products} search={search} />

        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {(pageNumber - 1) * PRICE_MONITOR_PAGE_SIZE + 1} to{' '}
              {Math.min(pageNumber * PRICE_MONITOR_PAGE_SIZE, total)} of {total}{' '}
              results
            </div>
            <PriceMonitorPagination
              currentPage={pageNumber}
              totalPages={totalPages}
            />
          </div>
        )}
      </div>
    </PageContainer>
  );
}
