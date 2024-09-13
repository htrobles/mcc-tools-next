import excludedBrands from '~/constants/excludedBrands';
import type { VendorKey } from '~/constants/vendors';

export function checkBrandValidity(brand: string, filteredOutBrands: string[]) {
  return filteredOutBrands.includes(brand.trim().toLowerCase());
}
