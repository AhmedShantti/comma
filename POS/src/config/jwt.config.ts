import { registerAs } from '@nestjs/config';

export const jwtConfig = registerAs('jwt', () => ({
  accessSecret: process.env.JWT_ACCESS_SECRET || 'your-access-secret-key',
  accessExpiration: process.env.JWT_ACCESS_EXPIRATION || '30m',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
  refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
}));
