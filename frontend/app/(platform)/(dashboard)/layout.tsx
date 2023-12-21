import auth from '@/middleware/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { Navbar } from './_components/navbar';
import { Sidebar } from './_components/sidebar';
import VerifyEmail from './dashboard/_components/verify-email';

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const { user } = await auth();
  const cookiesStore = cookies();
  const token = cookiesStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  return (
    <div className="h-full">
      <div className="h-[65px] md:pl-56 fixed inset-y-0 w-full z-50">
        <Navbar user={user} token={token} />
      </div>
      <div className="hidden md:flex w-56 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      <main className="h-screen md:pl-56 pt-[60px] bg-slate-100">{user?.verified ? children : <VerifyEmail token={token} />}</main>
    </div>
  );
};

export default DashboardLayout;
