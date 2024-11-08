import jsonToCsvExport from 'json-to-csv-export';

export default async function generateProductUpdateCsv(
  products: { [key: string]: string }[]
) {
  const headers = [
    { key: 'System ID', label: 'System ID' },
    { key: 'Manufacturer SKU', label: 'Variant SKU' },
    { key: 'Title', label: 'Title' },
    { key: 'Description Text', label: 'Description Text' },
    { key: 'Body HTML', label: 'Body HTML' },
    { key: 'Add Tags', label: 'Add Tags' },
    { key: 'Replace Tags', label: 'Replace Tags' },
    { key: 'Featured Image', label: 'Featured Image' },
    { key: 'Image', label: 'Image' },
    { key: 'Image_1', label: 'Image' },
    { key: 'Image_2', label: 'Image' },
    { key: 'Image_3', label: 'Image' },
    { key: 'Image_4', label: 'Image' },
    { key: 'Image_5', label: 'Image' },
    { key: 'Image_6', label: 'Image' },
    { key: 'Image_7', label: 'Image' },
    { key: 'Image_8', label: 'Image' },
    { key: 'Image_9', label: 'Image' },
    { key: 'Image_10', label: 'Image' },
  ];

  jsonToCsvExport({ data: products, headers, filename: 'Product Update File' });
}
