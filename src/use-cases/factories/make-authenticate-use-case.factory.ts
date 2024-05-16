import { UsersPrismaRepository } from 'repositories/prisma/users.repository';
import { AuthenticateUseCase } from 'use-cases/authenticate.case';

export function MakeAuthenticateUseCase() {
    const repository = new UsersPrismaRepository();
    const useCase = new AuthenticateUseCase(repository);

    return useCase;
}
