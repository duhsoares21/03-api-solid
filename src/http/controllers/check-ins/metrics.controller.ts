import { FastifyRequest, FastifyReply } from 'fastify';
import { MakeGetUserMetricsUseCase } from 'use-cases/factories/make-get-user-metrics-use-case.factory';

export class MetricsController {
    async execute(request: FastifyRequest, reply: FastifyReply) {
        const userMetricsUseCase = MakeGetUserMetricsUseCase();

        const { checkInsCount } = await userMetricsUseCase.execute({
            userId: request.user.sub,
        });

        return reply.status(200).send({
            checkInsCount,
        });
    }
}
