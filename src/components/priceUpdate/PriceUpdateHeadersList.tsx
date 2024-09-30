import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Button } from '../ui/button';
import usePriceUpdate from '@/hooks/usePriceUpdate';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import AddPriceUpdateHeaderForm from './AddPriceUpdateHeaderForm';

export default function PriceUpdateHeadersList() {
  const { rawHeaders, selectedHeaders, removeSelectedHeader } =
    usePriceUpdate();

  if (!rawHeaders?.length) return null;

  return (
    <div className="border rounded bg-white grow">
      <Table title="Selected Columns">
        <TableHeader>
          <TableRow>
            <TableHead>Original Column Name</TableHead>
            <TableHead>Output Name</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {selectedHeaders?.map((h) => (
            <TableRow key={`${h.value}-${h.label}`}>
              <TableCell>{h.value}</TableCell>
              <TableCell>{h.label}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  onClick={() => removeSelectedHeader(h.label)}
                >
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={3} className="text-center">
              <Popover>
                <PopoverTrigger className="w-full">
                  + Add new column
                </PopoverTrigger>
                <PopoverContent>
                  <AddPriceUpdateHeaderForm />
                </PopoverContent>
              </Popover>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
