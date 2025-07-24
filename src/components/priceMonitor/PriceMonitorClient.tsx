'use client';

import { useState } from 'react';
import { PriceMonitorProduct } from '@/lib/priceMonitor/getPriceMonitorProduct';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DeleteProductsDialog } from './DeleteProductsDialog';
import PriceMonitorAddDropdown from './PriceMonitorAddDropdown';
import PriceMonitorManualSyncBtn from './PriceMonitorManualSyncBtn';
import { PriceMonitorDataTable } from './PriceMonitorDataTable';
import { usePriceMonitorSearch } from '@/lib/priceMonitor/contexts/PriceMonitorSearchContext';

interface PriceMonitorClientProps {
  products: PriceMonitorProduct[];
  search?: string;
  currentPage: number;
  totalPages: number;
  total: number;
  currentPageSize?: number;
}

const PriceMonitorClient = ({
  products,
  currentPage,
  totalPages,
  total,
  currentPageSize,
}: PriceMonitorClientProps) => {
  const router = useRouter();
  const { selectedProducts, setSelectedProducts } = usePriceMonitorSearch();

  const handleProductSelect = (productId: string, checked: boolean) => {
    const newSelected = new Set(selectedProducts);
    if (checked) {
      newSelected.add(productId);
    } else {
      newSelected.delete(productId);
    }
    setSelectedProducts(Array.from(newSelected));
  };

  const handleSelectAll = (checked: boolean) => {
    const currentPageProductIds = products.map((p) => p.id);
    const newSelected = new Set(selectedProducts);

    if (checked) {
      // Add all current page products to selection
      currentPageProductIds.forEach((id) => {
        newSelected.add(id);
      });
    } else {
      // Remove all current page products from selection
      currentPageProductIds.forEach((id) => {
        newSelected.delete(id);
      });
    }

    setSelectedProducts(Array.from(newSelected));
  };

  const handleProductsDeleted = () => {
    // Clear selection and refresh the page
    setSelectedProducts([]);
    router.refresh();
  };

  const handlePageChange = (page: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set('page', page.toString());
    router.push(url.toString());
  };

  const handlePageSizeChange = (pageSize: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set('pageSize', pageSize.toString());
    url.searchParams.set('page', '1'); // Reset to first page when changing page size
    router.push(url.toString());
  };

  const isAllSelected =
    products.length > 0 && selectedProducts.length === products.length;
  const isIndeterminate =
    selectedProducts.length > 0 && selectedProducts.length < products.length;

  return (
    <PriceMonitorDataTable
      products={products}
      selectedProducts={selectedProducts}
      onProductSelect={handleProductSelect}
      onSelectAll={handleSelectAll}
      isAllSelected={isAllSelected}
      isIndeterminate={isIndeterminate}
      currentPage={currentPage}
      totalPages={totalPages}
      total={total}
      currentPageSize={currentPageSize}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
    />
  );
};

export default PriceMonitorClient;
