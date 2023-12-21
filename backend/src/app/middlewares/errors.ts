import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../utils/errors/custom-error';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  // Handled errors
  if (err instanceof CustomError) {
    const { statusCode, errors, logging } = err;
    if (logging) {
      console.error(
        JSON.stringify(
          {
            code: err.statusCode,
            errors: err.errors,
            stacK: err.stack,
          },
          null,
          2
        )
      );
    }
    return res.status(statusCode).send({ errors });
  }

  // Unhandled errors
  console.log(JSON.stringify(err, null, 2));
  return res.status(500).send({ errors: [{ message: 'Something went wrong' }] });
};
