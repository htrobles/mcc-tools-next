'use client';

import { useState } from 'react';
import { PriceMonitorProduct } from '@/lib/priceMonitor/getPriceMonitorProduct';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DeleteProductsDialog } from './DeleteProductsDialog';
import PriceMonitorAddDropdown from './PriceMonitorAddDropdown';
import PriceMonitorManualSyncBtn from './PriceMonitorManualSyncBtn';
import { STORES } from '@/lib/stores';
import { Store } from '@prisma/client';
import PriceMonitorTableRow from './PriceMonitorTableRow';

interface PriceMonitorClientProps {
  products: PriceMonitorProduct[];
  search?: string;
}

const PriceMonitorClient = ({ products }: PriceMonitorClientProps) => {
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
    if (checked) {
      setSelectedProducts(products.map((p) => p.id));
    } else {
      setSelectedProducts([]);
    }
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

  const isAllSelected =
    products.length > 0 && selectedProducts.length === products.length;
  const isIndeterminate =
    selectedProducts.length > 0 && selectedProducts.length < products.length;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-x-2">
        <span className="text-sm text-muted-foreground">
          Monitored Products ({selectedProducts.length} selected)
        </span>
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

      <div className="border rounded bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  className={isIndeterminate ? 'border-2' : ''}
                />
              </TableHead>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Our Price</TableHead>
              {Object.keys(STORES).map((storeKey) => (
                <TableHead key={storeKey}>
                  {STORES[storeKey as Store].name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <PriceMonitorTableRow
                key={product.id}
                product={product}
                isSelected={selectedProducts.includes(product.id)}
                onSelect={handleProductSelect}
              />
            ))}
          </TableBody>
        </Table>
      </div>

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
