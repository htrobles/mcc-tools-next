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
  TableCell,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import CompetitorPrice from './CompetitorPrice';
import { Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { DeleteProductsDialog } from './DeleteProductsDialog';

interface PriceMonitorClientProps {
  products: PriceMonitorProduct[];
  search?: string;
}

const PriceMonitorClient = ({ products, search }: PriceMonitorClientProps) => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteProgress, setDeleteProgress] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();
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
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Monitored Products ({selectedProducts.length} selected)
        </div>
        <div className="flex gap-1 h-9">
          {!!selectedProducts.length && (
            <Button
              onClick={handleDeleteSelected}
              disabled={selectedProducts.length === 0}
              variant="destructive"
            >
              <Trash2 className="mr-2" size={14} />
              Delete Selected ({selectedProducts.length})
            </Button>
          )}
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
              <TableHead>Last Checked</TableHead>
              <TableHead>Our Price</TableHead>
              <TableHead>Long and McQuade Price</TableHead>
              <TableHead>RedOne Music Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const lmPrice = product.competitorProducts.find(
                (cp) => cp.store === 'LM'
              )?.price;
              const redOnePrice = product.competitorProducts.find(
                (cp) => cp.store === 'REDONE'
              )?.price;

              return (
                <TableRow key={product.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={(checked) =>
                        handleProductSelect(product.id, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <a href={`/price-monitor/${product.id}`}>{product.title}</a>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {product.sku}
                  </TableCell>
                  <TableCell>
                    {product.lastCheckedAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-gray-500">
                      {product.price ? `$${product.price?.toFixed(2)}` : 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <CompetitorPrice
                      ourPrice={product.price}
                      competitorPrice={lmPrice}
                    />
                  </TableCell>
                  <TableCell>
                    <CompetitorPrice
                      ourPrice={product.price}
                      competitorPrice={redOnePrice}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
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
