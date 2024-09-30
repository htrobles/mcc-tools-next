import { PriceUpdateContext } from '@/components/priceUpdate/PriceUpdateContextProvider';
import { useContext } from 'react';

export default function usePriceUpdate() {
  const context = useContext(PriceUpdateContext);

  if (!context) {
    throw new Error('usePriceUpdate must be used within a PriceUpdateContext');
  }

  return context;
}
