'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UpdateUserDialog } from './UpdateUserDialog';
import { Role } from '@prisma/client';

interface User {
  id: string;
  name: string | null;
  email: string;
  role: Role;
}

interface UserActionsProps {
  user: User;
}

export function UserActions({ user }: UserActionsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEditClick = () => {
    setIsDialogOpen(true);
  };

  const handleUserUpdated = () => {
    // Refresh the page to show updated data
    window.location.reload();
  };

  return (
    <>
      <div className="text-right space-x-2">
        <Button variant="outline" size="sm" onClick={handleEditClick}>
          Edit
        </Button>
        <Button variant="outline" size="sm">
          Reset Password
        </Button>
        <Button variant="destructive" size="sm">
          Delete
        </Button>
      </div>

      <UpdateUserDialog
        user={user}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onUserUpdated={handleUserUpdated}
      />
    </>
  );
}
