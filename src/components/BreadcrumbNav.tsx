'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbSeparator,
  BreadcrumbLink,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import routes from '@/constants/routes';

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

export default function BreadcrumbNav() {
  const pathname = usePathname();
  const breadcrumbItems = generateBreadcrumbs(pathname);

  return (
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
  );
}
