'use server';

import { getCurrentUser } from '@/services';

export interface IUser {
  user: {
    name: string;
    email: string;
    image: string;
    verified: boolean;
  };
}

const auth = async () => {
  const response = await getCurrentUser();

  if (response.error) {
    return {
      user: null,
    };
  } else {
    const user = {
      user: response.data,
    };
    return user;
  }
};

export default auth;
