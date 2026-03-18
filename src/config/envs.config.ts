import * as dotenv from 'dotenv';
import * as joi from 'joi';

if (process.env.NODE_ENV === 'development') {
  const result = dotenv.config({ path: `${process.cwd()}/.env.development` });
  if (result.error)
    console.error(`Error loading .env.development: ${result.error.message}`);
}

interface EnvsVars {
  NODE_ENV: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_SYNCHRONIZE: boolean;
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD: string;
  BCRYPT_SALT_ROUNDS: number;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  THROTTLE_TTL: number;
  THROTTLE_LIMIT: number;
  SESSION_TTL_WEB_MS: number;
  SESSION_TTL_MOBILE_MS: number;
  PORT: number;
}

const envsSchema = joi
  .object<EnvsVars>({
    NODE_ENV: joi.string().default('development'),
    DB_HOST: joi.string().required(),
    DB_PORT: joi.number().required(),
    DB_USERNAME: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_NAME: joi.string().required(),
    DB_SYNCHRONIZE: joi.boolean().default(true),
    REDIS_HOST: joi.string().required(),
    REDIS_PORT: joi.number().required(),
    REDIS_PASSWORD: joi.string().required(),
    BCRYPT_SALT_ROUNDS: joi.number().integer().min(4).max(31).default(10),
    JWT_SECRET: joi.string().required(),
    JWT_EXPIRES_IN: joi.string().default('15m'),
    THROTTLE_TTL: joi.number().default(60000),
    THROTTLE_LIMIT: joi.number().default(100),
    SESSION_TTL_WEB_MS: joi.number().default(86400000),
    SESSION_TTL_MOBILE_MS: joi.number().default(2592000000),
    PORT: joi.number().default(3000),
  })
  .unknown(true);

const validationResult = envsSchema.validate(process.env);

if (validationResult.error)
  throw new Error(`Config validation error: ${validationResult.error.message}`);

const envVars: EnvsVars = validationResult.value;

export const envs = {
  nodeEnv: envVars.NODE_ENV,
  port: envVars.PORT,
  db: {
    host: envVars.DB_HOST,
    port: envVars.DB_PORT,
    username: envVars.DB_USERNAME,
    password: envVars.DB_PASSWORD,
    name: envVars.DB_NAME,
    synchronize: envVars.DB_SYNCHRONIZE,
  },
  redis: {
    host: envVars.REDIS_HOST,
    port: envVars.REDIS_PORT,
    password: envVars.REDIS_PASSWORD,
  },
  bcrypt: {
    saltRounds: envVars.BCRYPT_SALT_ROUNDS,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    expiresIn: envVars.JWT_EXPIRES_IN,
  },
  throttle: {
    ttl: envVars.THROTTLE_TTL,
    limit: envVars.THROTTLE_LIMIT,
  },
  session: {
    ttlWebMs: envVars.SESSION_TTL_WEB_MS,
    ttlMobileMs: envVars.SESSION_TTL_MOBILE_MS,
  },
};
