import { useEffect, useState, useRef, useCallback } from 'react';
import { ImportJobStatus, ProductImportJob } from '@prisma/client';
import { getImportJobProgress } from '../getImportJobProgress';

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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleUpdateProgress = useCallback(async () => {
    const data = await getImportJobProgress(job.id);

    const { processedProducts, failedProducts, totalProducts } = data;
    setProgress(data);

    if (processedProducts + failedProducts < totalProducts) {
      setStatus(ImportJobStatus.PENDING);
    } else {
      if (failedProducts > 0) {
        setStatus(ImportJobStatus.PARTIAL_SUCCESS);
        setError('Some products failed to import');
      } else {
        setStatus(ImportJobStatus.SUCCESS);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current as NodeJS.Timeout);
        intervalRef.current = null;
      }
    }

    setLoading(false);
  }, [job.id]);

  useEffect(() => {
    handleUpdateProgress();

    intervalRef.current = setInterval(async () => {
      handleUpdateProgress();
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [job.id, handleUpdateProgress]);

  return { progress, status, error, loading };
}
