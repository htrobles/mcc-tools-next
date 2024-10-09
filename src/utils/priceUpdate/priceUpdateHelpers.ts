import {
  PriceUpdateHeader,
  PriceUpdateHeaderKey,
} from '@/types/priceUpdateTypes';

export function getPriceUpdateField(input: {
  key: PriceUpdateHeaderKey;
  headers: PriceUpdateHeader[];
  row: string[];
}) {
  const { key, headers, row } = input;

  const index = headers.find((h) => h.key === key)?.index;

  if (!index) return null;

  return row[index];
}
