import PageContainer from '@/components/PageContainer';
import PriceImportProgressCard from '@/components/priceMonitor/PriceImportProgressCard';
import PriceMonitorProductHeader from '@/components/priceMonitor/PriceMonitorProductHeader';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import db from '@/lib/db';
import { format } from 'date-fns';
import { notFound } from 'next/navigation';

const JobImportDetailsPage = async ({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) => {
  const { jobId } = await params;

  const job = await db.productImportJob.findUnique({
    where: {
      id: jobId,
    },
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'success';
      case 'ERROR':
        return 'destructive';
      case 'PENDING':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (!job) {
    return notFound();
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <PriceMonitorProductHeader title="Job Import Details" />
          <p className="text-sm text-muted-foreground">Job ID: {job.id}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Job Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Job Overview
                <Badge variant={getStatusBadgeVariant(job.status)}>
                  {job.status}
                </Badge>
              </CardTitle>
              <CardDescription>
                Import job details and current status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Filename
                  </p>
                  <p className="text-sm">{job.filename || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Created
                  </p>
                  <p className="text-sm">
                    {format(new Date(job.createdAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Updated
                  </p>
                  <p className="text-sm">
                    {format(new Date(job.updatedAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Duration
                  </p>
                  <p className="text-sm">
                    {Math.round(
                      (new Date(job.updatedAt).getTime() -
                        new Date(job.createdAt).getTime()) /
                        1000
                    )}
                    s
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Card */}
          <PriceImportProgressCard job={job} />
        </div>

        {/* Error Details */}
        {job.error && (
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Error Details</CardTitle>
              <CardDescription>
                Error encountered during import process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md bg-red-50 p-4 border border-red-200">
                <p className="text-sm text-red-800 whitespace-pre-wrap">
                  {job.error}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Failed Product SKUs */}
        {job.failedProductSkus && job.failedProductSkus.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Failed Product SKUs</CardTitle>
              <CardDescription>
                {job.failedProductSkus.length} products failed to import
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-60 overflow-y-auto">
                <div className="grid gap-2">
                  {job.failedProductSkus.map((sku, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded-md bg-gray-50 border"
                    >
                      <span className="text-sm font-mono">{sku}</span>
                      <Badge variant="outline" className="text-xs">
                        Failed
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageContainer>
  );
};

export default JobImportDetailsPage;
