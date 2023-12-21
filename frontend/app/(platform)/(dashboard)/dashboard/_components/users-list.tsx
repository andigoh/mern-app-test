import { columns } from './colums';
import { DataTable } from './data-table';

interface UserItemListProps {
  user: {
    name: string;
    email: string;
    image: string;
  };
  totalLogin: number;
  logoutAt: string;
}

export interface UsersListProps {
  lists: UserItemListProps[];
}

export const UsersList = ({ lists }: UsersListProps) => {
  return <DataTable columns={columns} data={lists ? lists : []} />;
};
