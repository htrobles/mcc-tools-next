'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { getImportJobProgress } from '../getImportJobProgress';
import { ProductImportJob } from '@prisma/client';

type ProductImportJobProgress = {
  processedProducts: number;
  failedProducts: number;
  totalProducts: number;
  isCompleted: boolean;
};

export type ProductImportDetails = ProductImportJobProgress & {
  completedAt: Date | null;
  loading: boolean;
};

export const PriceMonitorProductImportDetailsContext =
  createContext<ProductImportDetails>({
    processedProducts: 0,
    failedProducts: 0,
    totalProducts: 0,
    isCompleted: false,
    completedAt: null,
    loading: true,
  });

export const PriceMonitorProductImportDetailsContextProvider = ({
  children,
  job,
}: {
  children: React.ReactNode;
  job: ProductImportJob;
}) => {
  const [details, setDetails] = useState<ProductImportDetails>({
    processedProducts: job.processedProducts || 0,
    failedProducts: job.failedProducts || 0,
    totalProducts: job.totalProducts || 0,
    isCompleted: job.completedAt ? true : false,
    completedAt: job.completedAt || null,
    loading: true,
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleUpdateProgress = useCallback(async () => {
    const data = await getImportJobProgress(job.id);

    setDetails((prevDetails) => {
      const newDetails = { ...prevDetails, ...data };

      if (data.completedAt) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current as NodeJS.Timeout);
          intervalRef.current = null;
        }
      }

      newDetails.loading = false;
      return newDetails;
    });
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
  }, [job.id, job.completedAt, handleUpdateProgress]);

  return (
    <PriceMonitorProductImportDetailsContext.Provider value={details}>
      {children}
    </PriceMonitorProductImportDetailsContext.Provider>
  );
};

export const usePriceMonitorProductImportDetails = () => {
  const context = useContext(PriceMonitorProductImportDetailsContext);

  if (!context) {
    throw new Error(
      'usePriceMonitorProductImportDetails must be used within a PriceMonitorProductImportDetailsContextProvider'
    );
  }

  return context;
};
