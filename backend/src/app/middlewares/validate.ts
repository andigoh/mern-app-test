import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import { formatZodError } from '../../utils/format-zod-issue';

export const validate = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.parseAsync({
      body: req.body,
    });
    return next();
  } catch (error: any) {
    return res.status(400).json({ message: formatZodError(error) });
  }
};
