import { FileObj } from '@/types/fileTypes';
import { checkBrandValidity } from './helpers';
import excludedBrands from '@/constants/excludedBrands';
import { VendorKey } from '@/constants/vendors';

export const processInventoryFile = async (file: FileObj, test = false) => {
  const content = await readFileAsText(file);

  if (!file.vendor) {
    throw new Error('All files should have vendors.');
  }

  if (!content) return [];

  const filteredOutBrands = excludedBrands[file.vendor as VendorKey] || [];

  const products = content.split('\n').reduce((prev, line) => {
    if (!line) return prev;

    const values = line.split('|');
    const sku = values[0];
    const brand = values[4];
    const stock = parseInt(values[8]);

    const isExcludedBrand = checkBrandValidity(brand, filteredOutBrands);
    const noStock = stock < 1;

    if (isExcludedBrand || noStock) return prev;

    if (!test) return [...prev, sku];

    const entry = [sku, brand, stock].join(',');

    return [...prev, entry];
  }, [] as string[]);

  return products;
};

export const readFileAsText = (file: File): Promise<string> => {
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
