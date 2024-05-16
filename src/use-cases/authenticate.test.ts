import { expect, describe, test, beforeEach } from 'vitest';
import { hash } from 'bcryptjs';
import { UsersInMemoryRepository } from 'repositories/in-memory/users.repository';
import { AuthenticateUseCase } from './authenticate.case';
import { InvalidCredentialsError } from './errors/invalid-credentials.error';

let usersRepository: UsersInMemoryRepository;
let authenticateUseCase: AuthenticateUseCase;

describe('Autenticação', () => {
    beforeEach(() => {
        usersRepository = new UsersInMemoryRepository();
        authenticateUseCase = new AuthenticateUseCase(usersRepository);
    });

    test('Deve poder se autenticar', async () => {
        await usersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password_hash: await hash('123456', 6),
        });

        const { user } = await authenticateUseCase.execute({
            email: 'johndoe@example.com',
            password: '123456',
        });

        expect(user.id).toEqual(expect.any(String));
    });

    test('Não Deve poder se autenticar com email incorreto', async () => {
        await expect(() =>
            authenticateUseCase.execute({
                email: 'johndoe@example.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(InvalidCredentialsError);
    });

    test('Não Deve poder se autenticar com senha incorreta', async () => {
        await usersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password_hash: await hash('123456', 6),
        });

        await expect(() =>
            authenticateUseCase.execute({
                email: 'johndoe@example.com',
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(InvalidCredentialsError);
    });
});
