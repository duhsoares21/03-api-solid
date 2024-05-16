import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import { env } from 'env';
import fastify from 'fastify';
import { usersRoutes } from 'http/controllers/users/routes';
import { gymsRoutes } from 'http/controllers/gyms/routes';
import { checkinsRoutes } from 'http/controllers/check-ins/routes';
import { ZodError } from 'zod';

export const app = fastify();

app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    cookie: {
        cookieName: 'refreshToken',
        signed: false,
    },
    sign: {
        expiresIn: '10m',
    },
});

app.register(fastifyCookie);

app.register(usersRoutes);
app.register(gymsRoutes);
app.register(checkinsRoutes);

app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
        return reply
            .status(400)
            .send({ message: 'Erro de validação', issues: error.format() });
    }

    if (env.NODE_ENV !== 'prod') {
        console.error(error);
    }

    return reply.status(500).send({ message: 'Erro Interno de Servidor' });
});
