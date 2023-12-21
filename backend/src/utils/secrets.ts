import dotenv from 'dotenv';
import fs from 'fs';

if (fs.existsSync('.env')) {
  dotenv.config({ path: '../../.env' });
} else {
  console.error('.env file not found.');
}

export const NODE_ENV = process.env.NODE_ENV;

export const PORT = (process.env.PORT || 5500) as number;

export const API_URL = process.env.API_URL as string;

export const CLIENT_URL = process.env.CLIENT_URL as string;

export const DATABASE_URL = process.env.DATABASE_URL as string;

export const SMTP_HOST = process.env.SMTP_HOST as string;

export const SMTP_PORT = process.env.SMTP_PORT as string;

export const SMTP_EMAIL = process.env.SMTP_EMAIL as string;

export const SMTP_PASSWORD = process.env.SMTP_PASSWORD as string;

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;

export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;

export const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID as string;

export const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET as string;

export const SESSION_SECRET = process.env.SESSION_SECRET as string;
