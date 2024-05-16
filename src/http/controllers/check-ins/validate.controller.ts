import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { MakeCheckInUseCase } from 'use-cases/factories/make-checkin-use-case.factory';
import { MakeValidateCheckinUseCase } from 'use-cases/factories/make-validate-checkin-use-case.factory';

export class ValidateController {
    async execute(request: FastifyRequest, reply: FastifyReply) {
        const validateCheckinParamsSchema = z.object({
            checkInId: z.string().uuid(),
        });

        const { checkInId } = validateCheckinParamsSchema.parse(request.params);

        const validateCheckinUseCase = MakeValidateCheckinUseCase();
        await validateCheckinUseCase.execute({
            checkinId: checkInId,
        });

        return reply.status(204).send();
    }
}
