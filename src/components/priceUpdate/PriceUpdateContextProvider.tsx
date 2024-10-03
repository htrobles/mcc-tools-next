import React, { createContext, useState, ReactNode } from 'react';

import { FileObj } from '@/types/fileTypes';
import { readCsvFile, readExcelFile } from '@/utils/fileProcessors';
import {
  getPriceUpdateHeaders,
  PriceUpdateHeader,
  DESCRIPTION_LABELS,
  validHeaderMap,
  validHeaders,
} from '@/utils/priceUpdate/priceUpdateHeaderUtils';
import { downloadCSV } from '@/utils/supplyFeed/csvUtils';
import { processError } from '@/utils/helpers';

export const PriceUpdateContext = createContext<
  PriceUpdateContextType | undefined
>(undefined);

export interface PriceUpdateErrorRowType {
  sku: string;
  error: string;
  description?: string;
  toDelete?: boolean;
}

interface UpdateErrorRowInput {
  sku: string;
  toDelete?: boolean;
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
  addSelectedHeader: (input: PriceUpdateHeader) => void;
  removeSelectedHeader: (label: string) => void;
  note?: string;
  setNote: (value: string) => void;
  errorRows?: PriceUpdateErrorRowType[];
  updateErrorRow: (input: UpdateErrorRowInput) => void;
  deleteErrorFile: () => void;
  deleteInitialFile: () => void;
  costMultiplier: number;
  setCostMultiplier: (value: number) => void;
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
  const [costMultiplier, setCostMultiplier] = useState(1.4);

  // Error
  const [errorRows, setErrorRows] = useState<PriceUpdateErrorRowType[]>();

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

        const descriptionIndex = rawHeaders?.findIndex((h) => {
          if (h?.value) {
            return DESCRIPTION_LABELS.includes(h.value?.toLowerCase());
          }
        });

        const rawSkuIndex = selectedHeaders?.find(
          (h) =>
            h.label.toLowerCase().includes('sku') || h.key === 'manufacturerSku'
        )?.index;

        const newErrorRows: PriceUpdateErrorRowType[] = processedFile
          .filter((row) => !!row['Errors'] && !!row['Manufacturer SKU'])
          .map((row) => {
            const error = row['Errors'];
            const sku = row['Manufacturer SKU'];

            let description = '';

            if (rawSkuIndex && descriptionIndex) {
              const productRow = content?.find((r) => r[rawSkuIndex] === sku);
              description = productRow ? productRow[descriptionIndex] : '';
            }

            return { error, sku, description, toDelete: true };
          });

        setErrorRows(newErrorRows);
      } else {
        const processedFile = await readExcelFile(newFile);

        const headerRowIndex = processedFile.findIndex((r) =>
          r.find((cell) => cell && validHeaderMap[cell.trim().toLowerCase()])
        );

        const headers = processedFile[headerRowIndex].map((value, index) => ({
          index,
          value,
        }));

        const rawSkuIndex = headers?.find((h) => {
          return validHeaders
            .find((h) => h.key === 'manufacturerSku')
            ?.values.includes(h?.value?.trim().toLowerCase());
        })?.index;

        if (!rawSkuIndex) {
          throw new Error('Unable to find column for Manufacturer SKU');
        }

        const rawContent = processedFile
          .slice(headerRowIndex)
          .filter((row) => row.length && row[rawSkuIndex as number]);

        const recommendedHeaders = getPriceUpdateHeaders(rawContent);

        setContent(rawContent);

        setRawHeaders(headers);
        setSelectedHeaders(recommendedHeaders);
      }
    } catch (error) {
      console.log(error);
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

      if (
        !selectedHeaders.find((h) => h.label === validHeaders[0].label) ||
        !selectedHeaders.find((h) => h.label === validHeaders[4].label)
      ) {
        throw new Error(
          'Manufacturer SKU and Default Cost columns are required.'
        );
      }

      // If type is error, remove problem rows
      const excludedSkus = errorRows?.reduce((prev, { sku, toDelete }) => {
        if (toDelete) {
          return [...prev, sku];
        } else {
          return prev;
        }
      }, [] as string[]);

      const skuIndex = selectedHeaders.find(
        ({ key, label }) =>
          key === 'manufacturerSku' || label === 'Manufacturer SKU'
      )?.index;

      const columnIndexes = selectedHeaders?.map(({ index }) => index);
      const defaultPriceIndex = selectedHeaders.find(
        ({ key }) => key === 'defaultPrice'
      )?.index;
      const salePriceIndex = selectedHeaders.find(
        ({ key }) => key === 'salePrice'
      )?.index;
      const defaultCostIndex = selectedHeaders.find(
        ({ key }) => key === 'defaultCost'
      )?.index;

      // HEADERS
      const headerRowColumns = selectedHeaders.map((header) => header.label);

      if (!defaultPriceIndex) {
        headerRowColumns.push('Default Price');
      }

      if (!salePriceIndex) {
        headerRowColumns.push('Sale Price');
      }

      if (isSale) {
        headerRowColumns.push('Add Tags');
      }

      if (note) {
        headerRowColumns.push('Notes');
      }

      const headerRow = headerRowColumns.join(',');

      // ROWS
      const rows = content.slice(1).reduce((prev, row) => {
        if (skuIndex && excludedSkus?.find((sku) => sku === row[skuIndex])) {
          return prev;
        }

        let defaultPrice: number | undefined;

        const output = columnIndexes?.map((i) => {
          let cell: string | number = row[i];

          if (
            i === defaultPriceIndex &&
            defaultCostIndex &&
            (!cell || isNaN(Number(cell)))
          ) {
            cell = Number(row[defaultCostIndex]) * costMultiplier;
            defaultPrice = cell;
          } else if (
            i === salePriceIndex &&
            (!cell || isNaN(Number(cell))) &&
            defaultCostIndex
          ) {
            if (defaultPrice) {
              cell = defaultPrice;
            } else {
              cell = Number(row[defaultCostIndex]) * costMultiplier;
            }
          }

          return isNaN(Number(cell)) ? cell : Number(cell).toFixed(2);
        });

        if (!defaultPriceIndex && defaultCostIndex) {
          const cell = Number(row[defaultCostIndex]) * costMultiplier;
          defaultPrice = cell;
          output.push(cell);
        }

        if (!salePriceIndex) {
          let cell;
          if (defaultPrice) {
            cell = defaultPrice;
            output.push(cell);
          } else if (defaultCostIndex) {
            cell = Number(row[defaultCostIndex]) * costMultiplier;
            output.push(cell);
          }
        }

        if (isSale) {
          output?.push('on-sale');
        }

        if (note) {
          output.push(note);
        }

        return [...prev, output?.join(',')];
      }, [] as string[]);

      const entries = [headerRow, ...rows].join('\n');

      downloadCSV(entries, 'price-update-test');
    } catch (error) {
      processError(
        `Error processing ${type === 'error' ? 'error' : 'supplier'} file`,
        error
      );
    }
  };

  const addSelectedHeader = (input: PriceUpdateHeader) => {
    const { index, label, key } = input;

    if (!rawHeaders) return;

    if (selectedHeaders?.find((s) => s.label === label)) {
      throw new Error('Column with same output name already exists.', {
        cause: 'Duplicate output name.',
      });
    }

    const newHeader = { ...rawHeaders[index], label, key } as PriceUpdateHeader;

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

    const { sku, toDelete } = input;
    const updatedErrorRows = [...errorRows];

    const errorRow = updatedErrorRows?.find((error) => error.sku === sku);

    if (errorRow) {
      errorRow.toDelete = toDelete;
    }

    setErrorRows(updatedErrorRows);
  };

  const deleteErrorFile = () => {
    setErrorFile(null);
    setErrorRows(undefined);
  };

  const deleteInitialFile = () => {
    setFile(null);
    setContent(undefined);
    setErrorFile(undefined);
    setErrorRows(undefined);
    setIsSale(false);
    setNote('');
    setRawHeaders(undefined);
    setSelectedHeaders(undefined);
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
        deleteErrorFile,
        deleteInitialFile,
        costMultiplier,
        setCostMultiplier,
      }}
    >
      {children}
    </PriceUpdateContext.Provider>
  );
};
