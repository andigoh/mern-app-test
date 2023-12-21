import express from 'express';

import { isAuthenticated } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { userSchema } from '../schemas/user.schema';
import { editProfileName, getCurrentUser, getUserProfile, resendEmailVerification, resetPassword, verifyEmail } from '../controllers/user.controller';

const userRouter = express.Router();

userRouter.get('/:id/verify/:token', verifyEmail);

userRouter.get('/verify/resend', isAuthenticated, resendEmailVerification);

userRouter.get('/profile', isAuthenticated, getUserProfile);

userRouter.put('/profile/edit', isAuthenticated, validate(userSchema), editProfileName);

userRouter.put('/reset-password', isAuthenticated, validate(userSchema), resetPassword);

userRouter.get('/current-user', isAuthenticated, getCurrentUser);

export default userRouter;
