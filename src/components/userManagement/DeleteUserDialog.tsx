'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Role } from '@prisma/client';

interface User {
  id: string;
  name: string | null;
  email: string;
  role: Role;
}

interface DeleteUserDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserDeleted?: () => void;
}

export function DeleteUserDialog({
  user,
  open,
  onOpenChange,
  onUserDeleted,
}: DeleteUserDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete user');
      }

      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });

      onOpenChange(false);
      onUserDeleted?.();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to delete user',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{' '}
            <span className="font-semibold">{user.name || user.email}</span>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
