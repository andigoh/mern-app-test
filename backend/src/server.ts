import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import 'express-async-errors';
import { errorHandler } from './app/middlewares/errors';
import BadRequestError from './utils/errors/bad-request-error';
import authRouter from './app/routes/auth.route';
import userRouter from './app/routes/user.route';
import dashboardRouter from './app/routes/dashboard.router';
import { PORT, SESSION_SECRET } from './utils/secrets';

const app = express();

app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const whitelist = ['http://localhost:3000', 'http://localhost:3001', 'https://demo.andigoh.com'];
app.use(cors({ origin: whitelist, credentials: true, methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'] }));

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    cookie: {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'none',
      httpOnly: true,
      secure: true,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.header('Content-Type', 'application/json;charset=UTF-8');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Routes
app.use('/auth', authRouter);
app.use('/account', userRouter);
app.use('/dashboard', dashboardRouter);

// Error handling
app.use(errorHandler);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  throw new BadRequestError({ code: 404, message: `Route ${req.originalUrl} not found` });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
