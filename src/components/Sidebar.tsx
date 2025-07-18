'use client';

import Image from 'next/image';
import Link from 'next/link';
import mccLogo from '/public/mcc-logo.png';
import routes from '@/constants/routes';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { User } from '@prisma/client';
import { useMemo } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  HomeIcon,
  PackageIcon,
  DollarSignIcon,
  BarChart3Icon,
  SettingsIcon,
  UserIcon,
  LogOutIcon,
} from 'lucide-react';

// Icon mapping for navigation items
const iconMap = {
  home: HomeIcon,
  'supplier-master-feed': PackageIcon,
  'price-update': DollarSignIcon,
  'product-update': PackageIcon,
  'price-monitor': BarChart3Icon,
  admin: SettingsIcon,
};

export default function SidebarComponent({
  isAdmin,
  user,
  children,
}: {
  isAdmin: boolean;
  user: User;
  children: React.ReactNode;
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
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b border-border p-4 h-[80px]">
          <Link href="/" className="flex items-center h-full">
            <Image
              src={mccLogo}
              alt="Music City Canada logo"
              className="w-auto object-contain h-full"
            />
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarInset>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filteredRoutes.map(({ key, path, title }) => {
                    const IconComponent =
                      iconMap[key as keyof typeof iconMap] || HomeIcon;
                    return (
                      <SidebarMenuItem key={path}>
                        <SidebarMenuButton asChild isActive={isActive(path)}>
                          <Link href={path} className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4" />
                            <span>{title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarInset>
        </SidebarContent>
        <SidebarFooter className="border-t border-border p-4">
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              {user ? (
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  <span>
                    Logged in as{' '}
                    <Link
                      href="/profile"
                      className="hover:text-foreground hover:underline transition-colors cursor-pointer font-medium"
                    >
                      {user.name}
                    </Link>
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  <span>Loading profile</span>
                </div>
              )}
            </div>
            <Separator />
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut()}
              className="w-full justify-start gap-2"
            >
              <LogOutIcon className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      {children}
    </SidebarProvider>
  );
}
