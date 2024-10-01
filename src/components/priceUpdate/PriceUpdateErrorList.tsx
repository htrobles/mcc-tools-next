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

export default function PriceUpdateErrorList() {
  const { errorRows } = usePriceUpdate();

  if (!errorRows) return null;

  return (
    <div className="border rounded bg-white grow">
      <Table title="Error list">
        <TableHeader>
          <TableRow>
            <TableHead>Manufacturer SKU</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Error</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {errorRows.map((errorRow) => (
            <PriceUpdateErrorItem key={errorRow.sku} errorRow={errorRow} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
