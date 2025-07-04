import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | null | undefined) {
  if (!price) return 'N/A';

  return `$${price.toFixed(2)}`;
}
