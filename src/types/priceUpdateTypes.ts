export type ValidHeaderKey =
  | 'manufacturerSku'
  | 'msrp'
  | 'salePrice'
  | 'defaultPrice'
  | 'defaultCost';

export type PriceUpdateHeader = {
  index: number;
  value: string;
  key?: ValidHeaderKey;
  label: string;
};

export interface ValidHeaderType {
  label: RequiredHeaderLabel | string;
  values: string[];
}

export type RequiredHeaderLabel = 'Manufacturer SKU' | 'Default Cost';
