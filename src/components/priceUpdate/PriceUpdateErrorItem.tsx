import React from 'react';
import { TableCell, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { ErrorAction } from './PriceUpdateContextProvider';
import { Input } from '../ui/input';
import usePriceUpdate from '@/hooks/usePriceUpdate';

interface PriceUpdateErrorItemProps {
  sku: string;
  error: string;
  action?: ErrorAction;
}

export default function PriceUpdateErrorItem({
  sku,
  error,
  action,
}: PriceUpdateErrorItemProps) {
  const { updateErrorRow } = usePriceUpdate();

  const handleUpdateAction = (newAction: ErrorAction) => {
    updateErrorRow({ sku, action: newAction });
  };

  return (
    <TableRow key={sku}>
      <TableCell>{sku}</TableCell>
      <TableCell className="text-destructive">{error}</TableCell>
      <TableCell className="flex gap-1 flex-wrap">
        <Button
          variant={action === 'update' ? 'default' : 'outline'}
          size="sm"
          className="grow"
          value="update"
          onClick={(e) => handleUpdateAction('update')}
        >
          Update SKU
        </Button>
        <Button
          variant={action === 'delete' ? 'destructive' : 'outline'}
          size="sm"
          className="grow"
          value="delete"
          onClick={() => handleUpdateAction('delete')}
        >
          Remove
        </Button>
      </TableCell>
      <TableCell>
        <Input placeholder="Enter System ID" disabled={action !== 'update'} />
      </TableCell>
    </TableRow>
  );
}
