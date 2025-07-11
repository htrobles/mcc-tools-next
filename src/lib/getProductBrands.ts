'use server';

import db from './db';

const getProductBrabds = async () => {
  const brands = await db.brand.findMany({ select: { name: true } });

  return brands.map((brand) => brand.name);
};

export default getProductBrabds;
