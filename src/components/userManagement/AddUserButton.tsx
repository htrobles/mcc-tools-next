'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AddUserDialog } from './AddUserDialog';

export function AddUserButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleUserCreated = () => {
    // Don't refresh immediately - let the dialog stay open to show the password
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      // Refresh the page only after the dialog is closed
      window.location.reload();
    }
  };

  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Add User
      </Button>

      <AddUserDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        onUserCreated={handleUserCreated}
      />
    </>
  );
}
