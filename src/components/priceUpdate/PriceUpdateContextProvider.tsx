import React, { createContext, useState, ReactNode, useCallback } from 'react';

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
  addInitialFile: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  addErrorFile: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  isSale: boolean;
  setIsSale: React.Dispatch<React.SetStateAction<boolean>>;
  processInitialFle: () => void;
  processErrorFile: () => void;
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

  const addInitialFile = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      try {
        const files = Array.from(event.target.files || []);
        const newFile = files[0];

        setFile(files[0]);

        if (!newFile) {
          throw new Error('No file found', { cause: '' });
        }

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

        if (rawSkuIndex === undefined) {
          throw new Error('Unable to find column for Manufacturer SKU');
        }

        const rawContent = processedFile
          .slice(headerRowIndex)
          .filter((row) => row.length && row[rawSkuIndex as number]);

        const recommendedHeaders = getPriceUpdateHeaders(rawContent);

        setContent(rawContent);

        setRawHeaders(headers);
        setSelectedHeaders(recommendedHeaders);
      } catch (error) {
        console.log(error);
        processError('Error adding file', error);
      }
    },
    []
  );

  const addErrorFile = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      try {
        const files = Array.from(event.target.files || []);
        const newFile = files[0];

        setErrorFile(files[0]);

        if (!newFile) {
          throw new Error('No file found', { cause: '' });
        }

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
      } catch (error) {
        console.log(error);
        processError('Error adding file', error);
      }
    },
    [content, rawHeaders, selectedHeaders]
  );

  const createEntries = useCallback(
    (options: { skuIndex?: number; excludedSkus?: string[] } = {}) => {
      const { skuIndex, excludedSkus } = options;

      if (!content) {
        throw new Error('No file found');
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

      return entries;
    },
    [content, costMultiplier, isSale, note, selectedHeaders]
  );

  const processInitialFle = useCallback(() => {
    try {
      const entries = createEntries();

      downloadCSV(entries, 'Price-Update-Initial');
    } catch (error) {
      processError('Error processing supplier file.', error);
    }
  }, [createEntries]);

  const processErrorFile = useCallback(() => {
    try {
      if (!content || !errorRows) {
        throw new Error('Supplier file and error file is required.');
      }

      const excludedSkus = errorRows?.reduce((prev, { sku, toDelete }) => {
        if (toDelete) {
          return [...prev, sku];
        } else {
          return prev;
        }
      }, [] as string[]);

      const skuIndex = selectedHeaders?.find(({ key, label }) => {
        return key === 'manufacturerSku' || label === 'Manufacturer SKU';
      })?.index;

      if (skuIndex === undefined) {
        throw new Error(' Manufacturer SKU column not found.');
      }

      const entries = createEntries({ skuIndex, excludedSkus });

      downloadCSV(entries, 'Price-Update-Final');
    } catch (error) {
      processError('Error processing error file', error);
    }
  }, [content, createEntries, errorRows, selectedHeaders]);

  const addSelectedHeader = useCallback(
    (input: PriceUpdateHeader) => {
      const { index, label, key } = input;

      if (!rawHeaders) return;

      if (selectedHeaders?.find((s) => s.label === label)) {
        throw new Error('Column with same output name already exists.', {
          cause: 'Duplicate output name.',
        });
      }

      const newHeader = {
        ...rawHeaders[index],
        label,
        key,
      } as PriceUpdateHeader;

      setSelectedHeaders([...(selectedHeaders || []), newHeader]);
    },
    [rawHeaders, selectedHeaders]
  );

  const removeSelectedHeader = useCallback(
    (label: string) => {
      const newSelectedHeaders = selectedHeaders?.filter(
        (h) => h.label !== label
      );

      setSelectedHeaders(newSelectedHeaders);
    },
    [selectedHeaders]
  );

  const updateErrorRow = useCallback(
    (input: UpdateErrorRowInput) => {
      if (!errorRows) return;

      const { sku, toDelete } = input;
      const updatedErrorRows = [...errorRows];

      const errorRow = updatedErrorRows?.find((error) => error.sku === sku);

      if (errorRow) {
        errorRow.toDelete = toDelete;
      }

      setErrorRows(updatedErrorRows);
    },
    [errorRows]
  );

  const deleteErrorFile = useCallback(() => {
    setErrorFile(null);
    setErrorRows(undefined);
  }, []);

  const deleteInitialFile = useCallback(() => {
    setFile(null);
    setContent(undefined);
    setErrorFile(undefined);
    setErrorRows(undefined);
    setIsSale(false);
    setNote('');
    setRawHeaders(undefined);
    setSelectedHeaders(undefined);
  }, []);

  return (
    <PriceUpdateContext.Provider
      value={{
        file,
        addInitialFile,
        addErrorFile,
        isSale,
        setIsSale,
        processInitialFle,
        processErrorFile,
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
