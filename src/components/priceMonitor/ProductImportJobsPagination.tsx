'use client';

import * as React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface ProductImportJobsPaginationProps {
  currentPage: number;
  totalPages: number;
  className?: string;
}

export function ProductImportJobsPagination({
  currentPage,
  totalPages,
  className,
}: ProductImportJobsPaginationProps) {
  const searchParams = useSearchParams();

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    return `/price-monitor/imports?${params.toString()}`;
  };

  const visiblePages = getVisiblePages();

  return (
    <div
      className={cn('flex items-center justify-center space-x-2', className)}
    >
      {currentPage > 1 ? (
        <Link href={createPageUrl(currentPage - 1)}>
          <Button variant="outline" size="sm">
            <ChevronLeftIcon className="h-4 w-4" />
            Previous
          </Button>
        </Link>
      ) : (
        <Button variant="outline" size="sm" disabled>
          <ChevronLeftIcon className="h-4 w-4" />
          Previous
        </Button>
      )}

      {visiblePages.map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="px-2 py-1 text-sm text-muted-foreground">...</span>
          ) : (
            <Link href={createPageUrl(page as number)}>
              <Button
                variant={currentPage === page ? 'default' : 'outline'}
                size="sm"
                className="w-8 h-8 p-0"
              >
                {page}
              </Button>
            </Link>
          )}
        </React.Fragment>
      ))}

      {currentPage < totalPages ? (
        <Link href={createPageUrl(currentPage + 1)}>
          <Button variant="outline" size="sm">
            Next
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </Link>
      ) : (
        <Button variant="outline" size="sm" disabled>
          Next
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
