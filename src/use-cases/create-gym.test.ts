import { expect, describe, test, beforeEach } from 'vitest';
import { GymsInMemoryRepository } from 'repositories/in-memory/gyms.repository';
import { CreateGymUseCase } from './create-gym.case';

let gymsRepository: GymsInMemoryRepository;
let createGymUseCase: CreateGymUseCase;

describe('Criar Academias', () => {
    beforeEach(() => {
        gymsRepository = new GymsInMemoryRepository();
        createGymUseCase = new CreateGymUseCase(gymsRepository);
    });

    test('Deve poder se cadastrar', async () => {
        const { gym } = await createGymUseCase.execute({
            title: 'JavaScript Gym',
            description: null,
            phone: null,
            latitude: -22.893397,
            longitude: -43.477866,
        });

        expect(gym.id).toEqual(expect.any(String));
    });
});
