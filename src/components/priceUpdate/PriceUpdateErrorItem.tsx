import React from 'react';
import { TableCell, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import usePriceUpdate from '@/hooks/usePriceUpdate';
import {
  PriceUpdateErrorAction,
  PriceUpdateErrorRowType,
} from './PriceUpdateContextProvider';
import { CopyIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';

export default function PriceUpdateErrorItem({
  errorRow,
}: {
  errorRow: PriceUpdateErrorRowType;
}) {
  const { sku, error, action, description } = errorRow;

  const { updateErrorRow } = usePriceUpdate();

  const handleUpdateAction = (value: PriceUpdateErrorAction) => {
    updateErrorRow({ sku, action: value });
  };

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
  };

  return (
    <TableRow key={sku}>
      <TableCell
        className="font-bold gap-1 items-center group cursor-pointer"
        onClick={() => description && copyToClipboard(sku)}
      >
        {sku}
        <CopyIcon className="invisible group-hover:visible inline ml-1" />
      </TableCell>
      <TableCell
        onClick={() => description && copyToClipboard(description)}
        className="group"
      >
        {description}
        <CopyIcon className="invisible group-hover:visible inline ml-1" />
      </TableCell>
      <TableCell className="text-destructive">{error}</TableCell>
      <TableCell className="flex gap-1 flex-wrap flex-col xl:flex-row">
        <Button
          variant={action === 'add-product' ? 'default' : 'outline'}
          size="sm"
          className={cn(
            'grow',
            action === 'add-product' ? 'bg-lime-600 hover:bg-lime-500' : ''
          )}
          value="delete"
          onClick={() => handleUpdateAction('add-product')}
        >
          Add Product
        </Button>
        <Button
          variant={action === 'remove' ? 'destructive' : 'outline'}
          size="sm"
          className="grow"
          value="delete"
          onClick={() => handleUpdateAction('remove')}
        >
          Remove
        </Button>
        <Button
          variant={action === 'ignore' ? 'default' : 'outline'}
          size="sm"
          className={cn(
            'grow',
            action === 'ignore' ? 'bg-gray-500 hover:bg-gray-400' : ''
          )}
          value="delete"
          onClick={() => handleUpdateAction('ignore')}
        >
          Ignore
        </Button>
      </TableCell>
    </TableRow>
  );
}
