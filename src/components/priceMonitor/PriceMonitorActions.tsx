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

const PriceMonitorActions = () => {
  const { selectedProducts } = usePriceMonitorSearch();
  const {
    showDeleteDialog,
    setShowDeleteDialog,
    handleDeleteSelected,
    handleProductsDeleted,
  } = usePriceMonitorActions();

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
            onSelect={handleDeleteSelected}
            disabled={!selectedProducts.length}
          >
            Delete selected products
          </DropdownMenuItem>
          <DropdownMenuItem>Export selected products</DropdownMenuItem>
          <DropdownMenuItem>Export all products</DropdownMenuItem>
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
