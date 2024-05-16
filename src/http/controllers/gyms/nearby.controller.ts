import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { MakeFetchNearbyGymsUseCase } from 'use-cases/factories/make-fetch-nearby-gyms-use-case.factory';

export class NearbyController {
    async execute(request: FastifyRequest, reply: FastifyReply) {
        const nearbyGymQuerySchema = z.object({
            latitude: z.coerce.number().refine((value) => {
                return Math.abs(value) <= 90;
            }),
            longitude: z.coerce.number().refine((value) => {
                return Math.abs(value) <= 180;
            }),
        });

        const { latitude, longitude } = nearbyGymQuerySchema.parse(
            request.query,
        );

        const searchGymUseCase = MakeFetchNearbyGymsUseCase();
        const { gyms } = await searchGymUseCase.execute({
            userLatitude: latitude,
            userLongitude: longitude,
        });

        return reply.status(200).send({
            gyms,
        });
    }
}
