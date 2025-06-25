'use server';

import { CompetitorProduct, Product } from '../../../generated/prisma';
import db from '../db';
import { PRICE_MONITOR_PAGE_SIZE } from './constants';

export async function getPriceMonitorProducts(
  page: number
): Promise<{ products: Product[]; total: number }> {
  const products = await db.product.findMany({
    skip: (page - 1) * PRICE_MONITOR_PAGE_SIZE,
    take: PRICE_MONITOR_PAGE_SIZE,
    include: {
      competitorProducts: true,
    },
  });

  const total = await db.product.count();

  return {
    products,
    total,
  };
}
