'use client';

import { VendorKey } from '@/constants/vendors';
import { FileObj } from '@/types/fileTypes';
import { useCallback, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import { VendorSelect } from './VendorSelect';

interface FileListProps {
  files: FileObj[];
  onDeleteFile: (fileName: string) => void;
  onDeleteFiles: (fileNames: string[]) => void;
  onUpdateVendor: (fileName: string, vendor: VendorKey) => void;
  onTestFile: (fileName: string) => Promise<void>;
}

export function FileList({
  files,
  onDeleteFile,
  onDeleteFiles,
  onUpdateVendor,
  onTestFile,
}: FileListProps) {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const handleVendorUpdate = useCallback(
    (fileName: string, vendor: VendorKey) => {
      onUpdateVendor(fileName, vendor);
    },
    [onUpdateVendor]
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFiles(files.map((file) => file.name));
    } else {
      setSelectedFiles([]);
    }
  };

  const handleToggleFile = (fileName: string) => {
    let newSelectedFiles: string[];
    if (selectedFiles.includes(fileName)) {
      newSelectedFiles = selectedFiles.filter(
        (selectedFile) => selectedFile !== fileName
      );
    } else {
      newSelectedFiles = [...selectedFiles, fileName];
    }

    setSelectedFiles(newSelectedFiles);
  };

  const handleDeleteFiles = () => {
    onDeleteFiles(selectedFiles);
    setSelectedFiles([]);
  };

  return (
    <Table title="List of files to be processed">
      <TableHeader>
        {selectedFiles.length ? (
          <TableRow>
            <TableHead className="w-10">
              <Checkbox
                style={{
                  borderWidth:
                    selectedFiles.length && selectedFiles.length < files.length
                      ? '2px'
                      : 'initial',
                }}
                checked={
                  !!files.length && files.length === selectedFiles.length
                }
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead className="w-[100px]">
              {selectedFiles.length} files selected
            </TableHead>
            <TableHead className="text-right" colSpan={2}>
              <Button variant="destructive" onClick={handleDeleteFiles}>
                Delete Selected
              </Button>
            </TableHead>
          </TableRow>
        ) : (
          <TableRow>
            <TableHead className="w-10">
              <Checkbox
                checked={
                  !!files.length && files.length === selectedFiles.length
                }
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead className="w-[100px]">File Name</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        )}
      </TableHeader>
      <TableBody>
        {!files.length && (
          <TableRow>
            <TableCell className="text-center py-5" colSpan={4}>
              <h4>No files selected yet.</h4>
              <p>Please select files to process.</p>
            </TableCell>
          </TableRow>
        )}
        {files.map((file) => (
          <TableRow key={file.name}>
            <TableCell className="font-medium whitespace-nowrap">
              <Checkbox
                checked={selectedFiles.includes(file.name)}
                onCheckedChange={() => handleToggleFile(file.name)}
              />{' '}
            </TableCell>
            <TableCell className="font-medium whitespace-nowrap">
              {file.name}
            </TableCell>
            <TableCell>
              <VendorSelect
                value={file.vendor}
                onSelect={(value) => handleVendorUpdate(file.name, value)}
              />
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" onClick={() => onTestFile(file.name)}>
                Test
              </Button>
              <Button
                variant="destructive"
                onClick={() => onDeleteFile(file.name)}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
