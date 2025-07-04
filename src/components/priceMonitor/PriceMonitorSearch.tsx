'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';

const PriceMonitorSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);

    if (search.trim()) {
      params.set('search', search.trim());
    } else {
      params.delete('search');
    }

    // Reset to page 1 when searching
    params.delete('page');

    router.push(`/price-monitor?${params.toString()}`);
  };

  const handleClear = () => {
    setSearch('');
    const params = new URLSearchParams(searchParams);
    params.delete('search');
    params.delete('page');
    router.push(`/price-monitor?${params.toString()}`);
  };

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
        <Button type="button" variant="outline" onClick={handleClear}>
          Clear
        </Button>
      )}
    </form>
  );
};

export default PriceMonitorSearch;
