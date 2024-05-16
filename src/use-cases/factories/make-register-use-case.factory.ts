import { UsersPrismaRepository } from 'repositories/prisma/users.repository';
import { RegisterUseCase } from 'use-cases/register.case';

export function MakeRegisterUseCase() {
    const usersRepository = new UsersPrismaRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    return registerUseCase;
}
