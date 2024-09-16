import { readExcelFile } from '../fileProcessors';
import {
  processFenderFile,
  processHoshinoFile,
  processSabianFile,
} from './vendorProcesses';
import { FileObj } from '@/types/fileTypes';

export const processSupplyFeedExcelFile = async (
  file: FileObj,
  test = false
) => {
  const { vendor } = file;

  let content: string[][];

  switch (vendor) {
    case 'sabian':
      content = await readExcelFile(file, [0, 1]);
      break;

    default:
      content = await readExcelFile(file);
      break;
  }

  if (!file.vendor) {
    throw new Error('All files should have vendors.');
  }

  let products: string[];

  switch (vendor) {
    case 'fender':
      products = processFenderFile(content, test);
      break;
    case 'sabian':
      products = processSabianFile(content, test);
      break;
    case 'hoshino':
      products = processHoshinoFile(content, test);
      break;
    default:
      products = [];
      break;
  }

  return products;
};
