import excludedBrands from '@/constants/excludedBrands';
import { checkBrandValidity } from './helpers';

export function processFenderFile(content: string[][], test = false) {
  const lines = content.slice(1);
  const filteredOutBrands = excludedBrands.fender ?? [];

  if (!lines?.length) return [];

  const products = lines.reduce((prev, line) => {
    const availability = line[16];
    const sku = line[1];
    const brand = line[6];

    const isUnavailable = availability === 'Out of Stock';
    const isExcludedBrand = checkBrandValidity(brand, filteredOutBrands);

    if (isUnavailable || isExcludedBrand) return prev;

    if (test) {
      const entry = [sku, brand, availability].join(',');

      return [...prev, entry];
    }

    return [...prev, sku];
  }, [] as string[]);

  return products;
}

export function processSabianFile(content: string[][], test = false) {
  const lines = content.slice(1);

  if (!lines?.length) return [];

  return lines.map((line) => {
    if (test) {
      const sku = line[0];
      const brand = line[3];
      const stock = line[6];

      return [sku, brand, stock].join(',');
    }

    return line[0];
  });
}

export function processHoshinoFile(content: string[][], test = false) {
  const lines = content.slice(3);

  if (!lines?.length) return [];

  return lines.map((line) => {
    if (test) {
      const sku = line[1];
      const brand = line[0];
      const availability = line[6];

      return [sku, brand, availability].join(',');
    }

    return line[1];
  });
}

export function processSfmFile(
  content: { ITEM: string; BRAND: string; QTY: string }[],
  test = false
) {
  const filteredOutBrands = excludedBrands.sfm ?? [];

  const products = content.reduce((prev, line) => {
    const { ITEM, BRAND, QTY } = line;

    if (!line) return prev;

    const isExcludedBrand = checkBrandValidity(BRAND, filteredOutBrands);
    const noStock = parseFloat(QTY) < 1;

    if (isExcludedBrand || noStock) return prev;

    if (test) {
      const entry = [ITEM, BRAND, QTY].join(',');

      return [...prev, entry];
    }

    return [...prev, ITEM];
  }, [] as string[]);

  return products;
}
