import { Request, Response, NextFunction } from 'express';
import { deleteToken, getToken } from '../services/token.service';
import {
  updateName,
  getUserById,
  sendEmailVerification,
  verifyUserEmail,
  getUserByEmail,
  comparePassword,
  updatePassword,
} from '../services/user.service';
import BadRequestError from '../../utils/errors/bad-request-error';
import { CLIENT_URL } from '../../utils/secrets';

// verify user email address
export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  const { id, token } = req.params;

  const tokenExist = await getToken(token, id);

  if (!tokenExist) {
    throw new BadRequestError({ message: 'Invalid link', logging: true });
  }

  const currentDate = Date.now();
  const tokenCreatedAt = Date.parse(tokenExist.created_at.toString());
  const tokenExpired = tokenCreatedAt + 24 * 60 * 60 * 1000; // Expire after 1 day

  if (currentDate > tokenExpired) {
    await deleteToken(tokenExist.id);

    throw new BadRequestError({ message: 'Invalid link', logging: true });
  }

  await verifyUserEmail(id);

  await deleteToken(tokenExist.id);

  res.redirect(`${CLIENT_URL}/dashboard`);
};

// resend email verification
export const resendEmailVerification = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.user as any;

  const user = await getUserById(id);

  if (!user) {
    throw new BadRequestError({ message: 'User not exist' });
  }

  if (user.verified) {
    throw new BadRequestError({ message: 'Email already verified' });
  }

  await sendEmailVerification(user);

  res.status(201).json({
    message: 'Email sent. Please check your email to verify your account',
  });
};

// Get User profile
export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.user as any;

  const user = await getUserById(id);

  if (!user) {
    throw new BadRequestError({ message: 'User not exist' });
  }

  res.status(200).json({
    data: {
      name: user.name,
      image: user.image,
    },
  });
};

// Edit profile name
export const editProfileName = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.user as any;
  const { name } = req.body;

  const user = getUserById(id);

  if (!user) {
    throw new BadRequestError({ message: 'User not exist' });
  }

  await updateName(id, name);

  res.status(200).json({
    message: 'Name changed successfully',
  });
};

// Reset password
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.user as any;
  const { currentPassword, newPassword } = req.body;

  const user = await getUserByEmail(email);

  if (!user) {
    throw new BadRequestError({ message: 'User not exist' });
  }

  const isPasswordMatch = await comparePassword(user.password!, currentPassword);

  if (!isPasswordMatch) {
    throw new BadRequestError({ message: 'Incorrect old password' });
  }

  await updatePassword(email, newPassword);

  res.status(200).json({
    message: 'Password changed successfully',
  });
};

// Get current user
export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.user as any;

  const user = await getUserByEmail(email);

  if (!user) {
    throw new BadRequestError({ message: 'User not exist' });
  }

  const { name, image, verified, password } = user;

  const data = {
    name,
    email,
    image,
    verified,
    type: password ? 'email' : 'oAuth',
  };

  res.status(200).json({ data });
};
