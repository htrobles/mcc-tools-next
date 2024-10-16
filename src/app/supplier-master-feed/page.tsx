'use client';

import { FileList } from '@/components/FileList';
import FileUpload from '@/components/FileUpload';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { VendorKey } from '@/constants/vendors';
import { useToast } from '@/hooks/use-toast';
import useSupplierFiles from '@/hooks/useSupplierFiles';
import { FileObj } from '@/types/fileTypes';
import {
  downloadCSV,
  downloadTestCsv,
  generateSupplyFeedCsv,
  generateSupplyFeedDeleteCsv,
  generateTestCsv,
} from '@/utils/supplyFeed/csvUtils';
import { processSupplyFeedCsvFile } from '@/utils/supplyFeed/processSupplyFeedCsvFile';
import { processSupplyFeedExcelFile } from '@/utils/supplyFeed/processSupplyFeedExcelFile';
import { processSupplyFeedInventoryFile } from '@/utils/supplyFeed/processSupplyFeedInventoryFile';
import moment from 'moment';
import { useCallback } from 'react';

export default function SupplierMasterFeedPage() {
  const { files, addFiles, clearFiles, deleteFile, deleteFiles, updateVendor } =
    useSupplierFiles();
  const { toast } = useToast();

  const handleClickProcess = async (type: 'add' | 'delete' = 'add') => {
    try {
      if (!files.length) {
        throw new Error('Please upload at least one file', {
          cause: 'No files uploaded',
        });
      }

      const skus: string[] = [];
      let prevSkus: string[] = [];

      await Promise.all(
        files.map(async (file) => {
          if (file.name.endsWith('.inventory')) {
            skus.push(...(await processSupplyFeedInventoryFile(file)));
          }
          if (file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
            skus.push(...(await processSupplyFeedExcelFile(file)));
          }
          if (file.name.endsWith('.csv')) {
            const skuList = await processSupplyFeedCsvFile(file);
            if (file.vendor === 'mcc') {
              prevSkus = skuList;
            } else {
              skus.push(...skuList);
            }
          }
        })
      );

      const date = moment(new Date()).format('YYYYMMDD');

      if (type === 'delete') {
        // Get missing skus from prevSku
        const skusToDelete = prevSkus.filter((sku) => !skus.includes(sku));
        const csvContent = generateSupplyFeedDeleteCsv(skusToDelete);

        downloadCSV(csvContent, `MasterSuppliesFeed-DELETE-${date}.csv`);
      } else {
        const csvContent = generateSupplyFeedCsv(skus);
        downloadCSV(csvContent, `MasterSuppliesFeed-UPDATE-${date}.csv`);
      }
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
        data = await processSupplyFeedInventoryFile(file, true);
      }
      if (file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
        data = await processSupplyFeedExcelFile(file, true);
      }
      if (file.name.endsWith('.csv')) {
        data = await processSupplyFeedCsvFile(file, true);
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
    <PageLayout>
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
              <p>Click Generate Supplies Feed File.</p>
            </li>
            <li>
              <p>
                If you wish to create a file to delete supplier tags from
                products that are not part of the list.
              </p>
              <ol className="list-disc ml-10">
                <li>Import the previous master supply feed file.</li>
                <li>Click Generate Delete File</li>
              </ol>
            </li>
          </ol>
          <p className="text-sm italic">
            If there are other brands that you want to exclude, please contact
            admin to update the excluded brands list.
          </p>
        </div>
        <div className="lg:px-10 space-y-5">
          <FileUpload addFiles={handleAddFiles} multiple />
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
            <Button
              variant="outline"
              onClick={() => handleClickProcess('delete')}
              size="lg"
            >
              Generate Delete File
            </Button>
            <Button
              variant="default"
              onClick={() => handleClickProcess('add')}
              size="lg"
            >
              Generate Supplies Feed File
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
