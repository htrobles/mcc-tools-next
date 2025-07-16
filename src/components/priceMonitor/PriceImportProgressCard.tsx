'use client';

import { useProductImportProgress } from '@/lib/priceMonitor/hooks/useProductImportProgress';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { Skeleton } from '../ui/skeleton';
import { ProductImportJob } from '@prisma/client';

const calculateProgress = (
  totalProducts: number,
  processedProducts: number
) => {
  if (!totalProducts || totalProducts === 0) return 0;
  return Math.round(((processedProducts || 0) / totalProducts) * 100);
};

const PriceImportProgressCard = ({ job }: { job: ProductImportJob }) => {
  const { progress, loading } = useProductImportProgress(job);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-48 mb-2" />
          <Skeleton className="h-3 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>

          <Separator />

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <Skeleton className="h-8 w-12 mx-auto mb-1" />
              <Skeleton className="h-3 w-20 mx-auto" />
            </div>
            <div>
              <Skeleton className="h-8 w-12 mx-auto mb-1" />
              <Skeleton className="h-3 w-16 mx-auto" />
            </div>
            <div>
              <Skeleton className="h-8 w-12 mx-auto mb-1" />
              <Skeleton className="h-3 w-12 mx-auto" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing Progress</CardTitle>
        <CardDescription>Current progress of the import job</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>
              {calculateProgress(
                progress.totalProducts,
                progress.processedProducts + progress.failedProducts
              )}
              %
            </span>
          </div>
          <Progress
            value={calculateProgress(
              progress.totalProducts,
              progress.processedProducts + progress.failedProducts
            )}
            className="h-2"
          />
        </div>

        <Separator />

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {progress.totalProducts || 0}
            </p>
            <p className="text-xs text-muted-foreground">Total Products</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {progress.processedProducts || 0}
            </p>
            <p className="text-xs text-muted-foreground">Processed</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600">
              {progress.failedProducts || 0}
            </p>
            <p className="text-xs text-muted-foreground">Failed</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceImportProgressCard;
