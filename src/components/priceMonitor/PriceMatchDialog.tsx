'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface PriceMatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (matchType: 'percentage' | 'flat', value: number) => void;
  selectedProductsCount?: number;
}

export function PriceMatchDialog({
  open,
  onOpenChange,
  onConfirm,
  selectedProductsCount = 0,
}: PriceMatchDialogProps) {
  const [matchType, setMatchType] = useState<'percentage' | 'flat'>(
    'percentage'
  );
  const [percentageValue, setPercentageValue] = useState(1);
  const [flatValue, setFlatValue] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const value = matchType === 'percentage' ? percentageValue : flatValue;
      await onConfirm(matchType, value);
      onOpenChange(false);
    } catch (error) {
      console.error('Error applying price match:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Price Match Configuration</DialogTitle>
          <DialogDescription>
            Configure how you want to match competitor prices for{' '}
            <span className="font-semibold">{selectedProductsCount}</span>{' '}
            selected product(s).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Match Type Toggle */}
            <div className="flex items-center justify-between">
              <Label htmlFor="match-type" className="text-sm font-medium">
                Match Type
              </Label>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  Flat Amount
                </span>
                <Switch
                  id="match-type"
                  checked={matchType === 'percentage'}
                  onCheckedChange={(checked) =>
                    setMatchType(checked ? 'percentage' : 'flat')
                  }
                />
                <span className="text-sm text-muted-foreground">
                  Percentage
                </span>
              </div>
            </div>

            {/* Percentage Input */}
            {matchType === 'percentage' && (
              <div className="space-y-2">
                <Label htmlFor="percentage-value">
                  Reduce price by percentage
                </Label>
                <div className="relative">
                  <Input
                    id="percentage-value"
                    type="number"
                    min="0.01"
                    max="100"
                    step="0.01"
                    value={percentageValue}
                    onChange={(e) =>
                      setPercentageValue(parseFloat(e.target.value) || 0)
                    }
                    className="pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    %
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your price will be {percentageValue}% lower than the
                  competitor price
                </p>
              </div>
            )}

            {/* Flat Amount Input */}
            {matchType === 'flat' && (
              <div className="space-y-2">
                <Label htmlFor="flat-value">Reduce price by amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="flat-value"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={flatValue}
                    onChange={(e) =>
                      setFlatValue(parseFloat(e.target.value) || 0)
                    }
                    className="pl-6"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Your price will be ${flatValue.toFixed(2)} lower than the
                  competitor price
                </p>
              </div>
            )}

            <div className="space-y-2">
              <h2 className="text-sm font-medium">Instructions</h2>
              <p className="text-xs text-muted-foreground">
                This will match the price of the selected products to the price
                of the competitor.
              </p>
              <ol className="list-decimal list-inside text-xs text-muted-foreground space-y-1">
                <li>
                  Select the match type (percentage or flat amount) and enter
                  the value.
                </li>
                <li>
                  Click the &apos;Apply Price Match&apos; button to apply the
                  price match to the selected products.
                </li>
                <li>Download the CSV file to see the results.</li>
                <li>Import the CSV File in Lightspeed</li>
              </ol>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                (matchType === 'percentage' && percentageValue <= 0) ||
                (matchType === 'flat' && flatValue <= 0) ||
                selectedProductsCount === 0
              }
            >
              {isSubmitting ? 'Applying...' : 'Apply Price Match'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
