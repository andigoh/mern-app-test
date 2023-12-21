import { Request, Response, NextFunction } from 'express';
import { google } from 'googleapis';
import { AUTH_PROVIDER } from '@prisma/client';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { comparePassword, createUser, getUserByEmail, sendEmailVerification } from '../services/user.service';
import { generateSessionCookie, getSession, logoutSession } from '../services/session.service';
import { createOauth, getOAuth } from '../services/oauth.service';
import { sendSessionCookie } from './session.controller';

import BadRequestError from '../../utils/errors/bad-request-error';
import { API_URL, CLIENT_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SESSION_SECRET } from '../../utils/secrets';

// google oauth configuration
const oauth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, `${API_URL}/auth/google/callback`);

const scopes = ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'];

const authorizationUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
  include_granted_scopes: true,
});

// regiser user via email address
export interface IRegisterUser {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  image?: string;
}

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body as IRegisterUser;

  const isEmailExist = await getUserByEmail(email);

  if (isEmailExist) {
    throw new BadRequestError({ message: 'That email address is taken. Please try another.', logging: true });
  }

  const user = await createUser(req.body);

  await sendEmailVerification(user);

  const session = await generateSessionCookie(user.id);

  res.status(201).json({
    message: 'Email sent. Please check your email to verify your account',
    data: session,
  });
};

// login user via email and password
interface ILoginUser {
  email: string;
  password: string;
}

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body as ILoginUser;

  const user = await getUserByEmail(email);

  if (!user || !user.password) {
    throw new BadRequestError({ message: 'Invalid email or password' });
  }

  const isPasswordMatch = await comparePassword(user.password!, password);

  if (!isPasswordMatch) {
    throw new BadRequestError({ message: "That's not the right password. Try again." });
  }

  const session = await generateSessionCookie(user.id);

  res.status(200).json({
    data: session,
  });
};

// logout
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  const authorization = (req.headers.authorization || req.headers.Authorization) as string;

  if (!authorization) {
    throw new BadRequestError({ message: 'Token not found', code: 401 });
  }

  const token = authorization.split('Bearer ')[1];
  const code = 401;
  const message = 'Not authorized to access this resources';

  if (!token) {
    throw new BadRequestError({ message, code });
  }

  const decoded = jwt.verify(token, SESSION_SECRET) as JwtPayload;

  const session = await getSession(decoded.id, decoded.user_id);

  if (!session || !session.user) {
    throw new BadRequestError({ message, code });
  }

  await logoutSession(session.id, session.user_id);

  res.clearCookie('token');
  res.status(200).json({
    message: 'Log out successfully',
  });
};

// login with Google OAuth
export const loginWithGoogle = (req: Request, res: Response) => {
  res.redirect(authorizationUrl);
};

export const googleCallback = async (req: Request, res: Response) => {
  const { code } = req.query;

  const { tokens } = await oauth2Client.getToken(code as string);

  oauth2Client.setCredentials(tokens);

  const oauth2 = google.oauth2({
    auth: oauth2Client,
    version: 'v2',
  });

  const { data } = await oauth2.userinfo.get();

  if (!data.id || !data.email || !data.name) {
    return res.json({
      data,
    });
  }

  let user = await getUserByEmail(data.email);

  if (!user) {
    user = await createUser({
      name: data.name,
      email: data.email,
      image: data.picture,
      verified: true,
    });
  }

  const oauth = await getOAuth(data.id, user.id, AUTH_PROVIDER.google);

  if (!oauth) {
    await createOauth({
      id: data.id,
      user_id: user.id,
      name: data.name,
      photos: data.picture,
      provider: AUTH_PROVIDER.google,
    });
  }

  const session = await generateSessionCookie(user.id);

  // await sendSessionCookie(res, session);

  res.redirect(`${CLIENT_URL}/dashboard`);
};
