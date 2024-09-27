// type ValidHeaderKey =
//   | 'manufacturerSku'
//   | 'msrp'
//   | 'salePrice'
//   | 'defaultPrice'
//   | 'defaultCost';

export const validHeaders = [
  {
    key: 'manufacturerSku',
    label: 'Manufacturer SKU',
    values: [
      // Black Magic
      'Item Number',
      // Gerr Audio
      'PART NUMBER',
      // Taylor
      'Stockcode',
      // Music Nomad
      'Item Number',
    ],
  },
  // Retail Price - Highest price we can go. Ignore if missing
  {
    key: 'msrp',
    label: 'MSRP',
    values: [
      // Black Magic, Music Nomad
      'Retail Price',
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
      'Promo MAP',
      'Sale Price',
    ],
  },
  {
    key: 'defaultPrice',
    label: 'Default Price',
    values: [
      // Black Magic, Music Nomad
      'MAP Price',
      // Gerr Audio
      'PRICE',
      // Taylor
      'MAP (CAD)',
    ],
  },
  {
    key: 'defaultCost',
    label: 'Default Cost',
    values: [
      // Black Magic
      'Dealer Price  (Pricing UOM)',
      // Gerr Audio
      'DEALER PRICE',
      // Music Nomad
      ' Dealer Price  (Pricing UOM)',
    ],
  },
  {
    key: 'addTags',
    label: 'Add Tags',
    values: [],
  },
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
  key: ValidHeaderKey;
  label: string;
};

export default function getPriceUpdateHeaders(content: string[][]) {
  const topRow = content[0];

  const headers: PriceUpdateHeader[] = topRow.reduce((prev, value, index) => {
    const validHeader = validHeaders.find((header) =>
      header.values.includes(value)
    );
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
