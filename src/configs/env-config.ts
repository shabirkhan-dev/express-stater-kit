import { createLogger } from '@/utils/loger';
import {z} from 'zod'
const logger = createLogger();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development').describe('Specify the environment in which the app is running. Options: development, production, test'),
  PORT: z.string().transform((val) => Number.parseInt(val, 10)).describe('Specify the port on which the app is running. Default is 8080'),
  HOST: z.string().default('localhost').describe('Specify the host on which the app is running. Default is localhost'),
  APP_ORIGIN: z.string().default('http://localhost:3000').describe('Specify the origin of the app. Default is http://localhost:3000'),
  MONGO_URI: z.string().describe('Specify the MongoDB URI. This is required to connect to the database'),
});

const parseEnvConfig = (): EnvConfig => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    // make error result more readable
    const errorMessage = result.error.errors.map((error) => `${error.path}: ${error.message}`).join('\n');
    logger.error('Invalid environment variables', new Error(errorMessage));
    process.exit(1);
  }

  return result.data;
};

export const config = parseEnvConfig();

export type EnvConfig = z.infer<typeof envSchema>;
