import React from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import usePriceUpdate from '@/hooks/usePriceUpdate';
import PriceUpdateErrorItem from './PriceUpdateErrorItem';

export default function ErrorList() {
  const { errorRows } = usePriceUpdate();

  if (!errorRows) return null;

  return (
    <div className="border rounded bg-white grow">
      <Table title="Error list">
        <TableHeader>
          <TableRow>
            <TableHead>Manufacturer SKU</TableHead>
            <TableHead>Error</TableHead>
            <TableHead>Actions</TableHead>
            <TableHead>Updated SKU</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {errorRows.map(({ sku, error, action }) => (
            <PriceUpdateErrorItem sku={sku} error={error} action={action} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
