import { FileObj } from '@/types/fileTypes';
import { LightSpeedProductData, ScrapedData } from '@/types/productUpdateTypes';
import { jsonToCsv, readCsvFile, readJsonFile } from '@/utils/fileProcessors';
import { processError } from '@/utils/helpers';
import { downloadCSV } from '@/utils/supplyFeed/csvUtils';
import { useCallback, useState } from 'react';

export default function useProductUpdate() {
  const [lightSpeedFile, setLightSpeedFile] = useState<FileObj | null>();
  const [supplierFile, setSupplierFile] = useState<FileObj | null>();

  const addLightSpeedFile = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      try {
        const files = Array.from(event.target.files || []);
        const newFile = files[0];

        setLightSpeedFile(newFile);
      } catch (error) {
        console.log(error);
        processError('Error adding Ligthspeed file', error);
      }
    },
    []
  );

  const addSupplierFile = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      try {
        const files = Array.from(event.target.files || []);
        const newFile = files[0];

        setSupplierFile(newFile);
      } catch (error) {
        console.log(error);
        processError('Error adding supplier file', error);
      }
    },
    []
  );

  const handleGenerateImportFile = async () => {
    if (!lightSpeedFile || !supplierFile) {
      throw new Error('Both Lightspeed file and supplier file are required.');
    }

    const lightspeedContent = (await readCsvFile(
      lightSpeedFile
    )) as LightSpeedProductData[];
    const supplierContent = (await readJsonFile(supplierFile)) as ScrapedData[];

    const rows = supplierContent.reduce((prev, curr: ScrapedData) => {
      const { sku, images, description } = curr;
      const foundProduct = lightspeedContent.find(
        (p) => p['Manufact. SKU'] === sku || p['Custom SKU'] === sku
      );

      if (!foundProduct) return prev;

      return [
        ...prev,
        {
          'Manufact. SKU': foundProduct['Manufact. SKU'],
          Image: images.join(','),
          'Featured Image': images[0],
          Description: description,
          'Add Tags': 'add',
          'Replace Tags': 'Yes',
        },
      ];
    }, [] as Partial<LightSpeedProductData>[]);

    const csv = jsonToCsv(rows);

    if (!csv) return;

    downloadCSV(csv, 'Lightspeed-Product-Update');
  };

  return {
    lightSpeedFile,
    supplierFile,
    addLightSpeedFile,
    addSupplierFile,
    handleGenerateImportFile,
  };
}
