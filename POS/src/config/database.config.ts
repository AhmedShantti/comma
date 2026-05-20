import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = registerAs(
  'database',
  (): TypeOrmModuleOptions => {
    const isProduction = process.env.NODE_ENV === 'production';
    const databaseUrl = process.env.DATABASE_URL;

    // Base config
    const baseConfig = {
      type: 'postgres' as const,
      entities: [__dirname + '/../modules/**/entities/*.entity.{ts,js}'],
      migrations: [__dirname + '/../database/migrations/*.{ts,js}'],
      migrationsRun: true,
      synchronize: false,
      autoLoadEntities: true,
      logging: !isProduction,
    };

    // Build config based on DATABASE_URL or individual variables
    if (databaseUrl) {
      // Use DATABASE_URL (for Supabase or cloud deployments)
      return {
        ...baseConfig,
        url: databaseUrl,
        ssl: isProduction ? { rejectUnauthorized: false } : false,
      } as TypeOrmModuleOptions;
    } else {
      // Fallback to individual env variables (for local development)
      return {
        ...baseConfig,
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_DATABASE || 'pos_db',
      } as TypeOrmModuleOptions;
    }
  },
);
