import express from 'express';
import passport from 'passport';
import '../../config/passport';

import { isAuthenticated } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { googleCallback, loginUser, loginWithGoogle, logout, registerUser } from '../controllers/auth.controller';
import { sendSessionCookie } from '../controllers/session.controller';
import { generateSessionCookie } from '../services/session.service';
import { loginSchema, registerSchema } from '../schemas/auth.schema';
import { CLIENT_URL } from '../../utils/secrets';

const authRouter = express.Router();

authRouter.post('/register', validate(registerSchema), registerUser);

authRouter.post('/login', validate(loginSchema), loginUser);

authRouter.get('/google', loginWithGoogle);

authRouter.get('/logout', isAuthenticated, logout);

authRouter.get('/google/callback', googleCallback);

authRouter.get('/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));

authRouter.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    scope: ['email', 'public_profile'],
    successRedirect: '/auth/facebook/success',
    failureRedirect: '/auth/facebook/failed',
  })
);

authRouter.get('/facebook/success', async (req, res) => {
  const { user } = req as any;

  if (!user) {
    res.status(400).json({ message: 'User not found' });
  }

  const session = await generateSessionCookie(user.id);

  await sendSessionCookie(res, session);

  return res.redirect(`${CLIENT_URL}/dashboard`);
});

authRouter.get('/facebook/failed', async (req, res) => {
  return res.status(400).json({ message: 'Failed to login using Facebook' });
});

export default authRouter;
