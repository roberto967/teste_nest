import { DataSourceOptions } from 'typeorm';
import { join } from 'path';

export const developmentConfig: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'admin',
  database: 'development',
  synchronize: true,
  entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
  migrations: ['dist/db-config/migrations/*.js'],
};

export const testConfig: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost', // Replace with test database host
  port: 5432,
  username: 'postgres',
  password: 'admin', // Replace with test database password
  database: 'test', // Replace with test database name
  synchronize: true,
  entities: ['src/**/*.entity.ts', 'dist/**/*.entity.js'],
  migrations: ['dist/db-config/migrations/*.js'],
};
