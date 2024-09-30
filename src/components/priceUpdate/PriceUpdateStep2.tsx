import React, { ChangeEventHandler } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { FileObj } from '@/types/fileTypes';

interface PriceUpdateStep2Props {
  onAddErrorFile: ChangeEventHandler<HTMLInputElement>;
  errorFile: FileObj | null | undefined;
  onProcessErrorFile: () => void;
}

export default function PriceUpdateStep2({
  onAddErrorFile,
  onProcessErrorFile,
  errorFile,
}: PriceUpdateStep2Props) {
  return (
    <div className="lg:px-10 space-y-5 border-b py-10 pointer-events-none">
      <h3>Select Error File</h3>
      <ol className="list-decimal ml-8">
        <li>Select error file from Lightspeed.</li>
        <li>Review errors</li>
        <li>Download the updated file.</li>
      </ol>
      <Input
        type="file"
        placeholder="Select a file"
        onChange={onAddErrorFile}
        className="cursor-pointer"
      />

      <div className="space-x-2 text-right">
        <Button onClick={onProcessErrorFile} disabled={!errorFile}>
          Download Error Free File
        </Button>
      </div>
    </div>
  );
}
