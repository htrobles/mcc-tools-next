'use server';

import db from './db';

const getProductBrands = async () => {
  const brands = await db.brand.findMany({ select: { name: true } });

  return brands.map((brand) => brand.name);
};

export default getProductBrands;
