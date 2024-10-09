import { VALID_HEADER_MAP } from '@/constants/priceUpdates/priceUpdateConstants';
import {
  PriceUpdateHeader,
  PriceUpdateHeaderKey,
} from '@/types/priceUpdateTypes';

export const headerStrings = [
  'item',
  'number',
  'part',
  'stock',
  'code',
  'msrp',
  'retail',
  'price',
  'sale',
  'promo',
  'map',
  'default',
  'dealer',
  'pricing',
  'cost',
];

export function containsSubstring(str: string): boolean {
  if (!str) return false;

  const lowerCaseStr = str.toLowerCase();

  return headerStrings.some((substring) =>
    lowerCaseStr.includes(substring.toLowerCase())
  );
}

export function getPriceUpdateHeaders(content: string[][]) {
  const topRow = content[0];

  const headers: PriceUpdateHeader[] = topRow.reduce<PriceUpdateHeader[]>(
    (prev, value, index) => {
      const cleanedValue = value.trim().toLowerCase();

      const validHeader = VALID_HEADER_MAP[cleanedValue];

      if (validHeader) {
        const curr: PriceUpdateHeader = {
          index,
          value,
          key: validHeader.key as PriceUpdateHeaderKey,
          label: validHeader.label,
        };

        return [...prev, curr];
      }

      return prev;
    },
    []
  );

  if (!headers.find((r) => r.key === PriceUpdateHeaderKey.SALE_PRICE)) {
    const header = headers.find(
      ({ key }) => key === PriceUpdateHeaderKey.DEFAULT_PRICE
    );

    if (header) {
      headers.splice(-1, 0, {
        ...header,
        key: PriceUpdateHeaderKey.SALE_PRICE,
        label: 'Sale Price',
      });
    }
  }

  return headers;
}
