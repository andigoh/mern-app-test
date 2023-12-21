'use client';

import toast from 'react-hot-toast';

import { resendEmailVerification } from '@/services';
import { Button } from '@/components/ui/button';

interface VerifyEmailProps {
  token: string;
}

const VerifyEmail = ({ token }: VerifyEmailProps) => {
  const handleResendEmail = async () => {
    const response = await resendEmailVerification(token);

    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center gap-y-8">
      <h1 className="text-2xl font-semibold text-neutral-600">Verify your email</h1>
      <p className="p-4">Please verify your email address to be able to access MERN App resource.</p>
      <Button variant="primary" size="lg" type="submit" onClick={handleResendEmail}>
        Resend Email Verification
      </Button>
    </div>
  );
};

export default VerifyEmail;
