'use client';

import { FileList } from '@/components/FileList';
import FileUpload from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { VendorKey } from '@/constants/vendors';
import { useToast } from '@/hooks/use-toast';
import useFiles from '@/hooks/useFiles';
import { FileObj } from '@/types/fileTypes';
import {
  downloadCSV,
  downloadTestCsv,
  generateCSV,
  generateTestCsv,
} from '@/utils/csvUtils';
import { processCsvFile } from '@/utils/processCsvFile';
import { processExcelFile } from '@/utils/processExcelFile';
import { processInventoryFile } from '@/utils/processInventoryFile';
import { useCallback } from 'react';

export default function SupplierMasterFeedPage() {
  const { files, addFiles, clearFiles, deleteFile, deleteFiles, updateVendor } =
    useFiles();
  const { toast } = useToast();

  const handleClickProcess = async () => {
    try {
      if (!files.length) {
        throw new Error('Please upload at least one file', {
          cause: 'No files uploaded',
        });
      }

      const skus: string[] = [];

      await Promise.all(
        files.map(async (file) => {
          if (file.name.endsWith('.inventory')) {
            skus.push(...(await processInventoryFile(file)));
          }
          if (file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
            skus.push(...(await processExcelFile(file)));
          }
          if (file.name.endsWith('.csv')) {
            skus.push(...(await processCsvFile(file)));
          }
        })
      );

      const csvContent = generateCSV(skus, 'supplier');
      downloadCSV(csvContent);
    } catch (error) {
      if (error instanceof Error) {
        toast({
          variant: 'destructive',
          title: 'Error Processing File',
          description: error.message,
        });
        console.log(error);
        console.log(error.cause);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error Processing File',
          description:
            'Unable to process the files. Please check if files are valid and vendors are set correctly.',
        });
        console.log(error);
      }
    }
  };

  const handleClickTestFile = async (fileName: string) => {
    try {
      const file = files.find((f) => f.name === fileName) as FileObj;

      let data;

      if (file.name.endsWith('.inventory')) {
        data = await processInventoryFile(file, true);
      }
      if (file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
        data = await processExcelFile(file, true);
      }
      if (file.name.endsWith('.csv')) {
        data = await processCsvFile(file, true);
      }

      if (!data) return;

      const csvContent = generateTestCsv(data);
      downloadTestCsv(csvContent, file.vendor as VendorKey);
    } catch (error) {
      if (error instanceof Error) {
        toast({
          variant: 'destructive',
          title: 'Error Processing File',
          description: error.message,
        });
        console.log(error);
        console.log(error.cause);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error Processing File',
          description:
            'Unable to process the files. Please check if files are valid and vendors are set correctly.',
        });
        console.log(error);
      }
    }
  };

  const handleAddFiles = useCallback(
    (files: File[]) => {
      try {
        addFiles(files);
      } catch (error) {
        if (error instanceof Error) {
          toast({
            variant: 'destructive',
            title: 'Error Adding File',
            description: error.message,
          });
          console.log(error);
          console.log(error.cause);
        } else {
          toast({
            variant: 'destructive',
            title: 'Error Adding File',
            description:
              'Unable to add files. Please check if files are valid and vendors are set correctly.',
          });
          console.log(error);
        }
      }
    },
    [addFiles, toast]
  );

  return (
    <div className="container mx-auto py-4">
      <div className="mb-5 pb-4 border-b">
        <h1>Master Supplies Feed Tool</h1>
        <p>
          This tool creates a Master Supplies Feed CSV file using the data from
          the suppliers.
        </p>
      </div>

      <div>
        <div className="mb-5 space-y-2">
          <h4>Instructions:</h4>
          <ol className="list-decimal ml-10">
            <li>
              <p>
                Add files you wish to process by clicking the file dropzone or
                dragging files into it.
              </p>
            </li>
            <li>
              <p>Select vendors for each file.</p>
            </li>
            <li>
              <p>Click Process.</p>
            </li>
          </ol>
          <p className="text-sm italic">
            If there are other brands that you want to exclude, please contact
            admin to update the excluded brands list.
          </p>
        </div>
        <div className="px-10 space-y-5">
          {/* <FileUpload addFiles={handleAddFiles} /> */}
          <FileUpload addFiles={handleAddFiles} />
          <div className="border rounded bg-white">
            <FileList
              files={files}
              onDeleteFile={deleteFile}
              onDeleteFiles={deleteFiles}
              onUpdateVendor={updateVendor}
              onTestFile={handleClickTestFile}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button onClick={clearFiles} size="lg" variant="outline">
              Clear
            </Button>
            <Button variant="default" onClick={handleClickProcess} size="lg">
              Process
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
