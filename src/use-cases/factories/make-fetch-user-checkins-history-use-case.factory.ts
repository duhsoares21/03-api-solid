import { CheckinsPrismaRepository } from 'repositories/prisma/checkins.repository';
import { FetchUserCheckInsHistoryUseCase } from 'use-cases/fetch-user-checkins.case';

export function MakeFetchUserCheckinsHistoryUseCase() {
    const repository = new CheckinsPrismaRepository();
    const useCase = new FetchUserCheckInsHistoryUseCase(repository);

    return useCase;
}
