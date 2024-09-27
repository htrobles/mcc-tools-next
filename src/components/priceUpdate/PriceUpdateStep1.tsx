import React, { ChangeEventHandler } from 'react';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { FileObj } from '@/types/fileTypes';

interface PriceUpdateStep1Props {
  onAddFile: ChangeEventHandler<HTMLInputElement>;
  file: FileObj | null | undefined;
  onProcessFile: () => void;
  isSale: boolean;
  onUpdateIsSale: (value: boolean) => void;
}

export default function PriceUpdateStep1({
  file,
  onAddFile,
  onProcessFile,
  isSale,
  onUpdateIsSale,
}: PriceUpdateStep1Props) {
  return (
    <div className="lg:px-10 space-y-5 border-b pb-10">
      <h3>Upload Supplier File</h3>
      <ol className="list-decimal ml-8">
        <li>Select supplier file.</li>
        <li>Toggle Sale On if the price update is for a sale.</li>
        <li>Download the initial file and proceed to next step.</li>
      </ol>
      <Input
        type="file"
        placeholder="Select a file"
        onChange={onAddFile}
        className="cursor-pointer"
      />
      <div className="flex items-center">
        <Switch
          id="is-sale"
          disabled={!file}
          checked={isSale}
          onCheckedChange={onUpdateIsSale}
          className="mr-2"
        />
        <label htmlFor="is-sale">Sale</label>
      </div>
      <div className="space-x-2 text-right">
        <Button onClick={onProcessFile} disabled={!file}>
          Download Initial File
        </Button>
      </div>
    </div>
  );
}
