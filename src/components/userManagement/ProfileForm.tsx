'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Role } from '@prisma/client';

interface User {
  id: string;
  name: string | null;
  email: string;
  role: Role;
}

interface ProfileFormProps {
  user: User;
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const { update } = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.id) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update profile');
      }

      // Update the session to reflect changes
      await update();

      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to update profile',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.id) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'New passwords do not match',
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Password must be at least 8 characters long',
      });
      return;
    }

    setIsPasswordLoading(true);
    try {
      const response = await fetch(`/api/users/${user.id}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update password');
      }

      // Clear password form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      toast({
        title: 'Success',
        description: 'Password updated successfully',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to update password',
      });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your name and email address.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="col-span-3"
                placeholder="Enter your name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="col-span-3"
                placeholder="Enter your email address"
                required
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Password Change Card */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="currentPassword" className="text-right">
                Current Password
              </Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  handlePasswordChange('currentPassword', e.target.value)
                }
                className="col-span-3"
                placeholder="Enter your current password"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newPassword" className="text-right">
                New Password
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  handlePasswordChange('newPassword', e.target.value)
                }
                className="col-span-3"
                placeholder="Enter your new password"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="confirmPassword" className="text-right">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  handlePasswordChange('confirmPassword', e.target.value)
                }
                className="col-span-3"
                placeholder="Confirm your new password"
                required
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isPasswordLoading}>
                {isPasswordLoading ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
