import {
  PriceUpdateHeaderKey,
  ValidHeaderType,
} from '@/types/priceUpdateTypes';

export const VALID_HEADERS: (ValidHeaderType & {
  key: PriceUpdateHeaderKey;
})[] = [
  {
    key: PriceUpdateHeaderKey.MANUFACTURER_SKU,
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
    key: PriceUpdateHeaderKey.MSRP,
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
    key: PriceUpdateHeaderKey.SALE_PRICE,
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
    key: PriceUpdateHeaderKey.DEFAULT_PRICE,
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
    key: PriceUpdateHeaderKey.DEFAULT_COST,
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

export const VALID_HEADER_MAP: {
  [key: string]: { key: string; label: string };
} = {};

VALID_HEADERS.forEach(({ key, label, values }) => {
  values.forEach((v) => {
    VALID_HEADER_MAP[v] = { key, label };
  });
});

export const DESCRIPTION_LABELS = [
  // Music Nomad, Black Magic, Gerr Audio, Vox
  'description',
  // Taylor
  'model',
  // Rolls
  'english description',
];
