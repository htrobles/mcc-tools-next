'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../ui/card';
import { Badge } from '../ui/badge';
import { ProductImportJob } from '@prisma/client';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { usePriceMonitorProductImportDetails } from '@/lib/priceMonitor/contexts/PriceMonitorProductImportDetailsContext';
import { Skeleton } from '../ui/skeleton';

const ProductImportOverviewCard = ({ job }: { job: ProductImportJob }) => {
  const { loading, completedAt } = usePriceMonitorProductImportDetails();

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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-48 mb-2" />
          <Skeleton className="h-3 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-2 w-full" />
        </CardContent>
      </Card>
    );
  } else {
    return (
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
                Completed
              </p>
              <p className="text-sm">
                {completedAt
                  ? format(new Date(completedAt), 'MMM dd, yyyy HH:mm')
                  : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Duration
              </p>
              <p className="text-sm">
                {completedAt
                  ? calculateDuration(new Date(completedAt), job.createdAt)
                  : 'Still processing'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
};

const calculateDuration = (completedAt: Date, createdAt: Date) => {
  const diffMs = completedAt.getTime() - createdAt.getTime();
  if (diffMs < 0) return 'N/A';
  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);

  return parts.join(' ');
};

export default ProductImportOverviewCard;
