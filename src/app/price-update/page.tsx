'use client';

import React, { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { PriceUpdateContextProvider } from '@/components/priceUpdate/PriceUpdateContextProvider';
import PriceUpdateStep1 from '@/components/priceUpdate/PriceUpdateStep1';
import PriceUpdateStep2 from '@/components/priceUpdate/PriceUpdateStep2';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import usePriceUpdate from '@/hooks/usePriceUpdate';
import PriceUpdateFooterNav from '@/components/priceUpdate/PriceUpdateFooterNav';

export default function PriceUpdatePage() {
  const [step, setStep] = useState(1);

  return (
    <PageLayout>
      <PriceUpdateContextProvider>
        {step === 1 && <PriceUpdateStep1 />}
        {step === 2 && <PriceUpdateStep2 />}
        <PriceUpdateFooterNav step={step} onUpdateStep={setStep} />
      </PriceUpdateContextProvider>
    </PageLayout>
  );
}
