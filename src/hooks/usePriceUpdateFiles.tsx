'use client';

import { FileObj } from '@/types/fileTypes';
import { useCallback, useState } from 'react';
import { toast } from './use-toast';
import { readExcelFile } from '@/utils/fileProcessors';
import getPriceUpdateHeaders, {
  validHeaders,
} from '@/utils/priceUpdate/getPriceUpdateHeaders';
import { downloadCSV } from '@/utils/supplyFeed/csvUtils';
import { processError } from '@/utils/helpers';

export default function usePriceUpdateFiles() {
  const [file, setFile] = useState<FileObj | null>();
  const [isSale, setIsSale] = useState(false);

  const addFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = Array.from(event.target.files || []);
      setFile(files[0]);
    } catch (error) {
      processError('Error adding file', error);
    }
  };

  const deleteFile = () => {
    setFile(null);
  };

  //   const updateVendor = (fileName: string, vendor: VendorKey) => {
  //     const newFiles = [...files];
  //     const selectedFile = newFiles.find((file) => file.name === fileName);

  //     if (selectedFile) {
  //       selectedFile.vendor = vendor;
  //     }

  //     setFiles(newFiles);
  //   };

  const processFile = useCallback(async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No file found',
        description: 'Please select a file.',
      });

      return;
    }

    const processedFile = await readExcelFile(file);

    const headerRowIndex = processedFile.findIndex((r) =>
      r.find((value) => validHeaders[0].values.includes(value))
    );

    const content = processedFile
      .slice(headerRowIndex)
      .filter((row) => row.length);

    console.log(content);

    const headers = getPriceUpdateHeaders(content);

    console.log({ headers });
    const columnIndexes = headers?.map(({ index }) => index);

    const rows = content.slice(1).map((row) => {
      const output = columnIndexes?.map((i) => {
        const cell = row[i];

        if (isNaN(parseFloat(cell))) {
          return row[i];
        } else {
          return parseFloat(cell).toFixed(2);
        }
      });

      if (isSale) {
        output.push('on-sale');
      }

      return output.join(',');
    });

    const headerRowColumns = headers?.map((header) => header.label);

    if (isSale) {
      headerRowColumns.push('Add Tags');
    }

    const headerRow = headerRowColumns.join(',');

    const entries = [headerRow, ...rows].join('\n');

    downloadCSV(entries, 'price-update-test');
  }, [file, isSale]);

  return { file, addFile, deleteFile, isSale, setIsSale, processFile };
}
