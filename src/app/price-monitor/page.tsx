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
import db from '@/lib/db';
import { PRICE_MONITOR_PAGE_SIZE } from '@/lib/priceMonitor/constants';
import { getPriceMonitorProducts } from '@/lib/priceMonitor/getPriceMonitorProducts';

export default async function PriceMonitor({
  searchParams,
}: {
  searchParams: Promise<{ page: string }>;
}) {
  const { page } = await searchParams;
  const pageNumber = parseInt(page || '1');

  const { products, total } = await getPriceMonitorProducts(pageNumber);
  const totalPages = Math.ceil(total / PRICE_MONITOR_PAGE_SIZE);

  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="border rounded bg-white">
          <Table>
            <TableCaption>
              A list of products that are being monitored.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
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
