import PageContainer from '@/components/PageContainer';
import PriceMonitorTableRow from '@/components/priceMonitor/PriceMonitorTableRow';
import { PriceMonitorPagination } from '@/components/priceMonitor/PriceMonitorPagination';
import {
  Table,
  TableCaption,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PRICE_MONITOR_PAGE_SIZE } from '@/lib/priceMonitor/constants';
import { getPriceMonitorProducts } from '@/lib/priceMonitor/getPriceMonitorProducts';
import PriceMonitorSearch from '@/components/priceMonitor/PriceMonitorSearch';
import PriceMonitorAddDropdown from '@/components/priceMonitor/PriceMonitorAddDropdown';

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
        <div className="border rounded bg-white">
          <Table>
            <TableCaption>
              A list of products that are being monitored.
              {search && (
                <span className="block text-sm text-muted-foreground mt-1">
                  Showing results for: "{search}"
                </span>
              )}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Last Checked</TableHead>
                <TableHead>Our Price</TableHead>
                <TableHead>Long and McQuade Price</TableHead>
                <TableHead>RedOne Music Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <PriceMonitorTableRow key={product.id} product={product} />
              ))}
            </TableBody>
          </Table>
        </div>

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
