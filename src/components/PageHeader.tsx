'use client';

import routes from '@/constants/routes';
import { usePathname } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

export default function PageHeader() {
  const [title, setTitle] = useState<string>();
  const path = usePathname();

  const getPageDetails = useCallback(() => {
    const pathKey = path.split('/')[1];

    const pageDetails = routes.find(({ key }) => key === pathKey);

    setTitle(pageDetails?.title);
  }, [path]);

  useEffect(() => {
    getPageDetails();
  }, [getPageDetails, path]);

  return (
    <div className="h-[80px] p-5 bg-black">
      <h1 className="text-white">{title}</h1>
    </div>
  );
}
