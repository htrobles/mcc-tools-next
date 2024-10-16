import { VendorKey } from '@/constants/vendors';
import moment from 'moment';

export function generateSupplyFeedCsv(skus: string[]): string {
  const headers = ['Variant SKU', 'Tags', 'Tags Command'];

  const rows = skus.map((sku) => [sku, 'supplier', 'MERGE']);

  const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');

  return csvContent;
}

export function generateSupplyFeedDeleteCsv(skus: string[]): string {
  const headers = ['Variant SKU', 'Tags', 'Tags Command'];

  const rows = skus.map((sku) => [sku, 'supplier', 'DELETE']);

  const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');

  return csvContent;
}

export function generateTestCsv(entries: string[]): string {
  const csvContent = entries.join('\n');

  return csvContent;
}

export function downloadTestCsv(csvContent: string, vendor: VendorKey) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);

  const date = moment(new Date()).format('YYYYMMDD');

  link.setAttribute('download', `${vendor}-test-${date}.csv`);

  link.click();
}

export function downloadCSV(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);

  link.setAttribute('download', filename);

  link.click();
}
