import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ImportJobStatus, ProductImportJob } from '@prisma/client';

const socket = io(process.env.NEXT_PUBLIC_MONITOR_PRICE_APP_HOST);

type ProductImportJobProgress = {
  processedProducts: number;
  failedProducts: number;
  totalProducts: number;
};
export function useProductImportProgress(job: ProductImportJob) {
  const [progress, setProgress] = useState<ProductImportJobProgress>({
    processedProducts: 0,
    failedProducts: 0,
    totalProducts: 0,
  });
  const [status, setStatus] = useState<ImportJobStatus>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!job) return;

    setLoading(true);

    if (job.status !== ImportJobStatus.PENDING) {
      setStatus(job.status);
      setProgress({
        processedProducts: job.processedProducts ?? 0,
        failedProducts: job.failedProducts ?? 0,
        totalProducts: job.totalProducts ?? 0,
      });
      setLoading(false);
      return;
    }

    // Handler for progress updates
    const handleProgress = (data: any) => {
      if (data?.error) {
        setError(data.error);
        setStatus(ImportJobStatus.ERROR);
      } else {
        setProgress({
          processedProducts: data.processedProducts ?? 0,
          failedProducts: data.failedProducts ?? 0,
          totalProducts: data.totalProducts ?? 0,
        });
        setStatus(ImportJobStatus.PENDING);
        setError(null);
        setLoading(false);
      }
    };

    socket.emit('join-import-job', job.id);
    socket.on(`import-job-${job.id}`, handleProgress);

    return () => {
      socket.off('import-job-progress', handleProgress);
      setLoading(false);
    };
  }, [job.id]);

  return { progress, status, error, loading };
}
