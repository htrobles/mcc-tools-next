'use client';

import React, { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { Input } from '@/components/ui/input';
import useProductUpdate from '@/hooks/useProductUpdate';
import { Button } from '@/components/ui/button';

export default function PriceUpdatePage() {
  const {
    lightSpeedFile,
    supplierFile,
    addLightSpeedFile,
    addSupplierFile,
    handleGenerateImportFile,
  } = useProductUpdate();

  return (
    <PageLayout>
      <div className="space-y-8">
        <h3>Instructions</h3>
        <ol className="list-decimal ml-8">
          <li>Upload Lightspeed and supplier files</li>
          <li>Generate Import File</li>
        </ol>
        <div className="max-w-[500px] mb-4">
          <div className="space-y-2">
            <div className="space-y-1">
              <label htmlFor="lightsoeed-file">Lightspeed File</label>
              <Input
                id="lightsoeed-file"
                type="file"
                placeholder="Select a Lightspeed file"
                onChange={addLightSpeedFile}
                className="cursor-pointer"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="supplier-file">Supplier File</label>
              <Input
                id="supplier-file"
                type="file"
                placeholder="Select a supplier file"
                onChange={addSupplierFile}
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>
        <div>
          <Button
            disabled={!lightSpeedFile || !supplierFile}
            onClick={handleGenerateImportFile}
          >
            Generate Import File
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
