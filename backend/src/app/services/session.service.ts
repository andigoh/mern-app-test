import jwt from 'jsonwebtoken';
import prisma from '../../config/prisma';
import { SESSION_SECRET } from '../../utils/secrets';

export const generateSessionCookie = async (user_id: string) => {
  const session = await prisma.sessions.create({
    data: {
      user_id,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expire after 1 day
    },
  });

  return jwt.sign({ id: session.id, userId: user_id }, SESSION_SECRET, {
    expiresIn: '1d',
  });
};

export const getSession = async (id: string, user_id: string) => {
  return await prisma.sessions.findUnique({
    where: {
      id,
      user_id,
    },
    include: {
      user: true,
    },
  });
};

export const logoutSession = async (id: string, user_id: string) => {
  return await prisma.sessions.update({
    where: {
      id,
      user_id,
    },
    data: {
      logout_at: new Date(Date.now()),
    },
  });
};

export const getActiveSessions = async () => {
  const date = new Date().toISOString().split('T')[0];
  const today = new Date(date);

  const sessions = await prisma.sessions.findMany({
    where: {
      created_at: {
        gte: today,
      },
      logout_at: {
        equals: null,
      },
      expires_at: {
        not: today,
      },
    },
  });

  return sessions.length;
};

export const getLastWeekActiveSessions = async () => {
  const date = new Date().toISOString().split('T')[0];
  const today = new Date(date);
  const oneWeekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);

  const sessions = await prisma.sessions.findMany({
    where: {
      created_at: {
        gte: oneWeekAgo,
        lte: today,
      },
      logout_at: {
        equals: null,
      },
    },
    select: {
      created_at: true,
      user_id: true,
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  return sessions;
};
