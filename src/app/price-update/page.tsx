'use client';

import FileUpload from '@/components/FileUpload';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import usePriceUpdateFiles from '@/hooks/usePriceUpdateFiles';
import { processError } from '@/utils/helpers';
import { FileIcon } from '@radix-ui/react-icons';
import { Close } from '@radix-ui/react-toast';
import { Delete, DeleteIcon, X } from 'lucide-react';
import React from 'react';

export default function PriceUpdatePage() {
  const { file, addFile, deleteFile } = usePriceUpdateFiles();

  const handleAddFile = (files: File[]) => {
    try {
      addFile(files[0]);
    } catch (error) {
      processError('Error adding file', error);
    }
  };

  return (
    <PageLayout>
      <div className="lg:px-10 space-y-5">
        <FileUpload addFiles={handleAddFile} />
        {!!file && (
          <div className="flex space-x-2 items-center">
            <div>
              <FileIcon />
            </div>
            <div>{file?.name}</div>
            <div>
              <X
                className="text-destructive hover:text-black transition-colors cursor-pointer"
                onClick={deleteFile}
              />
            </div>
          </div>
        )}
        <div className="space-x-2 text-right">
          <Button variant="outline" onClick={deleteFile}>
            Clear
          </Button>
          <Button>Process</Button>
        </div>
      </div>
    </PageLayout>
  );
}
