import PageContainer from '@/components/PageContainer';
import ProductImportJobsTable from '@/components/priceMonitor/ProductImportJobsTable';
import { ProductImportJobsPagination } from '@/components/priceMonitor/ProductImportJobsPagination';
import { getProductImportJobs } from '@/lib/priceMonitor/getProductImportJobs';
import PriceMonitorProductHeader from '@/components/priceMonitor/PriceMonitorProductHeader';
import PriceMonitorAddDropdown from '@/components/priceMonitor/PriceMonitorAddDropdown';

export default async function ProductImportsPage({
  searchParams,
}: {
  searchParams: Promise<{ page: string }>;
}) {
  const { page } = await searchParams;
  const pageNumber = parseInt(page || '1');
  const pageSize = 20;

  const { jobs, total } = await getProductImportJobs(pageNumber, pageSize);
  const totalPages = Math.ceil(total / pageSize);

  return (
    <PageContainer>
      <div className="space-y-4">
        <div>
          <PriceMonitorProductHeader title="Product Import Jobs" />
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">
              View the status and details of product import jobs.
            </p>
            <PriceMonitorAddDropdown label="Import Products" />
          </div>
        </div>

        <ProductImportJobsTable jobs={jobs} />

        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {(pageNumber - 1) * pageSize + 1} to{' '}
              {Math.min(pageNumber * pageSize, total)} of {total} results
            </div>
            <ProductImportJobsPagination
              currentPage={pageNumber}
              totalPages={totalPages}
            />
          </div>
        )}
      </div>
    </PageContainer>
  );
}
