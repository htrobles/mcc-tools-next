'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

const addProductOptions = [
  {
    label: 'Add Single Product',
    value: 'single-product',
  },
  {
    label: 'Add Multiple Products',
    value: 'multiple-products',
  },
];

export default function PriceMonitorAddDropdown() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
  const [sku, setSku] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSelect = (type: string) => {
    if (type === 'single-product') {
      setIsDialogOpen(true);
    } else if (type === 'multiple-products') {
      setIsFileDialogOpen(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('SKU:', sku);
    setSku('');
    setIsDialogOpen(false);
  };

  const handleCancel = () => {
    setSku('');
    setIsDialogOpen(false);
  };

  const handleFileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      console.log('Selected file:', selectedFile);
      console.log('File name:', selectedFile.name);
      console.log('File size:', selectedFile.size);
      console.log('File type:', selectedFile.type);
    }
    setSelectedFile(null);
    setIsFileDialogOpen(false);
  };

  const handleFileCancel = () => {
    setSelectedFile(null);
    setIsFileDialogOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Add Product/s</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          {addProductOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onSelect={() => handleSelect(option.value)}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Single Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Single Product</DialogTitle>
            <DialogDescription>
              Enter the SKU of the product you want to add to price monitoring.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sku" className="text-right">
                  SKU
                </Label>
                <Input
                  id="sku"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="col-span-3"
                  placeholder="Enter product SKU"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit">Add Product</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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
                />
              </div>
              {selectedFile && (
                <div className="text-sm text-muted-foreground">
                  Selected: {selectedFile.name} (
                  {(selectedFile.size / 1024).toFixed(2)} KB)
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleFileCancel}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!selectedFile}>
                Upload File
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
