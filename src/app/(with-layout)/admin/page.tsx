import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import PageContainer from '@/components/PageContainer';
import PageHeader from '@/components/PageHeader';
import Link from 'next/link';

export default async function AdminPage() {
  const session = await auth();

  // Redirect if not authenticated or not admin
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminRoutes.map((route) => (
            <AdminCard key={route.path} {...route} />
          ))}
        </div>
      </div>
    </PageContainer>
  );
}

const adminRoutes = [
  {
    path: '/admin/user-management',
    title: 'User Management',
  },
  // {
  //   path: '/admin/system-settings',
  //   title: 'System Settings',
  // },
  // {
  //   path: '/admin/analytics',
  //   title: 'Analytics',
  // },
];

const AdminCard = ({ path, title }: { path: string; title: string }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">Manage user accounts and permissions</p>
      <Link
        href={path}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        {title}
      </Link>
    </div>
  );
};
