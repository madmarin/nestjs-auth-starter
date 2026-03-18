import { ThrottlerModuleOptions } from '@nestjs/throttler';
import { envs } from './envs.config';

export const throttleConfig: ThrottlerModuleOptions = [
  {
    name: 'default',
    ttl: envs.throttle.ttl,
    limit: envs.throttle.limit,
  },
];
