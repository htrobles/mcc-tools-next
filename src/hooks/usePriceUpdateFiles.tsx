'use client';

import { FileObj } from '@/types/fileTypes';
import { useCallback, useState } from 'react';
import { toast } from './use-toast';
import { readExcelFile } from '@/utils/fileProcessors';
import getPriceUpdateHeaders, {
  containsSubstring,
  PriceUpdateHeader,
  validHeaders,
} from '@/utils/priceUpdate/getPriceUpdateHeaders';
import { downloadCSV } from '@/utils/supplyFeed/csvUtils';
import { processError } from '@/utils/helpers';

export default function usePriceUpdateFiles() {
  const [file, setFile] = useState<FileObj | null>();
  const [errorFile, setErrorFile] = useState<FileObj | null>();
  const [isSale, setIsSale] = useState(false);
  const [rawHeaders, setRawHeaders] =
    useState<{ index: number; value: string }[]>();
  const [selectedHeaders, setSelectedHeaders] = useState<PriceUpdateHeader[]>();
  const [content, setContent] = useState<string[][]>();

  const addFile = async (
    event: React.ChangeEvent<HTMLInputElement>,
    isErrorFile = false
  ) => {
    try {
      const files = Array.from(event.target.files || []);
      const newFile = files[0];

      if (isErrorFile) {
        setErrorFile(files[0]);
      } else {
        setFile(files[0]);
      }

      if (!newFile) {
        throw new Error('No file found', { cause: '' });
      }

      const processedFile = await readExcelFile(newFile);

      const headerRowIndex = processedFile.findIndex((r) =>
        r.find((value) => containsSubstring(value))
      );

      let headers = processedFile[headerRowIndex].map((value, index) => ({
        index,
        value,
      }));

      const content = processedFile
        .slice(headerRowIndex)
        .filter((row) => row.length);

      const recommendedHeaders = getPriceUpdateHeaders(content);
      headers = headers.filter(
        ({ value }) =>
          !recommendedHeaders.find((r) => {
            return r.value === value;
          })
      );

      setContent(content);
      setRawHeaders(headers);
      setSelectedHeaders(recommendedHeaders);
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

  const processFile = useCallback(
    async (type: 'initial' | 'error' = 'initial') => {
      try {
        if (!content) {
          throw new Error('No file found', { cause: '' });
        }

        const headers = getPriceUpdateHeaders(content);

        const columnIndexes = selectedHeaders?.map(({ index }) => index);

        // If type is error, remove problem rows

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
            output?.push('on-sale');
          }

          return output?.join(',');
        });

        const headerRowColumns = headers?.map((header) => header.label);

        if (isSale) {
          headerRowColumns.push('Add Tags');
        }

        const headerRow = headerRowColumns.join(',');

        const entries = [headerRow, ...rows].join('\n');

        downloadCSV(entries, 'price-update-test');
      } catch (error) {
        processError(
          `Error processing ${type === 'error' ? 'error' : 'supplier'} file`,
          error
        );
      }
    },
    [content, isSale]
  );

  return {
    file,
    addFile,
    deleteFile,
    isSale,
    setIsSale,
    processFile,
    errorFile,
    rawHeaders,
    selectedHeaders,
  };
}
