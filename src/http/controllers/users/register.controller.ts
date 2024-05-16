import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { UserAlreadyExistsError } from 'use-cases/errors/user-already-exists.error';
import { MakeRegisterUseCase } from 'use-cases/factories/make-register-use-case.factory';

export class RegisterController {
    async execute(request: FastifyRequest, reply: FastifyReply) {
        const registerBodySchema = z.object({
            name: z.string(),
            email: z.string().email(),
            password: z.string().min(6),
        });

        const { name, email, password } = registerBodySchema.parse(
            request.body,
        );

        try {
            const registerUseCase = MakeRegisterUseCase();
            await registerUseCase.execute({ name, email, password });
        } catch (error) {
            if (error instanceof UserAlreadyExistsError) {
                return reply.status(409).send({ mensagem: error.message });
            }

            throw error;
        }

        return reply.status(201).send();
    }
}
