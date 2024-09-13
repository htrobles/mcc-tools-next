import React, { useCallback, useRef } from 'react';

interface FileUploadProps {
  addFiles: (files: File[]) => void;
}

export default function FileUpload2({ addFiles }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const files = Array.from(event.dataTransfer.files);

      addFiles(files);
    },
    [addFiles]
  );

  const onFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      addFiles(files);
    },
    [addFiles]
  );

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div>
      {/* Dropzone area */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="flex items-center justify-center w-full h-48 p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <p className="text-gray-500">
          Drag and drop files here, or click to select files
        </p>
      </div>

      <input ref={fileInputRef} type="file" multiple onChange={onFileSelect} />
    </div>
  );
}
