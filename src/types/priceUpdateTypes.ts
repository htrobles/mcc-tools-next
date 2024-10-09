export type PriceUpdateHeader = {
  index: number;
  value: string;
  key?: PriceUpdateHeaderKey;
  label: string;
};

export interface ValidHeaderType {
  label: RequiredHeaderLabel | string;
  values: string[];
}

export const PriceUpdateKeyValues = {
  manufacturerSku: 'manufacturerSku',
  msrp: 'msrp',
  salePrice: 'salePrice',
  defaultPrice: 'defaultPrice',
  defaultCost: 'defaultCost',
} as const;

export enum PriceUpdateHeaderKey {
  MANUFACTURER_SKU = 'MANUFACTURER_SKU',
  MSRP = 'MSRP',
  SALE_PRICE = 'SALE_PRICE',
  DEFAULT_PRICE = 'DEFAULT_PRICE',
  DEFAULT_COST = 'DEFAULT_COST',
}

enum ProductHeaderKey {
  BRAND = 'BRAND',
  VENDOR = 'VENDOR',
  TITLE = 'TITLE',
}

// export type PriceUpdateKey = keyof typeof PriceUpdateKeyValues;

export type RequiredHeaderLabel = 'Manufacturer SKU' | 'Default Cost';

export type NewProductHeaderKey = PriceUpdateHeaderKey | ProductHeaderKey;
