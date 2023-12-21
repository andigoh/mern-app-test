import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const Navbar = () => {
  return (
    <div className="fixed top-0 w-full h-[60px] px-4 border-b shadow-sm bg-white flex items-center">
      <div className="w-full flex items-center md:max-w-screen-2xl mx-auto justify-between">
        <Link href="/">
          <div className="flex items-center px-4">
            <p className="text-lg text-neutral-700 font-medium">MERN App</p>
          </div>
        </Link>
        <div className="w-auto flex items-center space-x-4">
          <Button variant="ghost">
            <Link href="/login">Login</Link>
          </Button>
          <Button variant="outline">Register</Button>
        </div>
      </div>
    </div>
  );
};
