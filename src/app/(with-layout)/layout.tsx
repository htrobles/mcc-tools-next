import PageLayout from '@/components/PageLayout';
import Sidebar from '@/components/Sidebar';
import { auth } from '@/lib/auth';
import { Role, User } from '@prisma/client';
import moment from 'moment';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const isAdmin = session?.user?.role === Role.ADMIN;

  return (
    <>
      <div className="flex flex-1 overflow-hidden bg-gray-50">
        <Sidebar isAdmin={isAdmin} user={session?.user as User} />
        <div className="w-full overflow-auto">
          {/* <PageHeader /> */}
          <PageLayout>{children}</PageLayout>
        </div>
      </div>
      <footer className="bg-black text-white p-4">
        © {moment().format('YYYY')} Music City Canada | Developed and
        maintained by Hector Robles
      </footer>
    </>
  );
}
