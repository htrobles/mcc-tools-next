import React, { useCallback, useContext } from 'react';

import { readExcelFile } from '@/utils/fileProcessors';
import { getPriceUpdateHeaders } from '@/utils/priceUpdate/priceUpdateHeaderUtils';
import { downloadCSV } from '@/utils/supplyFeed/csvUtils';
import { processError } from '@/utils/helpers';
import {
  PriceUpdateContext,
  PriceUpdateErrorAction,
  PriceUpdateErrorRowType,
} from '@/components/priceUpdate/PriceUpdateContextProvider';
import {
  PriceUpdateHeader,
  PriceUpdateHeaderKey,
} from '@/types/priceUpdateTypes';
import {
  DESCRIPTION_LABELS,
  VALID_HEADER_MAP,
  VALID_HEADERS,
} from '@/constants/priceUpdates/priceUpdateConstants';

interface UpdateErrorRowInput {
  sku: string;
  action?: PriceUpdateErrorAction;
}

export default function usePriceUpdate() {
  const context = useContext(PriceUpdateContext);

  if (!context) {
    throw new Error('usePriceUpdate must be used within a PriceUpdateContext');
  }

  const {
    content,
    note,
    costMultiplier,
    rawHeaders,
    selectedHeaders,
    errorRows,
    isSale,
    setRawHeaders,
    setSelectedHeaders,
    setInitialFile,
    setErrorFile,
    setContent,
    setNote,
    setErrorRows,
    setIsSale,
  } = context;

  const addInitialFile = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      try {
        const files = Array.from(event.target.files || []);
        const newFile = files[0];

        setInitialFile(files[0]);

        if (!newFile) {
          throw new Error('No file found', { cause: '' });
        }

        const processedFile = await readExcelFile(newFile);

        const headerRowIndex = processedFile.findIndex((r) =>
          r.find((cell) => cell && VALID_HEADER_MAP[cell.trim().toLowerCase()])
        );

        const headers = processedFile[headerRowIndex].map((value, index) => ({
          index,
          value,
        }));

        const rawSkuIndex = headers?.find((h) => {
          return VALID_HEADERS.find(
            (h) => h.key === PriceUpdateHeaderKey.MANUFACTURER_SKU
          )?.values.includes(h?.value?.trim().toLowerCase());
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
    [setContent, setInitialFile, setRawHeaders, setSelectedHeaders]
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

        // const processedFile = await readCsvFile(newFile);
        const processedFile = await readExcelFile(newFile);

        let descriptionIndex = rawHeaders?.findIndex(
          (h) => h?.value?.toLowerCase() === 'description'
        );

        if (!descriptionIndex) {
          descriptionIndex = rawHeaders?.findIndex((h) => {
            if (h?.value) {
              return DESCRIPTION_LABELS.includes(h.value?.toLowerCase());
            }
          });
        }

        const rawSkuIndex = selectedHeaders?.find(
          (h) =>
            h.label.toLowerCase().includes('sku') ||
            h.key === PriceUpdateHeaderKey.MANUFACTURER_SKU
        )?.index;

        const errorIndex = processedFile[0].findIndex(
          (cell) => cell === 'Errors'
        );
        const skuIndex = processedFile[0].findIndex(
          (cell) => cell === 'Manufacturer SKU'
        );

        if (errorIndex < 0) {
          throw new Error(
            'Errors column not found. Please submit a valid error file'
          );
        }

        if (skuIndex < 0) {
          throw new Error(
            'Manufacturer SKU column not found. Please submit a valid error file'
          );
        }

        const newErrorRows: PriceUpdateErrorRowType[] = processedFile
          .splice(1)
          .filter((row) => !!row[errorIndex] && !!row[skuIndex])
          .map((row) => {
            const error = row[errorIndex];
            const sku = row[skuIndex];

            let description = '';

            if (rawSkuIndex && descriptionIndex) {
              const productRow = content?.find((r) => r[rawSkuIndex] === sku);
              description = productRow ? productRow[descriptionIndex] : '';
            }

            return { error, sku, description, action: 'add-product' };
          });

        setErrorRows(newErrorRows);
      } catch (error) {
        console.log(error);
        processError('Error adding file', error);
      }
    },
    [content, rawHeaders, selectedHeaders, setErrorFile, setErrorRows]
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
        !selectedHeaders.find((h) => h.label === VALID_HEADERS[0].label) ||
        !selectedHeaders.find((h) => h.label === VALID_HEADERS[4].label)
      ) {
        throw new Error(
          'Manufacturer SKU and Default Cost columns are required.'
        );
      }

      const columnIndexes = selectedHeaders?.map(({ index }) => index);
      const defaultPriceIndex = selectedHeaders.find(
        ({ key }) => key === PriceUpdateHeaderKey.DEFAULT_PRICE
      )?.index;
      const salePriceIndex = selectedHeaders.find(
        ({ key }) => key === PriceUpdateHeaderKey.SALE_PRICE
      )?.index;
      const defaultCostIndex = selectedHeaders.find(
        ({ key }) => key === PriceUpdateHeaderKey.DEFAULT_COST
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

      const excludedSkus = errorRows?.reduce((prev, { sku, action }) => {
        if (action !== 'ignore') {
          return [...prev, sku];
        } else {
          return prev;
        }
      }, [] as string[]);

      const skuIndex = selectedHeaders?.find(({ key, label }) => {
        return (
          key === PriceUpdateHeaderKey.MANUFACTURER_SKU ||
          label === 'Manufacturer SKU'
        );
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
    [rawHeaders, selectedHeaders, setSelectedHeaders]
  );

  const removeSelectedHeader = useCallback(
    (label: string) => {
      const newSelectedHeaders = selectedHeaders?.filter(
        (h) => h.label !== label
      );

      setSelectedHeaders(newSelectedHeaders);
    },
    [selectedHeaders, setSelectedHeaders]
  );

  const updateErrorRow = useCallback(
    (input: UpdateErrorRowInput) => {
      if (!errorRows) return;

      const { sku, action } = input;
      const updatedErrorRows = [...errorRows];

      const errorRow = updatedErrorRows?.find((error) => error.sku === sku);

      if (errorRow) {
        errorRow.action = action;
      }

      setErrorRows(updatedErrorRows);
    },
    [errorRows, setErrorRows]
  );

  const deleteErrorFile = useCallback(() => {
    setErrorFile(null);
    setErrorRows(undefined);
  }, [setErrorFile, setErrorRows]);

  const deleteInitialFile = useCallback(() => {
    setInitialFile(null);
    setContent(undefined);
    setErrorFile(undefined);
    setErrorRows(undefined);
    setIsSale(false);
    setNote('');
    setRawHeaders(undefined);
    setSelectedHeaders(undefined);
  }, [
    setInitialFile,
    setContent,
    setErrorFile,
    setErrorRows,
    setIsSale,
    setNote,
    setRawHeaders,
    setSelectedHeaders,
  ]);

  return {
    ...context,
    addInitialFile,
    addErrorFile,
    processInitialFle,
    processErrorFile,
    addSelectedHeader,
    removeSelectedHeader,
    updateErrorRow,
    deleteErrorFile,
    deleteInitialFile,
  };
}
