import auth from '@/middleware/auth';
import { redirect } from 'next/navigation';
import { Navbar } from './_components/navbar';

const LandingPageLayout = async ({ children }: { children: React.ReactNode }) => {
  const { user } = await auth();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="h-full bg-slate-100">
      <Navbar />
      <main className="h-screen flex pt-[60px] items-center justify-center bg-slate-100">{children}</main>
    </div>
  );
};

export default LandingPageLayout;
