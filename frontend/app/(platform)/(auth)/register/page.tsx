import Link from 'next/link';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { RegisterForm } from './_components/register-form';
import auth from '@/middleware/auth';

export const metadata: Metadata = {
  title: 'Register',
};

const RegisterPage = async () => {
  const { user } = await auth();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center pb-4 pt-10 font-sans md:pb-0 md:pt-0">
      <div className="flex flex-col justify-start w-[25rem] px-8 pt-8 pb-9 border shadow-sm bg-white rounded-xl">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-xl font-bold text-black">Create your account</h1>
          <p className="text-lg text-gray-700">
            to continue to <span className="font-medium">MERN App</span>
          </p>
        </div>
        <div className="flex flex-col gap-y-6">
          <RegisterForm />
        </div>
        <div className="flex flex-row justify-start items-center mt-8">
          <span className="text-gray-500 text-sm mr-1">Already have an account?</span>
          <Link href="/login" className="text-sky-500 text-sm font-medium hover:underline">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
