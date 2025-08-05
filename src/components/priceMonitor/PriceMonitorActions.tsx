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
import usePriceMonitorActions from '@/lib/priceMonitor/hooks/usePriceMonitorActions';
import { exportPriceMonitorProducts } from '@/lib/priceMonitor/exportPriceMonitorProducts';
import { downloadCsv } from '@/lib/priceMonitor/downloadCsv';

const PriceMonitorActions = () => {
  const { selectedProducts } = usePriceMonitorSearch();

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
          <DropdownMenuItem
            disabled={!hasSelectedProducts}
            onSelect={handleExportSelectedProducts}
            className="cursor-pointer"
          >
            Export selected products
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={handleExportAllProducts}
            className="cursor-pointer"
          >
            Export all products
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={handleDeleteSelected}
            disabled={!hasSelectedProducts}
            className="text-destructive cursor-pointer"
          >
            Delete selected products
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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

export default PriceMonitorActions;
