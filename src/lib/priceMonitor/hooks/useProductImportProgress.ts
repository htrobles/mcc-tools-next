import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { ImportJobStatus, ProductImportJob } from '@prisma/client';

// Connect to our local WebSocket server
const socket = io(process.env.NEXTAUTH_URL || 'http://localhost:3000');

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

    const handleProgress = (
      data: ProductImportJobProgress & { error?: string }
    ) => {
      if (data && typeof data.error === 'string') {
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
      socket.off(`import-job-${job.id}`, handleProgress);
      setLoading(false);
    };
  }, [job]);

  return { progress, status, error, loading };
}
