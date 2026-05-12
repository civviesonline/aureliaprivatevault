import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const appConfig = registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3000),
  apiPrefix: process.env.API_PREFIX ?? 'api',
  appName: process.env.APP_NAME ?? 'Velmont Private Bank',
  corsOrigins: parseCorsOrigins(process.env.CORS_ORIGINS),
  swaggerEnabled: process.env.SWAGGER_ENABLED !== 'false',
}));

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'staging', 'production')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  API_PREFIX: Joi.string().trim().default('api'),
  APP_NAME: Joi.string().trim().default('Velmont Private Bank'),
  CORS_ORIGINS: Joi.string().trim().default('http://localhost:3000,http://localhost:5173'),
  SWAGGER_ENABLED: Joi.boolean().truthy('true').falsy('false').default(true),
});

function parseCorsOrigins(value: string | undefined): string[] {
  if (!value) {
    return ['http://localhost:3000', 'http://localhost:5173'];
  }

  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}
