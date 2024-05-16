import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { MakeCheckInUseCase } from 'use-cases/factories/make-checkin-use-case.factory';

export class CreateController {
    async execute(request: FastifyRequest, reply: FastifyReply) {
        const createCheckinParamsSchema = z.object({
            gymId: z.string().uuid(),
        });

        const createCheckinBodySchema = z.object({
            latitude: z.coerce.number().refine((value) => {
                return Math.abs(value) <= 90;
            }),
            longitude: z.coerce.number().refine((value) => {
                return Math.abs(value) <= 180;
            }),
        });

        const { gymId } = createCheckinParamsSchema.parse(request.params);
        const { latitude, longitude } = createCheckinBodySchema.parse(
            request.body,
        );

        const checkinUseCase = MakeCheckInUseCase();
        await checkinUseCase.execute({
            gymId,
            userId: request.user.sub,
            userLatitude: latitude,
            userLongitude: longitude,
        });

        return reply.status(201).send();
    }
}
