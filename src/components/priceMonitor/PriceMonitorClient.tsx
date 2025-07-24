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
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();

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

  const handleDeleteSelected = () => {
    if (selectedProducts.length === 0) return;
    setShowDeleteDialog(true);
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
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-x-2">
        <div className="flex gap-x-2">
          {!!selectedProducts.length && (
            <Button
              onClick={handleDeleteSelected}
              disabled={selectedProducts.length === 0}
              variant="destructive"
              size="sm"
            >
              <Trash2 className="mr-2" size={14} />
              Delete Selected ({selectedProducts.length})
            </Button>
          )}
          <PriceMonitorAddDropdown />
          <PriceMonitorManualSyncBtn />
        </div>
      </div>

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

      <DeleteProductsDialog
        productIds={selectedProducts}
        productCount={selectedProducts.length}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onProductsDeleted={handleProductsDeleted}
      />
    </div>
  );
};

export default PriceMonitorClient;
