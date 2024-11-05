// export interface ScrapedData {
//   sku: string;
//   title: string;
//   description: string;
//   image0: string;
//   image1?: string;
//   image2?: string;
//   image3?: string;
//   image4?: string;
//   image5?: string;
//   image6?: string;
//   image7?: string;
//   image8?: string;
//   image9?: string;
//   image10?: string;
//   image11?: string;
// }

export interface ScrapedData {
  'Body HTML': string;
  'Description Text': string;
  'Manufacturer SKU': string;
  Title: string;
  'Featured Image': string;
  Image: string;
  Image_1: string;
  Image_2?: string;
  Image_3?: string;
  Image_4?: string;
  Image_5?: string;
  Image_6?: string;
  Image_7?: string;
  Image_8?: string;
  Image_9?: string;
  Image_10?: string;
  Image_11?: string;
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
