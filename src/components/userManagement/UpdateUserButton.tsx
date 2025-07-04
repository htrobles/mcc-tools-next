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

interface UpdateUserButtonProps {
  user: User;
  onUserUpdated: () => void;
}

export function UpdateUserButton({
  user,
  onUserUpdated,
}: UpdateUserButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEditClick = () => {
    setIsDialogOpen(true);
  };

  const handleUserUpdated = () => {
    onUserUpdated();
    setIsDialogOpen(false);
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={handleEditClick}>
        Edit
      </Button>

      <UpdateUserDialog
        user={user}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onUserUpdated={handleUserUpdated}
      />
    </>
  );
}
