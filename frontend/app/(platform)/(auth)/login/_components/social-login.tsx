'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { API_URL } from '@/services';

export const SocialLogin = () => {
  const socialAuthLogin = (provider: string) => {
    const link = document.createElement('a');
    link.href = `${API_URL}/auth/${provider}`;
    link.click();
  };

  return (
    <div className="flex flex-col gap-y-4">
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full relative gap-4 items-center justify-start px-5 py-2"
        onClick={() => socialAuthLogin('google')}>
        <Image src="/assets/google.svg" width={20} height={20} alt="google" className="leading-2" />
        <div className="flex items-center gap-2">
          <span className="text-md font-medium leading-1"> Continue with Google</span>
        </div>
      </Button>
      <Button
        variant="outline"
        size="lg"
        className="w-full relative gap-4 items-center justify-start px-5 py-2"
        onClick={() => socialAuthLogin('facebook')}>
        <Image src="/assets/facebook.svg" width={24} height={24} alt="facebook" className="leading-2" />
        <div className="flex items-center gap-2">
          <span className="text-md font-medium leading-1"> Continue with Facebook</span>
        </div>
      </Button>
    </div>
  );
};
