import Papa from 'papaparse';
import { processSfmFile } from './vendorProcesses';
import { FileObj } from '@/types/fileTypes';

export const processCsvFile = async (file: FileObj, test = false) => {
  const { vendor } = file;
  const content = await readFileAsText(file);

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

export const readFileAsText = (
  file: File
): Promise<{ [key: string]: string }[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;

      Papa.parse(text, {
        complete: (results) => {
          resolve(results.data as { [key: string]: string }[]);
        },
        error: (error: Error) => {
          reject(error);
        },
        header: true,
        skipEmptyLines: true,
      });
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsText(file);
  });
};