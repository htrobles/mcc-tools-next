import { readCsvFile } from '../fileProcessors';
import { FileObj } from '@/types/fileTypes';
import { processMccPriceUpdateFile, processSfmFile } from './vendorProcesses';

export const processSupplyFeedCsvFile = async (file: FileObj, test = false) => {
  const { vendor } = file;
  const content = (await readCsvFile(file)) as { [key: string]: string }[];

  if (!file.vendor) {
    throw new Error('All files should have vendors.');
  }

  let products: string[];

  switch (vendor) {
    case 'sfm':
      products = processSfmFile(content, test);
      break;
    case 'mcc':
      products = processMccPriceUpdateFile(content);
      break;
    default:
      products = [];
      break;
  }

  return products;
};
