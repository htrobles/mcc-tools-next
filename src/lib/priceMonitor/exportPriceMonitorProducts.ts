'use server';

import { getPriceMonitorHeaders } from '../utils';

const HOST = process.env.MONITOR_PRICE_APP_HOST;

export const exportPriceMonitorProducts = async (
  productIds: string[] | 'all'
) => {
  if (productIds === 'all') {
    console.log('Export all products');
  } else if (productIds.length > 0) {
    console.log('Export selected products');
  } else {
    console.log('No products to export');
  }

  const response = await fetch(`${HOST}/api/products/export`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getPriceMonitorHeaders(),
    },
    body: JSON.stringify({ productIds }),
  });

  if (!response.ok) {
    throw new Error('Failed to export products');
  }

  // Get the CSV string from the response
  const csvString = await response.text();

  return { csvData: csvString, success: true };
};
