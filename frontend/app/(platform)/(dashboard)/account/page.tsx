import auth from '@/middleware/auth';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ProfileForm } from './_components/profile-form';
import ResetPasswordForm from './_components/reset-password-form';

export const metadata: Metadata = {
  title: 'Account Settings',
};

const AccountPage = async () => {
  const { user } = await auth();
  const cookiesStore = cookies();
  const token = cookiesStore.get('token')?.value;

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="p-6 space-y-4 max-w-3xl m-auto">
      <Card>
        <CardHeader>
          Account Information
          <p className="text-gray-400 font-normal text-sm">Manage your account information</p>
        </CardHeader>
        <CardContent className="space-y-5">
          <ProfileForm user={user} token={token!} />
          {user?.type === 'email' && <ResetPasswordForm token={token!} />}
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountPage;
