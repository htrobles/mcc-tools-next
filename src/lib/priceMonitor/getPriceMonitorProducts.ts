'use server';

import { PriceMonitorProduct } from './getPriceMonitorProduct';
import db from '../db';
import { PRICE_MONITOR_PAGE_SIZE } from './constants';

export async function getPriceMonitorProducts(
  page: number,
  search?: string,
  brand?: string,
  category?: string
): Promise<{ products: PriceMonitorProduct[]; total: number }> {
  const whereClause = search
    ? {
        OR: [
          {
            title: {
              contains: search,
              mode: 'insensitive' as const,
            },
          },
          {
            sku: {
              contains: search,
              mode: 'insensitive' as const,
            },
          },
        ],
      }
    : {};

  const products = await db.product.findMany({
    where: {
      ...whereClause,
      brand: brand ? { equals: brand } : undefined,
      category: category ? { equals: category } : undefined,
    },
    skip: (page - 1) * PRICE_MONITOR_PAGE_SIZE,
    take: PRICE_MONITOR_PAGE_SIZE,
    include: {
      competitorProducts: true,
    },
  });

  const total = await db.product.count({
    where: whereClause,
  });

  return {
    products,
    total,
  };
}
