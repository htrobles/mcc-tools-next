import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import db from '@/lib/db';
import ProfileForm from '../../../components/userManagement/ProfileForm';

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  // Fetch user data directly from database
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    redirect('/auth/signin');
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account information and security settings.
        </p>
      </div>

      <ProfileForm user={user} />
    </div>
  );
}
