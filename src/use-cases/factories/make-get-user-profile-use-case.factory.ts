import { UsersPrismaRepository } from 'repositories/prisma/users.repository';
import { GetUserProfileUseCase } from 'use-cases/get-user-profile.case';

export function MakeGetUserProfileUseCase() {
    const repository = new UsersPrismaRepository();
    const useCase = new GetUserProfileUseCase(repository);

    return useCase;
}
