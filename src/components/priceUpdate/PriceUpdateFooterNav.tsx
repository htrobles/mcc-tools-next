import React from 'react';
import { Button } from '../ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import usePriceUpdate from '@/hooks/usePriceUpdate';

interface PriceUpdateFooterNavProps {
  step: number;
  onUpdateStep: (step: number) => void;
}

export default function PriceUpdateFooterNav({
  step,
  onUpdateStep,
}: PriceUpdateFooterNavProps) {
  const { initialFile } = usePriceUpdate();

  return (
    <div className="flex justify-between">
      <Button
        className={step === 1 ? 'invisible' : ''}
        onClick={() => onUpdateStep(step - 1 || 1)}
      >
        <ChevronLeftIcon />
        Previous
      </Button>
      <Button
        className={step === 2 ? 'invisible' : ''}
        disabled={!initialFile}
        onClick={() => onUpdateStep(step + 1)}
      >
        Next
        <ChevronRightIcon />
      </Button>
    </div>
  );
}
