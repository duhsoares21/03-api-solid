import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
    NODE_ENV: z.enum(['dev', 'test', 'prod']).default('dev'),
    JWT_SECRET: z.string(),
    PORT: z.coerce.number().default(3333),
    DATABASE_URL: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
    console.error('Variáveis de ambiente inválidas', _env.error.format());

    throw new Error('Variáveis de ambiente inválidas.');
}

export const env = _env.data;
