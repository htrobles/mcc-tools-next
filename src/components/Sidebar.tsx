'use client';

import Image from 'next/image';
import Link from 'next/link';
import mccLogo from '/public/mcc-logo.png';
import routes from '@/constants/routes';
import { usePathname, useRouter } from 'next/navigation';
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
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  HomeIcon,
  PackageIcon,
  DollarSignIcon,
  BarChart3Icon,
  SettingsIcon,
  UserIcon,
  LogOutIcon,
  ChevronDownIcon,
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
  const router = useRouter();

  const isActive = (path: string) => {
    // For the home route, only match exact path
    if (path === '/') {
      return pathname === '/';
    }
    // For other routes, check if pathname starts with the route path
    return pathname === path;
  };

  const isSubmenuActive = (submenu: { path: string }[]) => {
    return submenu.some((item) => isActive(item.path));
  };

  const isMenuExpanded = (key: string, submenu: { path: string }[]) => {
    // Menu is expanded if we're on the parent route or any submenu route
    const parentRoute = routes.find((route) => route.key === key);
    if (!parentRoute) return false;

    return isActive(parentRoute.path) || isSubmenuActive(submenu);
  };

  const handleParentMenuClick = (path: string) => {
    // Simply navigate to the parent page
    router.push(path);
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
                  {filteredRoutes.map(({ key, path, title, submenu }) => {
                    const IconComponent =
                      iconMap[key as keyof typeof iconMap] || HomeIcon;
                    const expanded = submenu
                      ? isMenuExpanded(key, submenu)
                      : false;

                    if (submenu) {
                      return (
                        <SidebarMenuItem key={path}>
                          <Collapsible open={expanded}>
                            <CollapsibleTrigger asChild>
                              <SidebarMenuButton
                                isActive={isActive(path)}
                                onClick={(e) => {
                                  // Prevent the default Collapsible behavior
                                  e.preventDefault();
                                  // Handle navigation
                                  handleParentMenuClick(path);
                                }}
                              >
                                <IconComponent className="h-4 w-4" />
                                <span>{title}</span>
                                <ChevronDownIcon
                                  className={`h-4 w-4 ml-auto transition-transform ${
                                    expanded ? 'rotate-180' : ''
                                  }`}
                                />
                              </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <SidebarMenu>
                                {submenu.map((subItem) => (
                                  <SidebarMenuItem key={subItem.path}>
                                    <SidebarMenuButton
                                      asChild
                                      isActive={isActive(subItem.path)}
                                    >
                                      <Link
                                        href={subItem.path}
                                        className="pl-6"
                                      >
                                        {subItem.title}
                                      </Link>
                                    </SidebarMenuButton>
                                  </SidebarMenuItem>
                                ))}
                              </SidebarMenu>
                            </CollapsibleContent>
                          </Collapsible>
                        </SidebarMenuItem>
                      );
                    }

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
