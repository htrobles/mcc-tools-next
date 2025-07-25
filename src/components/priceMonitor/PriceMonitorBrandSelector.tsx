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

export default function PriceMonitorBrandSelector() {
  const [open, setOpen] = useState(false);
  const { brands, loading } = usePriceMonitorSearch();
  const { filters } = usePriceMonitorFilters();
  const { setBrand } = usePriceMonitorFilterActions();

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
          {filters.brand && !loading
            ? brands.find((brand: string) => brand === filters.brand)
            : 'Filter by brand'}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search brand..." />
          <CommandList>
            <CommandEmpty>No brands found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="all"
                onSelect={() => {
                  setBrand('');
                  setOpen(false);
                }}
              >
                <CheckIcon
                  className={cn(
                    'mr-2 h-4 w-4',
                    !filters.brand ? 'opacity-100' : 'opacity-0'
                  )}
                />
                All
              </CommandItem>
              {brands.map((brand: string) => (
                <CommandItem
                  key={brand}
                  value={brand}
                  onSelect={(currentValue) => {
                    setBrand(currentValue);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      'mr-2 h-4 w-4',
                      filters.brand === brand ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {brand}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
