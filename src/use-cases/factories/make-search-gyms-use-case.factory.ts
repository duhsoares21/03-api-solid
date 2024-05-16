import { GymsPrismaRepository } from 'repositories/prisma/gyms.repository';
import { SearchGymsUseCase } from 'use-cases/search-gyms.case';

export function MakeSearchGymsUseCase() {
    const repository = new GymsPrismaRepository();
    const useCase = new SearchGymsUseCase(repository);

    return useCase;
}
