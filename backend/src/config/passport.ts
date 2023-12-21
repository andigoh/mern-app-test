import passport from 'passport';
import strategy from 'passport-facebook';
import { AUTH_PROVIDER } from '@prisma/client';

import { createOauth, getOAuth } from '../app/services/oauth.service';
import { createUser, getUserByEmail } from '../app/services/user.service';
import BadRequestError from '../utils/errors/bad-request-error';
import { API_URL, FACEBOOK_APP_ID, FACEBOOK_APP_SECRET } from '../utils/secrets';

const FacebookStrategy = strategy.Strategy;

passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: `${API_URL}/auth/facebook/callback`,
      profileFields: ['email', 'name', 'displayName', 'photos'],
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        let user;
        const email = profile.emails?.[0].value;

        if (!email) {
          throw new BadRequestError({ message: 'Email undefined' });
        }

        user = await getUserByEmail(email);

        if (!user) {
          user = await createUser({
            name: profile.displayName,
            email,
            image: profile.photos?.[0].value,
            verified: true,
          });
        }

        const oauth = await getOAuth(profile.id, user.id, AUTH_PROVIDER.facebook);

        if (!oauth) {
          await createOauth({
            id: profile.id,
            user_id: user.id,
            name: profile.displayName,
            photos: profile.photos?.[0].value,
            provider: AUTH_PROVIDER.facebook,
          });
        }

        return done(null, user);
      } catch (err: any) {
        done(err);
      }
    }
  )
);

passport.serializeUser((user: any, done: any) => {
  done(null, user);
});

passport.deserializeUser((id: any, done: any) => {
  done(null, id);
});
