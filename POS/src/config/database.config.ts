import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'pos_db',
    // {ts,js} covers ts-node (dev) and compiled dist (prod/build)
    entities: [__dirname + '/../modules/**/entities/*.entity.{ts,js}'],
    migrations: [__dirname + '/../database/migrations/*.{ts,js}'],
    migrationsRun: false,
    synchronize: true,   // auto-creates/updates tables from entities (safe for dev)
    autoLoadEntities: true, // also picks up entities registered via forFeature()
    logging: process.env.NODE_ENV === 'development',
  }),
);
