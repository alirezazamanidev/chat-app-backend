import './../configs/env.config';
import { DataSource, DataSourceOptions } from 'typeorm';

const AppDatsSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/modules/**/*.entity.js'],
  migrations:['dist/database/migrations/*.{ts,js}'],
  migrationsTableName:'jaapMedia_migration_db'

});
export default AppDatsSource;