import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { MakeFetchUserCheckinsHistoryUseCase } from 'use-cases/factories/make-fetch-user-checkins-history-use-case.factory';

export class HistoryController {
    async execute(request: FastifyRequest, reply: FastifyReply) {
        const checkinHistoryQuerySchema = z.object({
            page: z.coerce.number().min(1).default(1),
        });

        const { page } = checkinHistoryQuerySchema.parse(request.query);

        const userCheckinsHistoryUseCase =
            MakeFetchUserCheckinsHistoryUseCase();
        const { checkIns } = await userCheckinsHistoryUseCase.execute({
            userId: request.user.sub,
            page,
        });

        return reply.status(200).send({
            checkIns,
        });
    }
}
