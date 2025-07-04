'use server';

import db from '../db';
import { ProductImportJob } from '@prisma/client';

export async function getProductImportJobs(
  page: number = 1,
  pageSize: number = 20
): Promise<{ jobs: ProductImportJob[]; total: number }> {
  const jobs = await db.productImportJob.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const total = await db.productImportJob.count();

  return {
    jobs,
    total,
  };
}
