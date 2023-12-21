'use client';

import { ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils';

export type UserList = {
  user: {
    email: string;
    name: string;
    image: string;
  };
  totalLogin: number;
  logoutAt: string;
};

export const columns: ColumnDef<UserList>[] = [
  {
    accessorKey: 'user',
    header: ({ column }) => {
      return (
        <Button variant="transparent" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          User
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const user = row.getValue('user') as any;

      return (
        <div className="flex flex-row gap-x-4">
          <Avatar>
            <AvatarImage src={user.image ? user.image : '/assets/default-profile.png'} alt={user.name} />
          </Avatar>
          <div className="flex flex-col justify-start">
            <p className="text-sm font-medium text-neutral-500">{user.name}</p>
            <p className="text-sm text-neutral-400">{user.email}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'totalLogin',
    header: ({ column }) => {
      return (
        <Button variant="transparent" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Total Login
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'logoutAt',
    header: ({ column }) => {
      return (
        <Button variant="transparent" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Last Logout at
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const lastLogout = row.getValue('logoutAt') as string;
      const date = new Date(lastLogout);

      return <div>{lastLogout ? formatDate(date) : '-'}</div>;
    },
  },
];
