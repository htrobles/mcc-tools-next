'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';
import { usePriceMonitorAdvancedSearch } from '@/lib/priceMonitor/contexts/PriceMonitorAdvancedSearchContext';

const PriceMonitorSearch = () => {
  const { search, setSearch, handleSearch, handleClearSearch } =
    usePriceMonitorAdvancedSearch();

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <Input
        name="search"
        placeholder="Search product title or SKU..."
        className="w-52"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Button type="submit" className="space-x-2">
        <Search size={14} /> <span>Search</span>
      </Button>
      {search && (
        <Button type="button" variant="outline" onClick={handleClearSearch}>
          Clear
        </Button>
      )}
    </form>
  );
};

export default PriceMonitorSearch;
