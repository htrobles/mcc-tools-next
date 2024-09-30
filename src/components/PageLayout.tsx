'use client';

import routes from '@/constants/routes';
import { usePathname } from 'next/navigation';
import React, { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  const path = usePathname();

  const pageData = getPageDetails(path);

  return (
    <>
      <div className="h-[80px] p-5 bg-black text-white">
        <h1>{pageData?.title}</h1>
      </div>
      <div className="border-b p-5 mb-5">
        <p>{pageData?.description}</p>
      </div>
      <div className="container mx-auto p-5">{children}</div>
    </>
  );
}

const getPageDetails = (pathName: string) => {
  const pathKey = pathName.split('/')[1];

  const pageDetails = routes.find(({ key }) => key === pathKey);

  return pageDetails;
};