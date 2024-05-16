import { GymsPrismaRepository } from 'repositories/prisma/gyms.repository';
import { FetchNearbyGymsUseCase } from 'use-cases/fetch-nearby-gyms.case';

export function MakeFetchNearbyGymsUseCase() {
    const repository = new GymsPrismaRepository();
    const useCase = new FetchNearbyGymsUseCase(repository);

    return useCase;
}
