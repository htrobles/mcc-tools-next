'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import {
  ArrowUpDown,
  Settings2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PriceMonitorProduct } from '@/lib/priceMonitor/getPriceMonitorProduct';
import {
  PRICE_MONITOR_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
} from '@/lib/priceMonitor/constants';
import { STORES } from '@/lib/stores';
import { Store } from '@prisma/client';
import CompetitorPrice from './CompetitorPrice';
import { getColumnDisplayName } from '@/utils/helpers';
import DeleteProductsButton from './DeleteProductsButton';
import PriceMonitorManualSyncBtn from './PriceMonitorManualSyncBtn';
import PriceMonitorAddDropdown from './PriceMonitorAddDropdown';

export type PriceMonitorTableData = PriceMonitorProduct;

// We'll create columns inside the component to access props
const createColumns = (
  selectedProducts: string[],
  onProductSelect: (productId: string, checked: boolean) => void,
  onSelectAll: (checked: boolean) => void,
  products: PriceMonitorProduct[]
): ColumnDef<PriceMonitorTableData>[] => [
  {
    id: 'select',
    header: () => {
      const currentPageProductIds = products.map((product) => product.id);
      const selectedOnCurrentPage = currentPageProductIds.filter((id) =>
        selectedProducts.includes(id)
      );
      const isAllSelected =
        selectedOnCurrentPage.length === currentPageProductIds.length &&
        currentPageProductIds.length > 0;
      const isIndeterminate =
        selectedOnCurrentPage.length > 0 &&
        selectedOnCurrentPage.length < currentPageProductIds.length;

      return (
        <Checkbox
          checked={isAllSelected || (isIndeterminate && 'indeterminate')}
          onCheckedChange={(value) => {
            const checked = !!value;
            if (checked) {
              // Select all products on current page that aren't already selected
              const productsToSelect = currentPageProductIds.filter(
                (id) => !selectedProducts.includes(id)
              );
              if (productsToSelect.length > 0) {
                // Call onSelectAll to handle bulk selection
                onSelectAll(true);
              }
            } else {
              // Deselect all products on current page that are currently selected
              const productsToDeselect = currentPageProductIds.filter((id) =>
                selectedProducts.includes(id)
              );
              if (productsToDeselect.length > 0) {
                // Call onSelectAll to handle bulk deselection
                onSelectAll(false);
              }
            }
          }}
          aria-label="Select all"
        />
      );
    },
    cell: ({ row }) => {
      const productId = row.original.id;
      const isSelected = selectedProducts.includes(productId);

      return (
        <Checkbox
          checked={isSelected}
          onCheckedChange={(value) => {
            const checked = !!value;
            onProductSelect(productId, checked);
          }}
          aria-label="Select row"
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Product
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium min-w-[180px]">
        <a
          href={`/price-monitor/${row.original.id}`}
          className="hover:underline"
        >
          {row.getValue('title')}
        </a>
      </div>
    ),
  },
  {
    accessorKey: 'sku',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          SKU
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-mono text-sm text-muted-foreground">
        {row.getValue('sku')}
      </div>
    ),
  },
  {
    accessorKey: 'price',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Our Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = row.getValue('price') as number | null;
      return (
        <div className="font-bold text-gray-500">
          {price ? `$${price.toFixed(2)}` : 'N/A'}
        </div>
      );
    },
  },
  ...(Object.keys(STORES).map((storeKey) => ({
    id: `competitor_${storeKey}`,
    header: STORES[storeKey as Store].name,
    cell: ({ row }) => {
      const product = row.original;
      const competitorPrice = product.competitorProducts.find(
        (cp) => cp.store === storeKey
      )?.price;

      return (
        <CompetitorPrice
          ourPrice={product.price}
          competitorPrice={competitorPrice}
        />
      );
    },
    enableSorting: false,
  })) as ColumnDef<PriceMonitorTableData>[]),
];

interface PriceMonitorDataTableProps {
  products: PriceMonitorProduct[];
  selectedProducts: string[];
  onProductSelect: (productId: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  isAllSelected: boolean;
  isIndeterminate: boolean;
  currentPage: number;
  totalPages: number;
  total: number;
  currentPageSize?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function PriceMonitorDataTable({
  products,
  selectedProducts,
  onProductSelect,
  onSelectAll,
  isAllSelected,
  isIndeterminate,
  currentPage,
  totalPages,
  total,
  currentPageSize,
  onPageChange,
  onPageSizeChange,
}: PriceMonitorDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const columns = createColumns(
    selectedProducts,
    onProductSelect,
    onSelectAll,
    products
  );

  const table = useReactTable({
    data: products,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    initialState: {
      pagination: {
        pageSize: currentPageSize || PRICE_MONITOR_PAGE_SIZE,
        pageIndex: currentPage - 1, // TanStack Table uses 0-based indexing
      },
    },
    manualPagination: true, // Tell the table we're handling pagination manually
    pageCount: totalPages,
    state: {
      sorting,
      columnVisibility,
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: currentPageSize || PRICE_MONITOR_PAGE_SIZE,
      },
    },
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === 'function'
          ? updater({
              pageIndex: currentPage - 1,
              pageSize: currentPageSize || PRICE_MONITOR_PAGE_SIZE,
            })
          : updater;

      // Handle page size changes
      if (
        newPagination.pageSize !== (currentPageSize || PRICE_MONITOR_PAGE_SIZE)
      ) {
        onPageSizeChange(newPagination.pageSize);
        return;
      }

      // Handle page changes
      const newPage = newPagination.pageIndex + 1; // Convert back to 1-based indexing
      onPageChange(newPage);
    },
  });

  return (
    <div className="w-full">
      <div className="flex justify-between items-center py-4">
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="hidden size-8 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="hidden size-8 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between gap-x-2">
          <DeleteProductsButton />
          <PriceMonitorAddDropdown />
          <PriceMonitorManualSyncBtn />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto" size="sm">
                <Settings2 className="mr-2 h-4 w-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {getColumnDisplayName(column.id)}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={index > 2 ? 'min-w-20' : ''}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={
                    selectedProducts.includes(row.original.id) && 'selected'
                  }
                  className={index > 2 ? 'min-w-20' : ''}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end py-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${currentPageSize || PRICE_MONITOR_PAGE_SIZE}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue
                placeholder={currentPageSize || PRICE_MONITOR_PAGE_SIZE}
              />
            </SelectTrigger>
            <SelectContent side="top">
              {PAGE_SIZE_OPTIONS.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
