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
import addPriceMonitorProducts from '@/lib/priceMonitor/addPriceMonitorProducts';
import { useRouter } from 'next/navigation';
import { CheckCircle, Clock } from 'lucide-react';

export default function PriceMonitorAddDropdown({ label }: { label?: string }) {
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

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

        const result = await addPriceMonitorProducts(selectedFile);

        console.log(result);

        clearInterval(progressInterval);
        setUploadProgress(100);

        // Store the job ID if returned
        if (result && result.id) {
          setJobId(result.id);
        }

        setUploadSuccess(true);

        toast({
          title: 'Upload Successful!',
          description:
            'Products are being added to price monitoring. This may take a while.',
          variant: 'default',
        });

        // Reset form after success but keep dialog open
        setTimeout(() => {
          setSelectedFile(null);
          setUploadProgress(0);
          setIsUploading(false);
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
      setUploadSuccess(false);
      setJobId(null);
    }
  };

  const handleViewJob = () => {
    setIsFileDialogOpen(false);
    setUploadSuccess(false);
    setJobId(null);
    router.push(`/price-monitor/imports/${jobId}`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setUploadProgress(0);
    setUploadSuccess(false);
    setJobId(null);
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsFileDialogOpen(true)}
        size="sm"
      >
        {label || 'Add Products'}
      </Button>

      {/* Multiple Products File Upload Dialog */}
      <Dialog open={isFileDialogOpen} onOpenChange={setIsFileDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {uploadSuccess ? 'Upload Complete' : 'Add Multiple Products'}
            </DialogTitle>
            <DialogDescription>
              {uploadSuccess
                ? 'Your products are being processed and added to price monitoring.'
                : 'Upload a file containing multiple product SKUs to add to price monitoring.'}
            </DialogDescription>
          </DialogHeader>

          {!uploadSuccess ? (
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
          ) : (
            <div className="space-y-4 py-4">
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">File uploaded successfully!</span>
              </div>

              <div className="flex items-start space-x-2 text-amber-600 bg-amber-50 p-3 rounded-md">
                <Clock className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium">Processing in progress</p>
                  <p className="text-amber-700">
                    Your products are being added to price monitoring. This
                    process may take several minutes depending on the number of
                    products.
                  </p>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                You can track the progress of your import job in the Product
                Import Jobs section.
              </div>
            </div>
          )}

          {uploadSuccess && (
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleFileCancel}
              >
                Close
              </Button>
              <Button type="button" onClick={handleViewJob}>
                View Import Job
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
