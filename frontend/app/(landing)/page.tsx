import Link from 'next/link';
import { Button } from '@/components/ui/button';

const LandingPage = () => {
  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex items-center justify-center flex-col">
        <div className="text-4xl text-center font-bold text-neutral-700">MERN App - Authentications</div>
        <h1 className="text-xl font-medium text-neutral-500 mt-4">Simple web application for testing.</h1>
        <Button size="lg" className="mt-[60px]" asChild>
          <Link href="/register">Register MERN App for free</Link>
        </Button>
      </div>
    </div>
  );
};

export default LandingPage;
