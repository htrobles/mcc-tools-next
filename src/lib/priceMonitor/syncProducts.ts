'use server';

import { getPriceMonitorHeaders } from '../utils';

const HOST = process.env.MONITOR_PRICE_APP_HOST;

export const syncProducts = async () => {
  const response = await fetch(`${HOST}/api/products/sync`, {
    method: 'POST',
    headers: getPriceMonitorHeaders(),
  });

  return response.json();
};
