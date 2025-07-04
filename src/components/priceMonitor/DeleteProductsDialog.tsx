'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Loader2 } from 'lucide-react';
import deletePriceMonitorProducts from '@/lib/priceMonitor/deletePriceMonitorProducts';

interface DeleteProductsDialogProps {
  productIds: string[];
  productCount: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductsDeleted?: () => void;
}

export function DeleteProductsDialog({
  productIds,
  productCount,
  open,
  onOpenChange,
  onProductsDeleted,
}: DeleteProductsDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (productIds.length === 0) return;

    setIsDeleting(true);
    try {
      await deletePriceMonitorProducts(productIds);

      toast({
        title: 'Success',
        description: `Successfully deleted ${productCount} product${productCount > 1 ? 's' : ''}`,
      });

      onOpenChange(false);
      onProductsDeleted?.();
    } catch (error) {
      console.error('Error deleting products:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete selected products. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Products</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{' '}
            <span className="font-semibold">
              {productCount} product{productCount > 1 ? 's' : ''}
            </span>
            ? This action cannot be undone and will permanently remove these
            products from price monitoring.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Products
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
