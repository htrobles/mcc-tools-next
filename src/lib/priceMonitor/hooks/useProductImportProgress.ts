import { useEffect, useState } from 'react';
import { ImportJobStatus, ProductImportJob } from '@prisma/client';

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

    // Use Server-Sent Events instead of WebSocket
    const eventSource = new EventSource(`/api/jobs/${job.id}/progress`);

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);

        if (data.error) {
          setError(data.error);
          setStatus(ImportJobStatus.ERROR);
          eventSource.close();
        } else {
          setProgress({
            processedProducts: data.processedProducts ?? 0,
            failedProducts: data.failedProducts ?? 0,
            totalProducts: data.totalProducts ?? 0,
          });
          setStatus(data.status || ImportJobStatus.PENDING);
          setError(null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error parsing SSE data:', error);
        setError('Failed to parse progress data');
        setStatus(ImportJobStatus.ERROR);
        eventSource.close();
      }
    };

    const handleError = (event: Event) => {
      console.error('SSE error:', event);
      setError('Connection error');
      setStatus(ImportJobStatus.ERROR);
      setLoading(false);
      eventSource.close();
    };

    eventSource.addEventListener('message', handleMessage);
    eventSource.addEventListener('error', handleError);

    return () => {
      eventSource.removeEventListener('message', handleMessage);
      eventSource.removeEventListener('error', handleError);
      eventSource.close();
      setLoading(false);
    };
  }, [job]);

  return { progress, status, error, loading };
}
