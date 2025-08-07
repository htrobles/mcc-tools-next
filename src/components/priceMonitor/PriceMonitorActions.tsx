import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { DropdownMenuItem } from '../ui/dropdown-menu';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { usePriceMonitorSearch } from '@/lib/priceMonitor/contexts/PriceMonitorSearchContext';
import { DeleteProductsDialog } from './DeleteProductsDialog';
import { PriceMatchDialog } from './PriceMatchDialog';
import usePriceMonitorActions from '@/lib/priceMonitor/hooks/usePriceMonitorActions';
import { exportPriceMonitorProducts } from '@/lib/priceMonitor/exportPriceMonitorProducts';
import { downloadCsv } from '@/lib/priceMonitor/downloadCsv';
import { useState } from 'react';
import { priceMatchProducts } from '@/lib/priceMonitor/priceMatchProducts';

const PriceMonitorActions = () => {
  const { selectedProducts } = usePriceMonitorSearch();
  const [showMatchDialog, setShowMatchDialog] = useState(false);

  const {
    showDeleteDialog,
    hasSelectedProducts,
    setShowDeleteDialog,
    handleDeleteSelected,
    handleProductsDeleted,
  } = usePriceMonitorActions();

  const handleExportSelectedProducts = async () => {
    try {
      const result = await exportPriceMonitorProducts(selectedProducts);
      if (result.success && result.csvData) {
        downloadCsv(result.csvData);
      }
    } catch (error) {
      console.error('Failed to export selected products:', error);
    }
  };

  const handleExportAllProducts = async () => {
    try {
      const result = await exportPriceMonitorProducts('all');
      if (result.success && result.csvData) {
        downloadCsv(result.csvData);
      }
    } catch (error) {
      console.error('Failed to export all products:', error);
    }
  };

  const handleMatchProductPrices = () => {
    setShowMatchDialog(true);
  };

  const handleConfirmMatchProductPrices = async (
    matchType: 'percentage' | 'flat',
    value: number
  ) => {
    try {
      const result = await priceMatchProducts(
        selectedProducts,
        matchType,
        value
      );
      if (result.success && result.csvData) {
        downloadCsv(result.csvData);
      }
    } catch (error) {
      console.error('Failed to match product prices:', error);
    }
  };

  const actions = [
    {
      label: 'Export selected products',
      onClick: handleExportSelectedProducts,
      disabled: !hasSelectedProducts,
    },
    {
      label: 'Export all products',
      onClick: handleExportAllProducts,
    },
    {
      label: 'Match product prices',
      onClick: handleMatchProductPrices,
      disabled: !hasSelectedProducts,
    },
    {
      divider: true,
    },
    {
      label: 'Delete selected products',
      onClick: handleDeleteSelected,
      disabled: !hasSelectedProducts,
    },
  ];

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="ml-auto" size="sm">
            <DotsHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actions.map((action, index) => {
            if (action.divider) {
              return <DropdownMenuSeparator key={`divider-${index}`} />;
            }
            return (
              <DropdownMenuItem
                key={action.label}
                onSelect={action.onClick}
                disabled={action.disabled}
              >
                {action.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteProductsDialog
        productIds={selectedProducts}
        productCount={selectedProducts.length}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onProductsDeleted={handleProductsDeleted}
      />
      <PriceMatchDialog
        open={showMatchDialog}
        onOpenChange={setShowMatchDialog}
        onConfirm={handleConfirmMatchProductPrices}
        selectedProductsCount={selectedProducts.length}
      />
    </>
  );
};

export default PriceMonitorActions;
