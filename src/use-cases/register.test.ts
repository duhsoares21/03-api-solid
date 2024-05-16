import { expect, describe, test, beforeEach } from 'vitest';
import { RegisterUseCase } from './register.case';
import { compare } from 'bcryptjs';
import { UsersInMemoryRepository } from 'repositories/in-memory/users.repository';
import { UserAlreadyExistsError } from './errors/user-already-exists.error';

let usersRepository: UsersInMemoryRepository;
let registerUseCase: RegisterUseCase;

describe('Cadastro', () => {
    beforeEach(() => {
        usersRepository = new UsersInMemoryRepository();
        registerUseCase = new RegisterUseCase(usersRepository);
    });

    test('Deve criar o hash da senha do usuário', async () => {
        const { user } = await registerUseCase.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const isValidPasswordHash = await compare('123456', user.password_hash);

        expect(isValidPasswordHash).toBe(true);
    });

    test('Não deve criar usuários com e-mail duplicados', async () => {
        const email = 'johndoe@example.com';

        await registerUseCase.execute({
            name: 'John Doe',
            email: email,
            password: '123456',
        });

        await expect(() =>
            registerUseCase.execute({
                name: 'John Doe',
                email: email,
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(UserAlreadyExistsError);
    });

    test('Deve poder se cadastrar', async () => {
        const { user } = await registerUseCase.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        expect(user.id).toEqual(expect.any(String));
    });
});
