import auth from '@/middleware/auth';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Users2, ActivitySquare } from 'lucide-react';

import { getDashboard } from '@/services';
import { OverviewCard } from './_components/overview-card';
import { UsersList } from './_components/users-list';

export const metadata: Metadata = {
  title: 'Dashboard',
};

const getData = async () => {
  const response = await getDashboard();

  if (!response.error) {
    const { data } = response;
    return data;
  }
};

const Dashboard = async () => {
  const { user } = await auth();

  if (!user) {
    redirect('/login');
  }

  const data = await getData();

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <OverviewCard icon={Users2} label="Total Users" totalItems={data?.totalUsers} />
        <OverviewCard icon={ActivitySquare} label="Total Active Users Today" totalItems={data?.todayActiveSessions} variant="success" />
      </div>
      <div className="mt-5">
        <UsersList lists={data?.users} />
      </div>
    </div>
  );
};

export default Dashboard;
