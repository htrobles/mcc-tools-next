// type ValidHeaderKey =
//   | 'manufacturerSku'
//   | 'msrp'
//   | 'salePrice'
//   | 'defaultPrice'
//   | 'defaultCost';

const validHeaders = [
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
    ],
  },
  // Retail Price - Highest price we can go
  {
    key: 'msrp',
    label: 'MSRP',
    values: [
      // Black Magic
      'Retail Price',
    ],
  },
  {
    key: 'salePrice',
    label: 'Sale Price',
    values: ['MAP Price'],
  },
  {
    key: 'defaultPrice',
    label: 'Default Price',
    values: [
      // Black Magic
      'Retail Price',
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
    ],
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

  const result: PriceUpdateHeader[] = topRow.reduce((prev, value, index) => {
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

  if (!result.find((r) => r.key === 'defaultPrice')) {
    const header = result.find(({ key }) => key === 'msrp');
    if (!header) {
      return;
    }

    result.splice(-1, 0, {
      ...header,
      key: 'defaultPrice',
      label: 'Default Price',
    });
  }

  return result;
}
