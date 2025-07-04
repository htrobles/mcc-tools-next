'use client';

import React, { useState } from 'react';
import { PriceUpdateContextProvider } from '@/components/priceUpdate/PriceUpdateContextProvider';
import PriceUpdateStep1 from '@/components/priceUpdate/PriceUpdateStep1';
import PriceUpdateStep2 from '@/components/priceUpdate/PriceUpdateStep2';
import PriceUpdateFooterNav from '@/components/priceUpdate/PriceUpdateFooterNav';
import PageContainer from '@/components/PageContainer';

export default function PriceUpdatePage() {
  const [step, setStep] = useState(1);

  return (
    <PriceUpdateContextProvider>
      <PageContainer>
        {step === 1 && <PriceUpdateStep1 />}
        {step === 2 && <PriceUpdateStep2 />}
        <PriceUpdateFooterNav step={step} onUpdateStep={setStep} />
      </PageContainer>
    </PriceUpdateContextProvider>
  );
}
