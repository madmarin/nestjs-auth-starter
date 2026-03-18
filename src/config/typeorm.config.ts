import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { envs } from './envs.config';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: envs.db.host,
  port: envs.db.port,
  username: envs.db.username,
  password: envs.db.password,
  database: envs.db.name,
  synchronize: envs.db.synchronize,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  extra: {
    connectionLimit: 5,
    connectTimeout: 10000,
  },
};
