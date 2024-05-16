import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { MakeCreateGymsUseCase } from 'use-cases/factories/make-create-gym-use-case.factory';

export class CreateController {
    async execute(request: FastifyRequest, reply: FastifyReply) {
        const createGymBodySchema = z.object({
            title: z.string(),
            description: z.string().nullable(),
            phone: z.string().nullable(),
            latitude: z.number().refine((value) => {
                return Math.abs(value) <= 90;
            }),
            longitude: z.number().refine((value) => {
                return Math.abs(value) <= 180;
            }),
        });

        const { title, description, phone, latitude, longitude } =
            createGymBodySchema.parse(request.body);

        const createGymUseCase = MakeCreateGymsUseCase();
        await createGymUseCase.execute({
            title,
            description,
            phone,
            latitude,
            longitude,
        });

        return reply.status(201).send();
    }
}
