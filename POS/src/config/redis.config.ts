import { registerAs } from '@nestjs/config';
import { CacheModuleOptions } from '@nestjs/cache-manager';

export const redisConfig = registerAs(
  'redis',
  (): CacheModuleOptions => ({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    isGlobal: true,
  }),
);
