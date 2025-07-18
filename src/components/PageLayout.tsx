'use client';

import routes from '@/constants/routes';
import { usePathname } from 'next/navigation';
import React, { ReactNode } from 'react';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  const path = usePathname();

  const pageData = getPageDetails(path);
  const breadcrumbItems = generateBreadcrumbs(path);

  return (
    <>
      <div className="h-[80px] p-5 bg-black text-white">
        <h1>{pageData?.title}</h1>
      </div>
      <div className="border-b p-5 mb-5">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbItems.map((item, index) => (
              <React.Fragment key={item.path}>
                <BreadcrumbItem>
                  {index === breadcrumbItems.length - 1 ? (
                    <BreadcrumbPage>{item.title}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={item.path}>{item.title}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {children}
    </>
  );
}

const getPageDetails = (pathName: string) => {
  const pathKey = pathName.split('/')[1] || 'home';

  const pageDetails = routes.find(({ key }) => key === pathKey);

  return pageDetails;
};

const generateBreadcrumbs = (pathName: string) => {
  const pathSegments = pathName.split('/').filter(Boolean);
  const breadcrumbs = [];

  // Always add home as the first breadcrumb
  breadcrumbs.push({
    path: '/',
    title: 'Home',
  });

  // Build breadcrumbs based on path segments
  let currentPath = '';
  for (const segment of pathSegments) {
    currentPath += `/${segment}`;

    // Find the route that matches this path
    const route = routes.find(({ path }) => path === currentPath);

    if (route) {
      breadcrumbs.push({
        path: route.path,
        title: route.title,
      });
    } else {
      // For dynamic routes or segments not in routes, use the segment as title
      breadcrumbs.push({
        path: currentPath,
        title:
          segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
      });
    }
  }

  return breadcrumbs;
};
