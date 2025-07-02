'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Role } from '@prisma/client';
import { CopyIcon, CheckIcon } from '@radix-ui/react-icons';

interface User {
  id: string;
  name: string | null;
  email: string;
  role: Role;
}

interface ResetPasswordDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResetPasswordDialog({
  user,
  open,
  onOpenChange,
}: ResetPasswordDialogProps) {
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  // Generate a secure random password
  const generatePassword = () => {
    const length = 12;
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';

    // Ensure at least one character from each category
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // uppercase
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]; // lowercase
    password += '0123456789'[Math.floor(Math.random() * 10)]; // number
    password += '!@#$%^&*'[Math.floor(Math.random() * 8)]; // special character

    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }

    // Shuffle the password
    return password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  };

  const handleResetPassword = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const newPassword = generatePassword();
      setGeneratedPassword(newPassword);

      const response = await fetch(`/api/users/${user.id}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: newPassword }),
      });

      if (!response.ok) {
        throw new Error('Failed to reset password');
      }

      toast({
        title: 'Success',
        description: 'Password has been reset successfully',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to reset password. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPassword = async () => {
    try {
      await navigator.clipboard.writeText(generatedPassword);
      setIsCopied(true);
      toast({
        title: 'Copied!',
        description: 'Password copied to clipboard',
      });

      // Reset copied state after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to copy password',
      });
    }
  };

  // Reset generated password when dialog opens/closes
  useEffect(() => {
    setGeneratedPassword('');
    setIsCopied(false);
  }, [user]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Reset password for {user?.name || user?.email}. A new secure
            password will be generated.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!generatedPassword ? (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-4">
                Click the button below to generate a new secure password for
                this user.
              </p>
              <Button
                onClick={handleResetPassword}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Generating Password...' : 'Generate New Password'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  New Password
                </Label>
                <div className="col-span-3 flex gap-2">
                  <Input
                    id="password"
                    value={generatedPassword}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleCopyPassword}
                    className="shrink-0"
                  >
                    {isCopied ? (
                      <CheckIcon className="h-4 w-4 text-green-600" />
                    ) : (
                      <CopyIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> Copy this password and send it to
                  the user securely. This password will not be shown again.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          {generatedPassword && (
            <Button
              type="button"
              onClick={handleCopyPassword}
              disabled={isCopied}
            >
              {isCopied ? 'Copied!' : 'Copy Password'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
