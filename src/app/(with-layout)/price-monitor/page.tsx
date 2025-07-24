import PageContainer from '@/components/PageContainer';
import { getPriceMonitorProducts } from '@/lib/priceMonitor/getPriceMonitorProducts';
import PriceMonitorClient from '@/components/priceMonitor/PriceMonitorClient';
import PriceMonitorSearchContextProvider from '@/lib/priceMonitor/contexts/PriceMonitorSearchContext';
import PriceMonitorFilters from '@/components/priceMonitor/PriceMonitorFilters';
import PriceMonitorAddDropdown from '@/components/priceMonitor/PriceMonitorAddDropdown';
import PriceMonitorManualSyncBtn from '@/components/priceMonitor/PriceMonitorManualSyncBtn';

export const headerActions = () => (
  <div className="flex gap-2 justify-end">
    <PriceMonitorAddDropdown />
    <PriceMonitorManualSyncBtn />
  </div>
);

export default async function PriceMonitor({
  searchParams,
}: {
  searchParams: Promise<{
    page: string;
    pageSize?: string;
    search?: string;
    brand?: string;
    category?: string;
    withCompetitorPricesOnly?: string;
  }>;
}) {
  const { page, pageSize, search, brand, category, withCompetitorPricesOnly } =
    await searchParams;

  const pageNumber = parseInt(page || '1');
  const pageSizeNumber = pageSize ? parseInt(pageSize) : undefined;

  const { products, total, totalPages } = await getPriceMonitorProducts({
    page: pageNumber,
    pageSize: pageSizeNumber,
    search,
    brand,
    category,
    withCompetitorPricesOnly: withCompetitorPricesOnly === 'true',
  });

  return (
    <PageContainer>
      <PriceMonitorSearchContextProvider>
        <div className="space-y-4">
          <div className="p-2 rounded-md border">
            <PriceMonitorFilters />
          </div>
          <PriceMonitorClient
            products={products}
            search={search}
            currentPage={pageNumber}
            totalPages={totalPages}
            total={total}
            currentPageSize={pageSizeNumber}
          />
        </div>
      </PriceMonitorSearchContextProvider>
    </PageContainer>
  );
}
