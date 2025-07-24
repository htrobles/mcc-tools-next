'use client';

import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
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
import { useState } from 'react';
import {
  usePriceMonitorFilterActions,
  usePriceMonitorFilters,
  usePriceMonitorSearch,
} from '@/lib/priceMonitor/contexts/PriceMonitorSearchContext';

export default function PriceMonitorCategorySelector() {
  const [open, setOpen] = useState(false);
  const { categories, loading } = usePriceMonitorSearch();
  const { filters } = usePriceMonitorFilters();
  const { setCategory } = usePriceMonitorFilterActions();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
          disabled={loading}
        >
          {filters.category && !loading
            ? categories.find(
                (category: string) => category === filters.category
              )
            : 'Filter by category'}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search category..." />
          <CommandList>
            <CommandEmpty>No categories found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="all"
                onSelect={() => {
                  setCategory('');
                  setOpen(false);
                }}
              >
                <CheckIcon
                  className={cn(
                    'mr-2 h-4 w-4',
                    !filters.category ? 'opacity-100' : 'opacity-0'
                  )}
                />
                All
              </CommandItem>
              {categories.map((category: string) => (
                <CommandItem
                  key={category}
                  value={category}
                  onSelect={(currentValue) => {
                    setCategory(currentValue);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      'mr-2 h-4 w-4',
                      filters.category === category
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                  {category}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
