import React from 'react';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import usePriceUpdate from '@/hooks/usePriceUpdate';
import PriceUpdateHeadersList from './PriceUpdateHeadersList';

export default function PriceUpdateStep1() {
  const {
    initialFile,
    addInitialFile,
    isSale,
    setIsSale,
    processInitialFle,
    note,
    setNote,
    deleteInitialFile,
    costMultiplier,
    setCostMultiplier,
  } = usePriceUpdate();

  return (
    <div className="space-y-5 mb-10">
      <h3>Upload Supplier File</h3>
      <ol className="list-decimal ml-8">
        <li>Select supplier file.</li>
        <li>
          Check the columns that will be added to output file. Add or remove
          columns if needed.
        </li>
        <li>Toggle Sale switch ON if the price update is for a sale.</li>
        <li>Optional: Add notes which will be added to all product rows</li>
        <li>Download the initial file and upload it to Lightspeed.</li>
      </ol>
      {!!initialFile ? (
        <div>
          {initialFile.name}
          <Button
            variant="outline"
            className="ml-2"
            size="sm"
            onClick={deleteInitialFile}
          >
            Clear
          </Button>
        </div>
      ) : (
        <Input
          type="file"
          placeholder="Select a file"
          onChange={addInitialFile}
          className="cursor-pointer"
        />
      )}
      <PriceUpdateHeadersList />
      {!!initialFile && (
        <div className="border-t py-4 space-y-5">
          <div className="flex items-center">
            <Switch
              id="is-sale"
              disabled={!initialFile}
              checked={isSale}
              onCheckedChange={setIsSale}
              className="mr-2"
            />
            <label htmlFor="is-sale">Sale</label>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="notes">Add Notes (optional)</label>
              <Input
                placeholder="Enter note"
                className="bg-white"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                disabled={!initialFile}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="costMultiplier">
                Cost Multiplier (If Sale Price is absent)
              </label>
              <Input
                placeholder="Enter multiplier value"
                className="bg-white"
                type="number"
                min={1}
                step={0.01}
                value={costMultiplier}
                onChange={(e) => setCostMultiplier(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="space-x-2 text-right">
            <Button
              variant="outline"
              onClick={processInitialFle}
              disabled={!initialFile}
            >
              Generate Initial File
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
