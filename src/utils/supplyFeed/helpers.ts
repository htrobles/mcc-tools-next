export function checkBrandValidity(brand: string, filteredOutBrands: string[]) {
  return filteredOutBrands.includes(brand.trim().toLowerCase());
}
