import { registerAs } from '@nestjs/config';
import { nanoid } from 'nanoid';

export const config = [
  registerAs('auth', () => ({
    sessionSecret: process.env.SESSION_SECRET,
  })),
  registerAs('authGoogle', () => ({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: `${process.env.API_URL}authend/google`,
    scope: ['email', 'profile'],
  })),
  registerAs('base', () => ({
    instanceId: nanoid(10),
    apiURL: process.env.API_URL,
    baseURL: process.env.BASE_URL,
  })),
  registerAs('db', () => ({
    redisUrl: process.env.REDIS_URL,
  })),
  registerAs('security', () => ({
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
    expiresIn: process.env.EXPIRES_IN,
    refreshIn: process.env.REFRESH_IN,
  })),
];
