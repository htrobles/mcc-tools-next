import * as XLSX from 'xlsx';
import {
  processFenderFile,
  processHoshinoFile,
  processSabianFile,
} from './vendorProcesses';
import { FileObj } from '@/types/fileTypes';

export const processExcelFile = async (file: FileObj, test = false) => {
  const { vendor } = file;

  let content: string[][];

  switch (vendor) {
    case 'sabian':
      content = await readExcel(file, [0, 1]);
      break;

    default:
      content = await readExcel(file);
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

const readExcel = (
  file: File,
  sheetIndexes: number[] = [0]
): Promise<string[][]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryStr = e.target?.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });

      const sheetData: unknown[] = [];

      sheetIndexes.forEach((sheetIndex, i) => {
        const sheetName = workbook.SheetNames[sheetIndex];
        const worksheet = workbook.Sheets[sheetName];
        let jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (i !== 0) {
          jsonData = jsonData.slice(1);
        }

        sheetData.push(...jsonData);
      });
      resolve(sheetData as string[][]);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};
