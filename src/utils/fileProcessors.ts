import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export const readInventoryFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsText(file);
  });
};

export const readCsvFile = (
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

export const readExcelFile = (
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
