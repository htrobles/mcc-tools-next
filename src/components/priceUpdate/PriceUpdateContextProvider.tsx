import React, { createContext, useCallback, useState, ReactNode } from 'react';

import { FileObj } from '@/types/fileTypes';
import { readExcelFile } from '@/utils/fileProcessors';
import getPriceUpdateHeaders, {
  containsSubstring,
  PriceUpdateHeader,
} from '@/utils/priceUpdate/getPriceUpdateHeaders';
import { downloadCSV } from '@/utils/supplyFeed/csvUtils';
import { processError } from '@/utils/helpers';

interface PriceUpdateContextType {
  file: FileObj | null | undefined;
  addFile: (
    event: React.ChangeEvent<HTMLInputElement>,
    isErrorFile?: boolean
  ) => Promise<void>;
  isSale: boolean;
  setIsSale: React.Dispatch<React.SetStateAction<boolean>>;
  processFile: (type?: 'initial' | 'error') => Promise<void>;
  errorFile: FileObj | null | undefined;
  rawHeaders: PriceUpdateHeader[] | undefined;
  selectedHeaders: PriceUpdateHeader[] | undefined;
}

export const PriceUpdateContext = createContext<
  PriceUpdateContextType | undefined
>(undefined);

export const PriceUpdateContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [file, setFile] = useState<FileObj | null>();
  const [errorFile, setErrorFile] = useState<FileObj | null>();
  const [isSale, setIsSale] = useState(false);
  const [rawHeaders, setRawHeaders] = useState<PriceUpdateHeader[]>();
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

  return (
    <PriceUpdateContext.Provider
      value={{
        file,
        addFile,
        isSale,
        setIsSale,
        processFile,
        errorFile,
        rawHeaders,
        selectedHeaders,
      }}
    >
      {children}
    </PriceUpdateContext.Provider>
  );
};
