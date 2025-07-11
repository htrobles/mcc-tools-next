'use server';

import { Prisma } from '@prisma/client';
import { PriceMonitorProduct } from './getPriceMonitorProduct';
import db from '../db';
import { PRICE_MONITOR_PAGE_SIZE } from './constants';

// Define proper types for better type safety
export interface PriceMonitorSearchParams {
  page: number;
  search?: string;
  brand?: string;
  category?: string;
  withCompetitorPricesOnly?: boolean;
}

export interface PriceMonitorProductsResult {
  products: PriceMonitorProduct[];
  total: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalPages: number;
}

// Input validation function
function validateSearchParams(params: PriceMonitorSearchParams): void {
  if (params.page < 1) {
    throw new Error('Page number must be greater than 0');
  }

  if (params.search && params.search.trim().length === 0) {
    throw new Error('Search term cannot be empty');
  }

  if (params.brand && params.brand.trim().length === 0) {
    throw new Error('Brand cannot be empty');
  }

  if (params.category && params.category.trim().length === 0) {
    throw new Error('Category cannot be empty');
  }
}

// Build where clause for database query
function buildWhereClause(
  params: PriceMonitorSearchParams
): Prisma.ProductWhereInput {
  const { search, brand, category, withCompetitorPricesOnly } = params;

  const whereClause: Prisma.ProductWhereInput = {};

  // Add search conditions
  if (search?.trim()) {
    const searchTerm = search.trim();
    whereClause.OR = [
      {
        title: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
      {
        sku: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
    ];
  }

  // Add brand filter
  if (brand?.trim()) {
    whereClause.brand = { equals: brand.trim() };
  }

  // Add category filter
  if (category?.trim()) {
    whereClause.category = { equals: category.trim() };
  }

  if (withCompetitorPricesOnly) {
    whereClause.competitorsHavePrice = true;
  }

  return whereClause;
}

// Calculate pagination metadata
function calculatePaginationMetadata(
  total: number,
  page: number,
  pageSize: number
) {
  const totalPages = Math.ceil(total / pageSize);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  return {
    totalPages,
    hasNextPage,
    hasPreviousPage,
  };
}

export async function getPriceMonitorProducts(
  searchParams: PriceMonitorSearchParams
): Promise<PriceMonitorProductsResult> {
  try {
    // Validate input parameters
    validateSearchParams(searchParams);

    const { page } = searchParams;
    const whereClause = buildWhereClause(searchParams);

    // Calculate pagination
    const skip = (page - 1) * PRICE_MONITOR_PAGE_SIZE;

    // Execute database queries in parallel for better performance
    const [products, total] = await Promise.all([
      db.product.findMany({
        where: whereClause,
        skip,
        take: PRICE_MONITOR_PAGE_SIZE,
        include: {
          competitorProducts: true,
        },
        orderBy: {
          createdAt: 'desc', // Most recent products first
        },
      }),
      db.product.count({
        where: whereClause,
      }),
    ]);

    // Calculate pagination metadata
    const paginationMetadata = calculatePaginationMetadata(
      total,
      page,
      PRICE_MONITOR_PAGE_SIZE
    );

    return {
      products,
      total,
      ...paginationMetadata,
    };
  } catch (error) {
    // Log error for debugging (in production, use proper logging service)
    console.error('Error fetching price monitor products:', error);

    // Re-throw with more context
    throw new Error(
      `Failed to fetch price monitor products: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
