import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import usePriceUpdate from '@/hooks/usePriceUpdate';
import { Button } from '../ui/button';
import { processError } from '@/utils/helpers';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { VALID_HEADERS } from '@/constants/priceUpdates/priceUpdateConstants';
import {
  PriceUpdateHeader,
  PriceUpdateHeaderKey,
} from '@/types/priceUpdateTypes';

const COLUMN_NAMES: { [key: string]: string } = {};

VALID_HEADERS.forEach(({ key, label }) => {
  COLUMN_NAMES[key] = label;
});

export default function AddPriceUpdateHeaderForm() {
  const { rawHeaders, addSelectedHeader } = usePriceUpdate();
  const [form, setForm] = useState<{ index?: number; key?: string }>({});

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    try {
      const { index, key } = form;
      if (index === undefined || !key) return;

      if (!rawHeaders) return;

      const input: PriceUpdateHeader = {
        index,
        key: key as PriceUpdateHeaderKey,
        value: rawHeaders[index].value as string,
        label: COLUMN_NAMES[key],
      };

      addSelectedHeader(input);
      setForm({});
    } catch (error) {
      processError('Error adding column', error);
    }
  };

  const handleSelectColumn = (value: string) => {
    const parsedValue = parseInt(value);

    if (isNaN(parsedValue) || !rawHeaders) return;

    setForm({
      index: parsedValue,
    });
  };

  const handleLabelChange = (key: PriceUpdateHeaderKey) => {
    setForm({
      ...form,
      key,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-2">
        <label htmlFor="index">Column</label>
        <Select
          name="index"
          value={form.index?.toString() || ''}
          onValueChange={handleSelectColumn}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a Column from file" />
          </SelectTrigger>
          <SelectContent>
            {rawHeaders?.map(({ value, index }) => (
              <SelectItem
                key={`${index}-${value}`}
                value={index?.toString() as string}
              >
                <span className="text-blue-500">{(index as number) + 1}</span> -{' '}
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label htmlFor="label">Output Column Name</label>
        <ColumnSelect
          value={form.key as PriceUpdateHeaderKey}
          onChange={handleLabelChange}
        />
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={form.index === undefined || form.index === null || !form.key}
      >
        + Add
      </Button>
    </form>
  );
}

function ColumnSelect({
  value,
  onChange,
}: {
  value: PriceUpdateHeaderKey;
  onChange: (key: PriceUpdateHeaderKey) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-full"
        >
          {value
            ? VALID_HEADERS.find((header) => header.key === value)?.label
            : 'Select output column name...'}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Search output column name..."
            className="h-9"
          />
          <CommandList>
            <CommandGroup>
              {VALID_HEADERS.map((header) => (
                <CommandItem
                  key={header.key}
                  value={header.key}
                  onSelect={() => {
                    onChange(header.key);
                    setOpen(false);
                  }}
                >
                  {header.label}
                  <CheckIcon
                    className={cn(
                      'ml-auto h-4 w-4',
                      value === header.key ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
