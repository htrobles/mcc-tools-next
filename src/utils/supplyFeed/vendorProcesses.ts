import excludedBrands from '@/constants/excludedBrands';
import { checkBrandValidity } from './helpers';

const unavailableStatuses = ['Out of Stock', 'Special Order'];

export function processFenderFile(content: string[][], test = false) {
  const lines = content.slice(1);
  const filteredOutBrands = excludedBrands.fender ?? [];

  if (!lines?.length) return [];

  const products = lines.reduce((prev, line) => {
    const availability = line[16];
    const sku = line[1].toString();
    const brand = line[6];

    const isUnavailable = unavailableStatuses.includes(availability);
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
  const sliceIndex = content.findIndex((r) => r.includes('StockCode')) + 1;
  const lines = content.slice(sliceIndex);

  if (!lines?.length) return [];

  return lines.reduce((prev, line) => {
    if (!line.length) return prev;

    if (test) {
      const sku = line[0].toString();
      const brand = line[3];
      const stock = line[6];

      return [...prev, [sku, brand, stock].join(',')];
    }

    return [...prev, line[0].toString()];
  }, []);
}

export function processHoshinoFile(content: string[][], test = false) {
  const lines = content.slice(3);

  if (!lines?.length) return [];

  return lines.reduce((prev, line) => {
    if (!line[1]) return prev;

    if (test) {
      const sku = line[1]?.toString();
      const brand = line[0];
      const availability = line[6];

      const newLine = [sku, brand, availability].join(',');

      return [...prev, newLine];
    }

    return [...prev, line[1]?.toString()];
  }, [] as string[]);
}

export function processSfmFile(
  content: { [key: string]: string }[],
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
      const entry = [ITEM.toString(), BRAND, QTY].join(',');

      return [...prev, entry];
    }

    return [...prev, ITEM.toString()];
  }, [] as string[]);

  return products;
}

export function processMccPriceUpdateFile(
  content: { [key: string]: string }[]
) {
  return content.map((c) => c['Variant SKU'].toString());
}
