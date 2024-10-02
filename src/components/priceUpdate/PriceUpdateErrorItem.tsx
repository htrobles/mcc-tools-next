import React from 'react';
import { TableCell, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import usePriceUpdate from '@/hooks/usePriceUpdate';
import { PriceUpdateErrorRowType } from './PriceUpdateContextProvider';
import { CopyIcon } from '@radix-ui/react-icons';

export default function PriceUpdateErrorItem({
  errorRow,
}: {
  errorRow: PriceUpdateErrorRowType;
}) {
  const { sku, error, toDelete, description } = errorRow;

  const { updateErrorRow } = usePriceUpdate();

  const handleUpdateAction = () => {
    updateErrorRow({ sku, toDelete: !toDelete });
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
