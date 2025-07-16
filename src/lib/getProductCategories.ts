'use server';

import db from './db';

const getProductCategories = async () => {
  const categories = await db.category.findMany({ select: { name: true } });

  return categories.map((category) => category.name);
};

export default getProductCategories;
