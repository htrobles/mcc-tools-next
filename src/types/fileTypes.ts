import type { VendorKey } from "~/constants/vendors";

export interface FileObj extends File {
  vendor?: VendorKey;
}
