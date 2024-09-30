'use client';

import PageLayout from '@/components/PageLayout';
import PriceUpdateStep1 from '@/components/priceUpdate/PriceUpdateStep1';
import PriceUpdateStep2 from '@/components/priceUpdate/PriceUpdateStep2';
import usePriceUpdateFiles from '@/hooks/usePriceUpdateFiles';
import React from 'react';

export default function PriceUpdatePage() {
  const { file, addFile, isSale, setIsSale, processFile, errorFile } =
    usePriceUpdateFiles();

  return (
    <PageLayout>
      <PriceUpdateStep1
        file={file}
        onAddFile={addFile}
        onProcessFile={processFile}
        isSale={isSale}
        onUpdateIsSale={setIsSale}
      />
      <PriceUpdateStep2
        errorFile={errorFile}
        onAddErrorFile={(files) => addFile(files, true)}
        onProcessErrorFile={() => processFile('error')}
      />
    </PageLayout>
  );
}
