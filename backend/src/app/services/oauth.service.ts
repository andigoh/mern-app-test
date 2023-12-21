import { AUTH_PROVIDER } from '@prisma/client';
import prisma from '../../config/prisma';

// Create new oAuth
export const createOauth = async (data: any) => {
  return await prisma.oAuth.create({ data });
};

// Get oAuth data
export const getOAuth = async (id: string, user_id: string, provider: AUTH_PROVIDER) => {
  return await prisma.oAuth.findUnique({
    where: {
      id,
      user_id,
      provider,
    },
  });
};
