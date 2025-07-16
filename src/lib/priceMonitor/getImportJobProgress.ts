'use server';

import { getPriceMonitorHeaders } from '../utils';

export const getImportJobProgress = async (jobId: string) => {
  const host = process.env.MONITOR_PRICE_APP_HOST;

  if (!host) {
    throw new Error('MONITOR_PRICE_APP_HOST environment variable is not set');
  }
  const response = await fetch(
    `${host}/api/products/imports/${jobId}/progress`,
    {
      method: 'GET',
      headers: getPriceMonitorHeaders(),
    }
  );

  const data = await response.json();
  return data;
};
