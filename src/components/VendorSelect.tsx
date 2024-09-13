import { VendorKey, vendors } from '@/constants/vendors';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface VendorSelectProps {
  value?: VendorKey;
  onSelect: (vendor: VendorKey) => void;
}

export function VendorSelect({ value, onSelect }: VendorSelectProps) {
  return (
    <Select value={value} onValueChange={onSelect}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select vendor" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Vendor</SelectLabel>
          {vendors.map((vendor) => (
            <SelectItem key={vendor.value} value={vendor.value}>
              {vendor.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
