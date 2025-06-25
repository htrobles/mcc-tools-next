'use client';

import { ExitIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';

const PriceMonitorProductHeader = ({ title }: { title: string }) => {
  const router = useRouter();

  return (
    <div className="flex items-center gap-x-2">
      <button onClick={() => router.back()}>
        <ExitIcon className="w-4 h-4" />
      </button>
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
  );
};

export default PriceMonitorProductHeader;
