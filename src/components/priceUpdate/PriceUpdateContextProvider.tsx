import React, { createContext, useState, ReactNode } from 'react';

import { FileObj } from '@/types/fileTypes';
import { PriceUpdateHeader } from '@/types/priceUpdateTypes';

export const PriceUpdateContext = createContext<
  PriceUpdateContextType | undefined
>(undefined);

export type PriceUpdateErrorAction = 'add-product' | 'remove' | 'ignore';

export interface PriceUpdateErrorRowType {
  sku: string;
  error: string;
  description?: string;
  action?: PriceUpdateErrorAction;
}

interface PriceUpdateContextType {
  initialFile?: FileObj | null;
  setInitialFile: React.Dispatch<
    React.SetStateAction<FileObj | null | undefined>
  >;
  errorFile?: FileObj | null;
  setErrorFile: React.Dispatch<
    React.SetStateAction<FileObj | null | undefined>
  >;
  content: string[][] | undefined;
  setContent: React.Dispatch<React.SetStateAction<string[][] | undefined>>;
  rawHeaders: Partial<PriceUpdateHeader>[] | undefined;
  setRawHeaders: React.Dispatch<
    React.SetStateAction<Partial<PriceUpdateHeader>[] | undefined>
  >;
  selectedHeaders: PriceUpdateHeader[] | undefined;
  setSelectedHeaders: React.Dispatch<
    React.SetStateAction<PriceUpdateHeader[] | undefined>
  >;
  isSale: boolean;
  setIsSale: React.Dispatch<React.SetStateAction<boolean>>;
  note: string;
  setNote: React.Dispatch<React.SetStateAction<string>>;
  costMultiplier: number;
  setCostMultiplier: React.Dispatch<React.SetStateAction<number>>;
  errorRows: PriceUpdateErrorRowType[] | undefined;
  setErrorRows: React.Dispatch<
    React.SetStateAction<PriceUpdateErrorRowType[] | undefined>
  >;
}

export const PriceUpdateContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [initialFile, setInitialFile] = useState<FileObj | null>();
  const [errorFile, setErrorFile] = useState<FileObj | null>();
  const [isSale, setIsSale] = useState(false);
  const [rawHeaders, setRawHeaders] = useState<Partial<PriceUpdateHeader>[]>();
  const [selectedHeaders, setSelectedHeaders] = useState<PriceUpdateHeader[]>();
  const [content, setContent] = useState<string[][]>();
  const [note, setNote] = useState<string>('');
  const [costMultiplier, setCostMultiplier] = useState(1.4);
  const [errorRows, setErrorRows] = useState<PriceUpdateErrorRowType[]>();

  return (
    <PriceUpdateContext.Provider
      value={{
        initialFile,
        setInitialFile,
        errorFile,
        setErrorFile,
        content,
        setContent,
        isSale,
        setIsSale,
        rawHeaders,
        setRawHeaders,
        selectedHeaders,
        setSelectedHeaders,
        note,
        setNote,
        costMultiplier,
        setCostMultiplier,
        errorRows,
        setErrorRows,
      }}
    >
      {children}
    </PriceUpdateContext.Provider>
  );
};
