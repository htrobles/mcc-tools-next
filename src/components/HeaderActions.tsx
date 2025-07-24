'use client';

import { usePathname } from 'next/navigation';
import { use, Suspense } from 'react';

interface HeaderActionsProps {
  className?: string;
}

// Create a promise-based loader for header actions
function createHeaderActionsLoader(pathname: string) {
  return import(`@/app/(with-layout)${pathname}/page`)
    .then((module) => module.headerActions || null)
    .catch(() => null);
}

// Server component that renders the header actions
function HeaderActionsRenderer({
  headerActionsPromise,
  className,
}: {
  headerActionsPromise: Promise<React.ComponentType | null>;
  className: string;
}) {
  const HeaderActionsComponent = use(headerActionsPromise);

  if (!HeaderActionsComponent) {
    return null;
  }

  return (
    <div className={className}>
      <HeaderActionsComponent />
    </div>
  );
}

// Main component
export default function HeaderActions({ className = '' }: HeaderActionsProps) {
  const pathname = usePathname();
  const headerActionsPromise = createHeaderActionsLoader(pathname);

  return (
    <Suspense fallback={null}>
      <HeaderActionsRenderer
        headerActionsPromise={headerActionsPromise}
        className={className}
      />
    </Suspense>
  );
}
