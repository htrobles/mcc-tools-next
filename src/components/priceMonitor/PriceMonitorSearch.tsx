'use client';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';
import { usePriceMonitorSearch } from '@/lib/priceMonitor/contexts/PriceMonitorSearchContext';

const PriceMonitorSearch = () => {
  const {
    search,
    setSearch,
    handleSearch,
    handleClearSearch,
    selectedBrand,
    selectedCategory,
  } = usePriceMonitorSearch();

  const showClearButton = search || selectedBrand || selectedCategory;

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
      {showClearButton && (
        <Button type="button" variant="outline" onClick={handleClearSearch}>
          Clear
        </Button>
      )}
    </form>
  );
};

export default PriceMonitorSearch;
