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

export const validHeaders = [
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
  {
    key: 'addTags',
    label: 'Add Tags',
    values: [],
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

export type ValidHeaderKey = (typeof validHeaders)[number]['key'];

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

  const headers: PriceUpdateHeader[] = topRow.reduce((prev, value, index) => {
    const cleanedValue = value.trim().toLowerCase();

    const validHeader = validHeaderMap[cleanedValue];
    if (validHeader) {
      return [
        ...prev,
        {
          index,
          value,
          key: validHeader.key as ValidHeaderKey,
          label: validHeader.label,
        },
      ];
    } else {
      return prev;
    }
  }, [] as { index: number; value: string; key: string; label: string }[]);

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
