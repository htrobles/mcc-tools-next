import { PriceUpdateHeader, ValidHeaderKey } from './priceUpdateHeaderUtils';

export function getPriceUpdateField(input: {
  key: ValidHeaderKey;
  headers: PriceUpdateHeader[];
  row: string[];
}) {
  const { key, headers, row } = input;

  const index = headers.find((h) => h.key === key)?.index;

  if (!index) return null;

  return row[index];
}
