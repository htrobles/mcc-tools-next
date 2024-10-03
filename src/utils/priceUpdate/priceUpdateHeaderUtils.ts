// type ValidHeaderKey =
//   | 'manufacturerSku'
//   | 'msrp'
//   | 'salePrice'
//   | 'defaultPrice'
//   | 'defaultCost';

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

export interface ValidHeaderType {
  label: RequiredHeaderLabel | string;
  values: string[];
}

export type RequiredHeaderLabel = 'Manufacturer SKU' | 'Default Cost';

export const validHeaders: (ValidHeaderType & { key: ValidHeaderKey })[] = [
  {
    key: 'manufacturerSku',
    label: 'Manufacturer SKU',
    values: [
      // Black Magic
      'item number',
      // Gerr Audio
      'part number',
      // Taylor
      'stockcode',
      // Music Nomad
      'item number',
      // VOX
      'model',
      'manufacturer sku',
    ],
  },
  // Retail Price - Highest price we can go. Ignore if missing
  {
    key: 'msrp',
    label: 'MSRP',
    values: [
      // Black Magic, Music Nomad
      'retail price',
      // Vox
      'msrp',
    ],
  },
  {
    // NOTE:If there is no sale, should be the same as default price
    key: 'salePrice',
    label: 'Sale Price',
    values: [
      //   // Black Magic, Music Nomad
      //   'MAP Price',
      //   // Gerr Audio
      //   'PRICE',
      // Music Nomad
      'promo map',
      'sale price',
    ],
  },
  {
    key: 'defaultPrice',
    label: 'Default Price',
    values: [
      // Black Magic, Music Nomad
      'map price',
      // Gerr Audio
      'price',
      // Taylor
      'map (cad)',
      // VOX
      'map',
    ],
  },
  {
    key: 'defaultCost',
    label: 'Default Cost',
    values: [
      // Black Magic
      'dealer price  (pricing uom)',
      // Gerr Audio
      'dealer price',
      // Music Nomad
      'dealer price  (pricing uom)',
      // VOX
      'dealer',
    ],
  },
];

export const validHeaderMap: { [key: string]: { key: string; label: string } } =
  {};

validHeaders.forEach(({ key, label, values }) => {
  values.forEach((v) => {
    validHeaderMap[v] = { key, label };
  });
});

export const DESCRIPTION_LABELS = [
  // Taylor
  'model',
  // Music Nomad, Black Magic, Gerr Audio
  'description',
  // Rolls
  'english description',
];

export type ValidHeaderKey =
  | 'manufacturerSku'
  | 'msrp'
  | 'salePrice'
  | 'defaultPrice'
  | 'defaultCost';

// for (const key in validHeaders) {
//   if (Object.prototype.hasOwnProperty.call(validHeaders, key)) {
//     const header = validHeaders[key as ValidHeaderKey];

//     validColumnNames.push(...header.values);
//   }
// }

export type PriceUpdateHeader = {
  index: number;
  value: string;
  key?: ValidHeaderKey;
  label: string;
};

export function getPriceUpdateHeaders(content: string[][]) {
  const topRow = content[0];

  const headers: PriceUpdateHeader[] = topRow.reduce<PriceUpdateHeader[]>(
    (prev, value, index) => {
      const cleanedValue = value.trim().toLowerCase();

      const validHeader = validHeaderMap[cleanedValue];

      if (validHeader) {
        const curr: PriceUpdateHeader = {
          index,
          value,
          key: validHeader.key as ValidHeaderKey,
          label: validHeader.label,
        };

        return [...prev, curr];
      }

      return prev;
    },
    []
  );

  if (!headers.find((r) => r.key === 'salePrice')) {
    const header = headers.find(({ key }) => key === 'defaultPrice');

    if (header) {
      headers.splice(-1, 0, {
        ...header,
        key: 'salePrice',
        label: 'Sale Price',
      });
    }
  }

  return headers;
}
