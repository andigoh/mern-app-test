import Link from 'next/link';
import auth from '@/middleware/auth';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { LoginForm } from './_components/login-form';
import { SocialLogin } from './_components/social-login';

export const metadata: Metadata = {
  title: 'Login',
};

const LoginPage = async () => {
  const { user } = await auth();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center pb-4 pt-10 font-sans md:pb-0 md:pt-0">
      <div className="flex flex-col justify-start w-[25rem] px-8 pt-8 pb-9 border shadow-sm bg-white rounded-xl">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-xl font-bold text-black">Log In</h1>
          <p className="text-lg text-gray-700">
            to continue to <span className="font-medium">MERN App</span>
          </p>
        </div>
        <div className="flex flex-col gap-y-6">
          <LoginForm />
          <div className="flex flex-row items-center justify-center">
            <div className="flex flex-1 items-stretch h-px bg-black/20" />
            <p className="text-sm text-black/80 font-medium mx-4 leading-5">or</p>
            <div className="flex flex-1 items-stretch h-px bg-black/20" />
          </div>
          <SocialLogin />
        </div>
        <div className="flex flex-row justify-start items-center mt-8">
          <span className="text-gray-500 text-sm mr-1">Don&apos;t have an account?</span>
          <Link href="/register" className="text-sky-500 text-sm font-medium hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
