'use server';

import { CompetitorProduct } from '../../../generated/prisma';
import db from '../db';
import { PRICE_MONITOR_PAGE_SIZE } from './constants';

export type ProductPricematch = {
  id: string;
  title: string;
  lastCheckedAt: Date;
  price: number;
  competitorProducts: CompetitorProduct[];
};

export async function getProductPricematchList(
  page: number
): Promise<{ products: ProductPricematch[]; total: number }> {
  const dbProducts = await db.product.findMany({
    skip: (page - 1) * PRICE_MONITOR_PAGE_SIZE,
    take: PRICE_MONITOR_PAGE_SIZE,
  });

  const dbCompetitorProducts = await db.competitorProduct.findMany({
    where: {
      productId: {
        in: dbProducts.map((product) => product.id),
      },
    },
  });

  const products = dbProducts.map((product) => {
    const competitorProducts = dbCompetitorProducts.filter(
      (cp) => cp.productId === product.id
    );

    return {
      id: product.id,
      title: product.title,
      lastCheckedAt: product.lastCheckedAt,
      price: product.price ?? 0,
      competitorProducts,
    };
  });

  const total = await db.product.count();

  return {
    products,
    total,
  };
}
