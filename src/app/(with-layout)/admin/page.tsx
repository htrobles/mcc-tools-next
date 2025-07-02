import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import PageContainer from '@/components/PageContainer';
import PageHeader from '@/components/PageHeader';

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
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">User Management</h3>
            <p className="text-gray-600 mb-4">
              Manage user accounts and permissions
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
              Manage Users
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">System Settings</h3>
            <p className="text-gray-600 mb-4">Configure system-wide settings</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
              Settings
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Analytics</h3>
            <p className="text-gray-600 mb-4">
              View system analytics and reports
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
              View Reports
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
