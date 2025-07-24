import { toast } from '@/hooks/use-toast';
import { STORES } from '@/lib/stores';
import { Store } from '@prisma/client';

export function processError(title: string, error: unknown) {
  if (error instanceof Error) {
    toast({
      variant: 'destructive',
      title,
      description: error.message,
    });
    console.log(error);
    console.log(error.cause);
  } else {
    toast({
      variant: 'destructive',
      title,
      description: 'Something went wrong. Please try again.',
    });
    console.log(error);
  }
}

// Helper function to get column display name
export const getColumnDisplayName = (columnId: string): string => {
  switch (columnId) {
    case 'title':
      return 'Product';
    case 'sku':
      return 'SKU';
    case 'price':
      return 'Our Price';
    default:
      if (columnId.startsWith('competitor_')) {
        const storeKey = columnId.replace('competitor_', '') as Store;
        return STORES[storeKey]?.name || columnId;
      }
      return columnId;
  }
};
