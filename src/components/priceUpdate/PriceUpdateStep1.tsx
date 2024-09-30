import React from 'react';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import usePriceUpdate from '@/hooks/usePriceUpdate';
import PriceUpdateHeadersList from './PriceUpdateHeadersList';

export default function PriceUpdateStep1() {
  const { file, addFile, isSale, setIsSale, processFile } = usePriceUpdate();

  return (
    <div className="lg:px-10 space-y-5 border-b pb-10">
      <h3>Upload Supplier File</h3>
      <ol className="list-decimal ml-8">
        <li>Select supplier file.</li>
        <li>Toggle Sale On if the price update is for a sale.</li>
        <li>Download the initial file and upload it to Lightspeed.</li>
      </ol>
      <Input
        type="file"
        placeholder="Select a file"
        onChange={addFile}
        className="cursor-pointer"
      />
      <div className="flex items-center">
        <Switch
          id="is-sale"
          disabled={!file}
          checked={isSale}
          onCheckedChange={setIsSale}
          className="mr-2"
        />
        <label htmlFor="is-sale">Sale</label>
      </div>
      <PriceUpdateHeadersList />
      <div className="space-x-2 text-right">
        <Button onClick={() => processFile()} disabled={!file}>
          Download Initial File
        </Button>
      </div>
    </div>
  );
}
