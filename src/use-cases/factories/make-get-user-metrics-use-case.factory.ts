import { CheckinsPrismaRepository } from 'repositories/prisma/checkins.repository';
import { GetUserMetricsUseCase } from 'use-cases/get-user-metrics.case';

export function MakeGetUserMetricsUseCase() {
    const repository = new CheckinsPrismaRepository();
    const useCase = new GetUserMetricsUseCase(repository);

    return useCase;
}
