import { Request } from 'express';

declare global {
  interface UserModel {
    id: string;
    email: string;
    name: string;
    image: string;
  }
  namespace Express {
    interface Request {
      user?: UserModel | undefined;
    }
  }
}
