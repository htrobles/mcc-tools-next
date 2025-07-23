'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ConfirmationDialog from '@/components/ui/confirmation-dialog';
import { syncProducts } from '@/lib/priceMonitor/syncProducts';
import { RefreshCcw } from 'lucide-react';

const PriceMonitorManualSyncBtn = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSync = async () => {
    setIsLoading(true);
    try {
      const response = await syncProducts();
      console.log(response);
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const trigger = (
    <Button variant="outline" size="sm">
      <RefreshCcw className="h-4 w-4 mr-2" />
      Sync
    </Button>
  );

  return (
    <ConfirmationDialog
      trigger={trigger}
      title="Confirm Sync"
      description="Are you sure you want to sync all products? This action will update product information from external sources and may take a few moments to complete."
      confirmText="Sync Products"
      cancelText="Cancel"
      onConfirm={handleSync}
      isLoading={isLoading}
      loadingText={
        <>
          <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
          Syncing...
        </>
      }
    />
  );
};

export default PriceMonitorManualSyncBtn;
