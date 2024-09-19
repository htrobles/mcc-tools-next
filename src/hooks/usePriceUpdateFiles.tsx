'use client';

import { FileObj } from '@/types/fileTypes';
import { useCallback, useState } from 'react';

export default function usePriceUpdateFiles() {
  const [file, setFile] = useState<FileObj | null>();

  const deleteFile = () => {
    setFile(null);
  };

  //   const updateVendor = (fileName: string, vendor: VendorKey) => {
  //     const newFiles = [...files];
  //     const selectedFile = newFiles.find((file) => file.name === fileName);

  //     if (selectedFile) {
  //       selectedFile.vendor = vendor;
  //     }

  //     setFiles(newFiles);
  //   };

  return { file, addFile: setFile, deleteFile };
}
