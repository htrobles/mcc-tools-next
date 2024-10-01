import React from 'react';
import { TableCell, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import usePriceUpdate from '@/hooks/usePriceUpdate';
import { PriceUpdateErrorRowType } from './PriceUpdateContextProvider';

export default function PriceUpdateErrorItem({
  sku,
  error,
  toDelete,
}: PriceUpdateErrorRowType) {
  const { updateErrorRow } = usePriceUpdate();

  const handleUpdateAction = () => {
    updateErrorRow({ sku, toDelete: !toDelete });
  };

  return (
    <TableRow key={sku}>
      <TableCell>{sku}</TableCell>
      <TableCell className="text-destructive">{error}</TableCell>
      <TableCell>
        <Button
          variant={toDelete ? 'destructive' : 'outline'}
          size="sm"
          className="w-full"
          value="delete"
          onClick={handleUpdateAction}
        >
          Remove
        </Button>
      </TableCell>
    </TableRow>
  );
}
