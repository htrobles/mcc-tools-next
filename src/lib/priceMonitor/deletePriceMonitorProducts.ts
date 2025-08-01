'use server';

import { getPriceMonitorHeaders } from '../utils';

const HOST = process.env.MONITOR_PRICE_APP_HOST;

export default async function deletePriceMonitorProducts(productIds: string[]) {
  if (!HOST) {
    throw new Error('MONITOR_PRICE_APP_HOST environment variable is not set');
  }

  if (!productIds?.length) {
    throw new Error('No product IDs provided');
  }

  try {
    const response = await fetch(`${HOST}/api/products/bulk-delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getPriceMonitorHeaders(),
      },
      body: JSON.stringify({ productIds }),
    });

    if (!response.ok) {
      const deletePromises = productIds.map(async (productId) => {
        const individualResponse = await fetch(
          `${HOST}/api/products/${productId}`,
          {
            method: 'DELETE',
          }
        );

        if (!individualResponse.ok) {
          const errorText = await individualResponse.text();
          throw new Error(
            `Failed to delete product ${productId}: ${individualResponse.status} ${individualResponse.statusText} - ${errorText}`
          );
        }

        return individualResponse.json();
      });

      const results = await Promise.all(deletePromises);
      return { success: true, deletedCount: productIds.length, results };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error deleting products from price monitor app:', error);
    throw error;
  }
}
