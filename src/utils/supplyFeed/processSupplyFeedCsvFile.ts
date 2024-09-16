import { readCsvFile } from '../fileProcessors';
import { FileObj } from '@/types/fileTypes';
import { processSfmFile } from './vendorProcesses';

export const processSupplyFeedCsvFile = async (file: FileObj, test = false) => {
  const { vendor } = file;
  const content = await readCsvFile(file);

  if (!file.vendor) {
    throw new Error('All files should have vendors.');
  }

  let products: string[];

  switch (vendor) {
    case 'sfm':
      products = processSfmFile(content, test);
      break;
    default:
      products = [];
      break;
  }

  return products;
};
