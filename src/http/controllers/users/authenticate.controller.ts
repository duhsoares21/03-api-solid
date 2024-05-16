import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { InvalidCredentialsError } from 'use-cases/errors/invalid-credentials.error';
import { MakeAuthenticateUseCase } from 'use-cases/factories/make-authenticate-use-case.factory';

export class AuthenticateController {
    async execute(request: FastifyRequest, reply: FastifyReply) {
        const auhtenticateBodySchema = z.object({
            email: z.string().email(),
            password: z.string().min(6),
        });

        const { email, password } = auhtenticateBodySchema.parse(request.body);

        try {
            const authenticateUseCase = MakeAuthenticateUseCase();
            const { user } = await authenticateUseCase.execute({
                email,
                password,
            });

            const token = await reply.jwtSign(
                {
                    role: user.role,
                },
                {
                    sign: {
                        sub: user.id,
                    },
                },
            );

            const refreshToken = await reply.jwtSign(
                {
                    role: user.role,
                },
                {
                    sign: {
                        sub: user.id,
                        expiresIn: '7d',
                    },
                },
            );

            return reply
                .setCookie('refreshToken', refreshToken, {
                    path: '/',
                    secure: true,
                    sameSite: true,
                    httpOnly: true,
                })
                .status(200)
                .send({ token });
        } catch (error) {
            if (error instanceof InvalidCredentialsError) {
                return reply.status(400).send({ mensagem: error.message });
            }

            throw error;
        }
    }
}
