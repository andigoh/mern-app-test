import { Response } from 'express';
import { NODE_ENV } from '../../utils/secrets';

interface ISessionOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite?: 'lax' | 'strict' | 'none' | undefined;
  secure?: boolean;
}

const sessionOptions: ISessionOptions = {
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  maxAge: 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: true,
};

export const sendSessionCookie = async (res: Response, token: string) => {
  if (NODE_ENV === 'production') {
    sessionOptions.httpOnly = true;
    sessionOptions.sameSite = 'none';
  }

  res.cookie('token', token, sessionOptions);
};
