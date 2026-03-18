import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { envs } from './envs.config';

export const redisConfig: CacheModuleAsyncOptions = {
  isGlobal: true,
  useFactory: () => {
    const redisUrl = `redis://:${envs.redis.password}@${envs.redis.host}:${envs.redis.port}`;
    return {
      stores: [createKeyv(redisUrl)],
    };
  },
};
