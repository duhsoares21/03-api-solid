import { expect, describe, test, beforeEach } from 'vitest';
import { hash } from 'bcryptjs';
import { UsersInMemoryRepository } from 'repositories/in-memory/users.repository';
import { GetUserProfileUseCase } from './get-user-profile.case';
import { ResourceNotFound } from './errors/resource-not-found.error';

let usersRepository: UsersInMemoryRepository;
let getUserProfileUseCase: GetUserProfileUseCase;

describe('Perfil', () => {
    beforeEach(() => {
        usersRepository = new UsersInMemoryRepository();
        getUserProfileUseCase = new GetUserProfileUseCase(usersRepository);
    });

    test('Deve poder buscar o perfil do usuário', async () => {
        const createdUser = await usersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password_hash: await hash('123456', 6),
        });

        const { user } = await getUserProfileUseCase.execute({
            userId: createdUser.id,
        });

        expect(user.id).toEqual(expect.any(String));
        expect(user.name).toEqual('John Doe');
    });

    test('Não Deve poder buscar perfil do usuário com o id incorreto', async () => {
        await expect(() =>
            getUserProfileUseCase.execute({
                userId: 'non-existing-id',
            }),
        ).rejects.toBeInstanceOf(ResourceNotFound);
    });
});
