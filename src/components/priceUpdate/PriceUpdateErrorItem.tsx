import React from 'react';
import { TableCell, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import usePriceUpdate from '@/hooks/usePriceUpdate';
import { PriceUpdateErrorRowType } from './PriceUpdateContextProvider';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
      <TableCell className="font-bold">
        <Tooltip>
          <TooltipTrigger onClick={() => copyToClipboard(sku)}>
            {sku}
          </TooltipTrigger>
          <TooltipContent>Click to copy</TooltipContent>
        </Tooltip>
      </TableCell>
      <TableCell>
        <Tooltip>
          <TooltipTrigger
            onClick={() => description && copyToClipboard(description)}
          >
            {description}
          </TooltipTrigger>
          <TooltipContent>Click to copy</TooltipContent>
        </Tooltip>
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
