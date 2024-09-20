'use client';

import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import usePriceUpdateFiles from '@/hooks/usePriceUpdateFiles';
import { readExcelFile } from '@/utils/fileProcessors';
import { processError } from '@/utils/helpers';
import getPriceUpdateHeaders from '@/utils/priceUpdate/getPriceUpdateHeaders';
import { downloadCSV } from '@/utils/supplyFeed/csvUtils';
import React, { useCallback, useState } from 'react';

export default function PriceUpdatePage() {
  const { file, addFile, deleteFile } = usePriceUpdateFiles();
  const [excludedTopRows, setExcludedTopRows] = useState(0);

  const handleAddFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = Array.from(event.target.files || []);
      addFile(files[0]);
    } catch (error) {
      processError('Error adding file', error);
    }
  };

  const handleUpdateExcludedRows = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value) {
      setExcludedTopRows(parseInt(value));
    } else {
      setExcludedTopRows(0);
    }
  };

  const handleProcessFile = useCallback(async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No file found',
        description: 'Please select a file.',
      });

      return;
    }

    const content = (await readExcelFile(file))
      .slice(excludedTopRows)
      .filter((row) => row.length);
    const headers = getPriceUpdateHeaders(content);
    const columnIndexes = headers?.map(({ index }) => index);

    const rows = content.slice(1).map((row) => {
      return columnIndexes?.map((i) => row[i]).join(',');
    });

    const headerRow = headers?.map((header) => header.label).join(',');

    const entries = [headerRow, ...rows].join('\n');

    downloadCSV(entries, 'price-update-test');
  }, [file, excludedTopRows]);

  return (
    <PageLayout>
      <div className="lg:px-10 space-y-5">
        <Input
          type="file"
          placeholder="Select a file"
          onChange={handleAddFile}
        />
        {!!file && (
          <>
            {/* <div className="flex space-x-2 items-center">
              <div>
                <FileIcon />
              </div>
              <div>{file?.name}</div>
              <div>
                <X
                  className="text-destructive hover:text-black transition-colors cursor-pointer"
                  onClick={deleteFile}
                />
              </div>
            </div> */}
            <div className="flex gap-x-2 items-center">
              <label htmlFor="excluded-rows">
                Number of top rows to exclude:
              </label>
              <Input
                id="excluded-rows"
                name="excludedRows"
                type="number"
                placeholder="Enter a number"
                value={excludedTopRows}
                onChange={handleUpdateExcludedRows}
                min={0}
                step={1}
                className="w-40"
              />
            </div>
          </>
        )}
        <div className="space-x-2 text-right">
          <Button variant="outline" onClick={deleteFile}>
            Clear
          </Button>
          <Button onClick={handleProcessFile}>Process</Button>
        </div>
      </div>
    </PageLayout>
  );
}
