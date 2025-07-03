'use client';

import { useState } from 'react';
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
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import addPriceMonitorProducts from '@/lib/priceMonitor/addPriceMonitorProduct';

export default function PriceMonitorAddDropdown() {
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const handleFileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      setIsUploading(true);
      setUploadProgress(0);

      try {
        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);

        await addPriceMonitorProducts(selectedFile);

        clearInterval(progressInterval);
        setUploadProgress(100);

        toast({
          title: 'Success!',
          description:
            'Products have been successfully imported to price monitoring.',
          variant: 'default',
        });

        // Reset form after success
        setTimeout(() => {
          setSelectedFile(null);
          setIsFileDialogOpen(false);
          setIsUploading(false);
          setUploadProgress(0);
        }, 1000);
      } catch (error) {
        setUploadProgress(0);
        toast({
          title: 'Upload Failed',
          description:
            error instanceof Error
              ? error.message
              : 'Failed to import products. Please try again.',
          variant: 'destructive',
        });
        setIsUploading(false);
      }
    }
  };

  const handleFileCancel = () => {
    if (!isUploading) {
      setSelectedFile(null);
      setIsFileDialogOpen(false);
      setUploadProgress(0);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setUploadProgress(0);
  };

  return (
    <>
      <Button variant="outline" onClick={() => setIsFileDialogOpen(true)}>
        Add Products
      </Button>

      {/* Multiple Products File Upload Dialog */}
      <Dialog open={isFileDialogOpen} onOpenChange={setIsFileDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Multiple Products</DialogTitle>
            <DialogDescription>
              Upload a file containing multiple product SKUs to add to price
              monitoring.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFileSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="file" className="text-right">
                  File
                </Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  className="col-span-3"
                  accept=".csv"
                  required
                  disabled={isUploading}
                />
              </div>
              {selectedFile && (
                <div className="text-sm text-muted-foreground">
                  Selected: {selectedFile.name} (
                  {(selectedFile.size / 1024).toFixed(2)} KB)
                </div>
              )}

              {/* Progress Bar */}
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleFileCancel}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!selectedFile || isUploading}>
                {isUploading ? 'Uploading...' : 'Upload File'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
