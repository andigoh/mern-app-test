import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { getSession } from '../services/session.service';
import { SESSION_SECRET } from '../../utils/secrets';
import BadRequestError from '../../utils/errors/bad-request-error';

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
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

  if (!decoded) {
    throw new BadRequestError({ message, code });
  }

  const session = await getSession(decoded.id, decoded.user_id);

  if (!session || !session.user) {
    throw new BadRequestError({ message, code });
  }

  const expired = new Date(session.expires_at).getTime();

  if (expired < Date.now() || session.logout_at !== null) {
    throw new BadRequestError({ message, code });
  }

  const { user } = session;

  req.user = {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image!,
  };

  next();
};
