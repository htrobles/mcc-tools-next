'use client';

import { useState } from 'react';
import { usePriceMonitorSearch } from '@/lib/priceMonitor/contexts/PriceMonitorSearchContext';
import { DeleteProductsDialog } from './DeleteProductsDialog';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const DeleteProductsButton = () => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { selectedProducts, setSelectedProducts } = usePriceMonitorSearch();
  const router = useRouter();

  const handleDeleteSelected = () => {
    if (selectedProducts.length === 0) return;
    setShowDeleteDialog(true);
  };

  const handleProductsDeleted = () => {
    // Clear selection and refresh the page
    setSelectedProducts([]);
    router.refresh();
  };

  return (
    <>
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

      <DeleteProductsDialog
        productIds={selectedProducts}
        productCount={selectedProducts.length}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onProductsDeleted={handleProductsDeleted}
      />
    </>
  );
};

export default DeleteProductsButton;
