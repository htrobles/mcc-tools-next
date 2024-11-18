import { FileObj } from '@/types/fileTypes';
import { LightSpeedProductData } from '@/types/productUpdateTypes';
import { readCsvFile } from '@/utils/fileProcessors';
import { processError } from '@/utils/helpers';
import generateProductUpdateCsv from '@/utils/productUpdate/generateProductUpdateCsv';
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

    const supplierContent = (await readCsvFile(supplierFile)) as {
      [key: string]: string;
    }[];

    const products = supplierContent.reduce((prev, product) => {
      const sku = product['Variant SKU'] || product['Manufacturer SKU'];

      const foundProduct = lightspeedContent.find(
        (p) =>
          p['Manufact. SKU'].toLowerCase() === sku.toLowerCase() ||
          p['Custom SKU'].toLowerCase() === sku.toLowerCase()
      );

      if (!foundProduct) {
        return prev;
      }

      return [
        ...prev,
        {
          ...product,
          'System ID': foundProduct['System ID'],
          'Add Tags': 'add, instock',
          'Replace Tags': 'Yes',
        },
      ];
    }, [] as { [key: string]: string }[]);

    generateProductUpdateCsv(products);
  };

  return {
    lightSpeedFile,
    supplierFile,
    addLightSpeedFile,
    addSupplierFile,
    handleGenerateImportFile,
  };
}
