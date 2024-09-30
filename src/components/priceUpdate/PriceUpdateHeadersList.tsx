import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import { PriceUpdateHeader } from '@/utils/priceUpdate/getPriceUpdateHeaders';

interface PriceUpdateHeadersListProps {
  headers: PriceUpdateHeader[];
}

export default function PriceUpdateHeadersList({
  headers,
}: PriceUpdateHeadersListProps) {
  if (!headers?.length) return null;

  return (
    <Table title="List of files to be processed">
      <TableHeader>
        {headers.map((h) => (
          <TableRow key={`${h.index}-${h.value}`}>
            <TableHead>{h.value}</TableHead>
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {/* {!files.length && (
          <TableRow>
            <TableCell className="text-center py-5" colSpan={4}>
              <h4>No files selected yet.</h4>
              <p>Please select files to process.</p>
            </TableCell>
          </TableRow>
        )}
        {files.map((file) => (
          <TableRow key={file.name}>
            <TableCell className="font-medium whitespace-nowrap">
              <Checkbox
                checked={selectedFiles.includes(file.name)}
                onCheckedChange={() => handleToggleFile(file.name)}
              />{' '}
            </TableCell>
            <TableCell className="font-medium whitespace-nowrap">
              {file.name}
            </TableCell>
            <TableCell>
              <VendorSelect
                value={file.vendor}
                onSelect={(value) => handleVendorUpdate(file.name, value)}
              />
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" onClick={() => onTestFile(file.name)}>
                Test
              </Button>
              <Button
                variant="destructive"
                onClick={() => onDeleteFile(file.name)}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))} */}
      </TableBody>
    </Table>
  );
}
