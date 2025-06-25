import { Prisma } from '../../../generated/prisma';
import db from '../db';

const PriceMonitorProduct = Prisma.validator<Prisma.ProductDefaultArgs>()({
  include: { competitorProducts: true },
});

export type PriceMonitorProduct = Prisma.ProductGetPayload<
  typeof PriceMonitorProduct
>;

export async function getPriceMonitorProduct(
  productId: string
): Promise<PriceMonitorProduct | null> {
  const product = await db.product.findUnique({
    where: { id: productId },
    include: {
      competitorProducts: true,
    },
  });

  return product;
}
