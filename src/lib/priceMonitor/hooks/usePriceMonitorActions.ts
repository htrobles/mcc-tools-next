import { useState } from 'react';
import { usePriceMonitorSearch } from '../contexts/PriceMonitorSearchContext';
import { useRouter } from 'next/navigation';

const usePriceMonitorActions = () => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { selectedProducts, setSelectedProducts } = usePriceMonitorSearch();
  const hasSelectedProducts = selectedProducts.length > 0;
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

  return {
    showDeleteDialog,
    setShowDeleteDialog,
    handleDeleteSelected,
    handleProductsDeleted,
    hasSelectedProducts,
  };
};

export default usePriceMonitorActions;
