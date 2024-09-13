'use client';

import { VendorKey } from '@/constants/vendors';
import { FileObj } from '@/types/fileTypes';
import { useCallback, useState } from 'react';

export default function useFiles() {
  const [files, setFiles] = useState<FileObj[]>([]);

  const addFiles = useCallback(
    (acceptedFiles: File[]) => {
      let duplicatesExist = false;

      for (let i = 0; i < acceptedFiles.length; i++) {
        if (files.some((file) => file.name === acceptedFiles[i].name)) {
          duplicatesExist = true;
          break;
        }
      }

      if (duplicatesExist) {
        throw new Error('Duplicate files already exists');
      }

      setFiles((files) => [...files, ...acceptedFiles]);
    },
    [files]
  );

  const deleteFile = (fileName: string) => {
    const newFiles = files.filter((file) => file.name !== fileName);

    setFiles(newFiles);
  };

  const deleteFiles = (fileNames: string[]) => {
    const newFiles = files.filter((file) => !fileNames.includes(file.name));

    setFiles(newFiles);
  };

  const clearFiles = () => {
    setFiles([]);
  };

  const updateVendor = (fileName: string, vendor: VendorKey) => {
    const newFiles = [...files];
    const selectedFile = newFiles.find((file) => file.name === fileName);

    if (selectedFile) {
      selectedFile.vendor = vendor;
    }

    setFiles(newFiles);
  };

  return { files, addFiles, deleteFile, deleteFiles, clearFiles, updateVendor };
}
