import crypto from 'crypto';
import bcryptjs from 'bcryptjs';
import { Response } from 'express';
import { Users } from '@prisma/client';
import prisma from '../../config/prisma';
import sendMail from '../../utils/send-mail';
import { createToken } from './token.service';
import { API_URL } from '../../utils/secrets';

// Create new user
export const createUser = async (data: any) => {
  const { password } = data;

  if (password) {
    const hashPassword = bcryptjs.hashSync(password, 10);
    data.password = hashPassword;

    delete data.confirmPassword;
  }

  const user = await prisma.users.create({ data });

  return user;
};

// Get user by id
export const getUserById = async (id: string) => {
  return await prisma.users.findUnique({
    where: {
      id,
    },
    include: {
      oAuth: true,
    },
  });
};

// Get user by email address
export const getUserByEmail = async (email: string) => {
  const user = await prisma.users.findUnique({
    where: {
      email,
    },
  });

  return user;
};

// Send email verification to user
export const sendEmailVerification = async (user: Users) => {
  const token = crypto.randomBytes(32).toString('hex');

  const tokenData = {
    token,
    user_id: user.id,
  };

  await createToken(tokenData);

  const url = `${API_URL}/account/${user.id}/verify/${token}`;

  const data = {
    name: user.name,
    url,
  };

  // Send email verification
  try {
    await sendMail({
      email: user.email,
      subject: 'Verify your email account',
      template: 'verify-email.ejs',
      data,
    });
  } catch (error: any) {
    throw Error(error.message);
  }
};

// Verify user email address
export const verifyUserEmail = async (id: string) => {
  const user: Users = await prisma.users.update({
    where: {
      id,
    },
    data: {
      verified: true,
    },
  });

  return user;
};

// Compare password
export const comparePassword = async (password: string, enteredPassword: string) => {
  return await bcryptjs.compare(enteredPassword, password);
};

// Update user profile name
export const updateName = async (id: string, name: string) => {
  return await prisma.users.update({
    where: {
      id,
    },
    data: {
      name,
    },
  });
};

// Update user password
export const updatePassword = async (email: string, newPassword: string) => {
  const hexPassword = bcryptjs.hashSync(newPassword, 10);

  return await prisma.users.update({
    where: {
      email,
    },
    data: {
      password: hexPassword,
    },
  });
};

// Get all registered users list
export const getAllRegisterUsers = async () => {
  const users = await prisma.users.findMany({
    include: {
      _count: {
        select: { sessions: true },
      },
      sessions: {
        select: {
          logout_at: true,
        },
        orderBy: {
          logout_at: 'desc',
        },
        take: 1,
      },
    },
    orderBy: {
      created_at: 'asc',
    },
  });

  let data = [] as any;

  users.map((user) => {
    data.push({
      user: {
        name: user.name,
        email: user.email,
        image: user.image,
      },
      totalLogin: user._count.sessions,
      logoutAt: user.sessions[0].logout_at,
      createdAt: user.created_at,
    });
  });

  return data;
};
