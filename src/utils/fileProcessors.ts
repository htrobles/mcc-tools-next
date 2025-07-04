import { FileObj } from '@/types/fileTypes';
import Papa from 'papaparse';
import ExcelJS from 'exceljs';
import { Parser } from '@json2csv/plainjs';

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

export const readCsvFile = (file: File) => {
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
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer);

        const sheetData: string[][] = [];

        for (let i = 0; i < sheetIndexes.length; i++) {
          const sheetIndex = sheetIndexes[i];
          const worksheet = workbook.worksheets[sheetIndex];

          if (!worksheet) {
            throw new Error(`Sheet at index ${sheetIndex} not found`);
          }

          const rows: string[][] = [];
          worksheet.eachRow((row, rowNumber) => {
            if (i === 0 || rowNumber > 1) {
              // Skip header row for subsequent sheets
              const rowData = row.values as string[];
              rows.push(rowData.slice(1)); // Remove the first element (undefined) and convert to string[]
            }
          });

          sheetData.push(...rows);
        }

        resolve(sheetData);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

export const readJsonFile = (file: FileObj) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const jsonContent = JSON.parse(e.target?.result as string);

        resolve(jsonContent);
      } catch (error) {
        console.error('Error parsing JSON', error);
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsText(file);
  });
};

export const jsonToCsv = (data: unknown) => {
  try {
    const parser = new Parser();
    const csv = parser.parse(data as { [key: string]: unknown });
    return csv;
  } catch (err) {
    console.error(err);
  }
};
