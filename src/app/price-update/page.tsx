'use client';

import PageLayout from '@/components/PageLayout';
import { PriceUpdateContextProvider } from '@/components/priceUpdate/PriceUpdateContextProvider';
import PriceUpdateStep1 from '@/components/priceUpdate/PriceUpdateStep1';
import PriceUpdateStep2 from '@/components/priceUpdate/PriceUpdateStep2';
import React from 'react';

export default function PriceUpdatePage() {
  return (
    <PageLayout>
      <PriceUpdateContextProvider>
        <PriceUpdateStep1 />
        <PriceUpdateStep2 />
      </PriceUpdateContextProvider>
    </PageLayout>
  );
}
