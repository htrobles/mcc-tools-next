export interface ScrapedData {
  sku: string;
  title: string;
  description: string;
  images: string[];
}

export interface LightSpeedProductData {
  Brand: string;
  Category: string;
  'Custom SKU': string;
  'Default Cost': string;
  Department: string;
  EAN: string;
  Item: string;
  MSRP: string;
  'Manufact. SKU': string;
  Price: string;
  Qty: string;
  Season: string;
  'System ID': string;
  Tax: string;
  'Tax Class': string;
  UPC: string;
  Vendor: string;
  'Vendor ID': string;
  'Subcategory 1': string;
  'Subcategory 2': string;
  'Subcategory 3': string;
  'Subcategory 4': string;
  'Subcategory 5': string;
  'Subcategory 6': string;
  'Subcategory 7': string;
  'Subcategory 8': string;
  'Subcategory 9': string;
  Image?: string;
  'Featured Image'?: string;
  Description?: string;
}
