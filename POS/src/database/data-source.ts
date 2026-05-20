import { DataSource } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables manually from .env file
const envPath = path.resolve(__dirname, '../../.env');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf-8');
  envFile.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && !key.startsWith('#') && valueParts.length > 0) {
      const value = valueParts.join('=').trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

const databaseUrl = process.env.DATABASE_URL;
const isProduction = process.env.NODE_ENV === 'production';

const config: any = {
  type: 'postgres',
  entities: [path.join(__dirname, '/../modules/**/entities/*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, '/migrations/*.{ts,js}')],
  subscribers: [],
  synchronize: false,
  logging: false,
};

if (databaseUrl) {
  config.url = databaseUrl;
  config.ssl = isProduction ? { rejectUnauthorized: false } : false;
} else {
  config.host = process.env.DB_HOST || 'localhost';
  config.port = parseInt(process.env.DB_PORT || '5432');
  config.username = process.env.DB_USERNAME || 'postgres';
  config.password = process.env.DB_PASSWORD || 'postgres';
  config.database = process.env.DB_DATABASE || 'pos_db';
}

export const AppDataSource = new DataSource(config);
