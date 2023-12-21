'use client';

import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { LogOut, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { IUser } from '@/middleware/auth';
import { logout } from '@/services';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MobileSidebar } from './mobile-sidebar';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

interface NavbarProps {
  user: IUser['user'];
  token: string;
}

export const Navbar = ({ user, token }: NavbarProps) => {
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const handleLogout = async () => {
    const response = await logout(token);

    if (response.error) {
      toast.error(response.message);
    } else {
      Cookies.remove('token');
      router.push('/login');
    }
  };

  return (
    <div className="h-full flex items-center p-4 border-b bg-white shadow-sm">
      <MobileSidebar />
      <div className="flex ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer" asChild>
            <Avatar>
              <AvatarImage src={user?.image ? user.image : '/assets/default-profile.png'} alt={`${user?.name}'s Profile`} />
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[220px] mr-3 px-2 py-2">
            <DropdownMenuLabel className="font-medium">Hello, {user?.name}</DropdownMenuLabel>

            <DropdownMenuItem
              className="py-2 cursor-pointer"
              onClick={() => {
                navigateTo('/account');
              }}>
              <Settings size={24} className="mr-3" />
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="py-2 cursor-pointer" onClick={() => handleLogout()}>
              <LogOut size={24} className="mr-3" />
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
