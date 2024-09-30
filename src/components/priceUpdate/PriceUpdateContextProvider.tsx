import React, { createContext, useState, ReactNode } from 'react';

import { FileObj } from '@/types/fileTypes';
import { readCsvFile, readExcelFile } from '@/utils/fileProcessors';
import {
  getPriceUpdateHeaders,
  containsSubstring,
  PriceUpdateHeader,
} from '@/utils/priceUpdate/priceUpdateHeaderUtils';
import { downloadCSV } from '@/utils/supplyFeed/csvUtils';
import { processError } from '@/utils/helpers';

export interface AddSelectedHeaderInput {
  index: number;
  label: string;
}

export const PriceUpdateContext = createContext<
  PriceUpdateContextType | undefined
>(undefined);

export type ErrorAction = 'update' | 'delete';

interface ErrorRowType {
  sku: string;
  error: string;
  action?: ErrorAction;
  updatedSku?: string;
}

interface UpdateErrorRowInput {
  sku: string;
  action: ErrorAction;
  updatedSku?: string;
}

interface PriceUpdateContextType {
  file?: FileObj | null;
  addFile: (
    event: React.ChangeEvent<HTMLInputElement>,
    isErrorFile?: boolean
  ) => Promise<void>;
  isSale: boolean;
  setIsSale: React.Dispatch<React.SetStateAction<boolean>>;
  processFile: (type?: 'initial' | 'error') => Promise<void>;
  errorFile?: FileObj | null;
  rawHeaders?: Partial<PriceUpdateHeader>[];
  selectedHeaders?: PriceUpdateHeader[];
  addSelectedHeader: (input: AddSelectedHeaderInput) => void;
  removeSelectedHeader: (label: string) => void;
  note?: string;
  setNote: (value: string) => void;
  errorRows?: ErrorRowType[];
  updateErrorRow: (input: UpdateErrorRowInput) => void;
}

export const PriceUpdateContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [file, setFile] = useState<FileObj | null>();
  const [errorFile, setErrorFile] = useState<FileObj | null>();
  const [isSale, setIsSale] = useState(false);
  const [rawHeaders, setRawHeaders] = useState<Partial<PriceUpdateHeader>[]>();
  const [selectedHeaders, setSelectedHeaders] = useState<PriceUpdateHeader[]>();
  const [content, setContent] = useState<string[][]>();
  const [note, setNote] = useState<string>('');
  // Error
  const [errorRows, setErrorRows] = useState<ErrorRowType[]>();

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

      if (isErrorFile) {
        const processedFile = await readCsvFile(newFile);
        const newErrorRows = processedFile
          .filter((row) => !!row['Errors'])
          .map((row) => {
            const error = row['Errors'];
            const sku = row['Manufacturer SKU'];

            return { error, sku };
          });

        setErrorRows(newErrorRows);
      } else {
        const processedFile = await readExcelFile(newFile);

        const headerRowIndex = processedFile.findIndex((r) =>
          r.find((value) => containsSubstring(value))
        );

        const headers = processedFile[headerRowIndex].map((value, index) => ({
          index,
          value,
        }));

        const rawContent = processedFile
          .slice(headerRowIndex)
          .filter((row) => row.length);

        const recommendedHeaders = getPriceUpdateHeaders(rawContent);

        setContent(rawContent);

        setRawHeaders(headers);
        setSelectedHeaders(recommendedHeaders);
      }
    } catch (error) {
      processError('Error adding file', error);
    }
  };

  const processFile = async (type: 'initial' | 'error' = 'initial') => {
    try {
      if (!content) {
        throw new Error('No file found');
      }

      if (type === 'error' && (!content || !errorRows)) {
        throw new Error('Supplier file and error file is required.');
      }

      if (!selectedHeaders) {
        throw new Error('Please add headers neeaded to create the file');
      }

      const columnIndexes = selectedHeaders?.map(({ index }) => index);

      // If type is error, remove problem rows
      console.log(errorRows);

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

        if (note) {
          output.push(note);
        }

        return output?.join(',');
      });

      const headerRowColumns = selectedHeaders.map((header) => header.label);

      if (isSale) {
        headerRowColumns.push('Add Tags');
      }

      if (note) {
        headerRowColumns.push('Notes');
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
  };

  const addSelectedHeader = (input: AddSelectedHeaderInput) => {
    const { index, label } = input;

    if (!rawHeaders) return;

    if (selectedHeaders?.find((s) => s.label === label)) {
      throw new Error('Column with same output name already exists.', {
        cause: 'Duplicate output name.',
      });
    }

    const newHeader = { ...rawHeaders[index], label } as PriceUpdateHeader;

    setSelectedHeaders([...(selectedHeaders || []), newHeader]);
  };

  const removeSelectedHeader = (label: string) => {
    const newSelectedHeaders = selectedHeaders?.filter(
      (h) => h.label !== label
    );

    setSelectedHeaders(newSelectedHeaders);
  };

  const updateErrorRow = (input: UpdateErrorRowInput) => {
    if (!errorRows) return;

    const { sku, action, updatedSku } = input;
    const updatedErrorRows = [...errorRows];

    const errorRow = updatedErrorRows?.find((error) => error.sku === sku);

    if (errorRow) {
      errorRow.action = action;
      errorRow.updatedSku = updatedSku;
    }

    setErrorRows(updatedErrorRows);
  };

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
        addSelectedHeader,
        removeSelectedHeader,
        note,
        setNote,
        errorRows,
        updateErrorRow,
      }}
    >
      {children}
    </PriceUpdateContext.Provider>
  );
};
