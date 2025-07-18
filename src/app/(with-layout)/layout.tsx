import SidebarComponent from '@/components/Sidebar';
import { auth } from '@/lib/auth';
import { Role, User } from '@prisma/client';
import moment from 'moment';
import { SidebarTrigger } from '@/components/ui/sidebar';
import React from 'react';
import BreadcrumbNav from '@/components/BreadcrumbNav';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const isAdmin = session?.user?.role === Role.ADMIN;

  return (
    <>
      <SidebarComponent isAdmin={isAdmin} user={session?.user as User}>
        <div className="flex flex-1 flex-col overflow-hidden bg-gray-50">
          <div className="flex-1 overflow-auto bg-background">
            <div className="flex items-center h-[80px] gap-2 p-4 border-b">
              <SidebarTrigger />
              <BreadcrumbNav />
            </div>
            {children}
          </div>
        </div>
      </SidebarComponent>
      <footer className="bg-black text-white p-4">
        © {moment().format('YYYY')} Music City Canada | Developed and
        maintained by Hector Robles
      </footer>
    </>
  );
}
