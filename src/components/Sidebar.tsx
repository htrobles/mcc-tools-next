'use client';

import Image from 'next/image';
import Link from 'next/link';
import mccLogo from '/public/mcc-logo.png';
import routes from '@/constants/routes';
import { usePathname } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { useMemo } from 'react';
import { User } from '@prisma/client';

export default function Sidebar({
  isAdmin,
  user,
}: {
  isAdmin: boolean;
  user: User;
}) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    // For the home route, only match exact path
    if (path === '/') {
      return pathname === '/';
    }
    // For other routes, check if pathname starts with the route path
    return pathname.startsWith(path);
  };

  // Memoize the filtered routes to prevent unnecessary re-renders
  const filteredRoutes = useMemo(() => {
    return routes.slice(1).filter(({ adminOnly }) => {
      // Include route if it's not admin-only or if user is admin
      return !adminOnly || isAdmin;
    });
  }, [isAdmin]);

  return (
    <div className="w-[250px] border-r bg-gray-50 flex flex-col">
      <div className="p-4 border-b h-[80px]">
        <Link href="/">
          <Image
            src={mccLogo}
            alt="Music City Canada logo"
            className="object-contain h-full"
          />
        </Link>
      </div>
      <ul className="flex-1">
        {filteredRoutes.map(({ path, title }) => (
          <li key={path} className="">
            <Link
              href={path}
              className={twMerge(
                'block text-gray-600 font-semibold px-4 py-2 hover:bg-gray-200 transition-all duration-300',
                isActive(path) && 'bg-gray-300'
              )}
            >
              {title}
            </Link>
          </li>
        ))}
      </ul>

      {/* Authentication section */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-sm text-gray-600 mb-2">
          {user ? (
            <>
              Logged in as{' '}
              <Link
                href="/profile"
                className="hover:text-blue-600 hover:underline transition-colors cursor-pointer"
              >
                {user.name}
              </Link>
            </>
          ) : (
            'Loading profile'
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => signOut()}
          className="w-full"
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}
