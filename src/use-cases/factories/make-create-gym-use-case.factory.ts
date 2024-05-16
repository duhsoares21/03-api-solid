import { GymsPrismaRepository } from 'repositories/prisma/gyms.repository';
import { CreateGymUseCase } from 'use-cases/create-gym.case';

export function MakeCreateGymsUseCase() {
    const repository = new GymsPrismaRepository();
    const useCase = new CreateGymUseCase(repository);

    return useCase;
}
