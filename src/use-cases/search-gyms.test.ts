import { GymsInMemoryRepository } from 'repositories/in-memory/gyms.repository';
import { expect, describe, test, beforeEach } from 'vitest';
import { SearchGymsUseCase } from './search-gyms.case';

let gymsRepository: GymsInMemoryRepository;
let searchGymsUseCase: SearchGymsUseCase;

describe('Busca de Academias por nome', () => {
    beforeEach(async () => {
        gymsRepository = new GymsInMemoryRepository();
        searchGymsUseCase = new SearchGymsUseCase(gymsRepository);
    });

    test('Deve poder buscar por academias', async () => {
        await gymsRepository.create({
            title: 'JavaScript Gym',
            description: null,
            phone: null,
            latitude: -22.893397,
            longitude: -43.477866,
        });

        await gymsRepository.create({
            title: 'TypeScript Gym',
            description: null,
            phone: null,
            latitude: -22.893397,
            longitude: -43.477866,
        });

        const { gyms } = await searchGymsUseCase.execute({
            query: 'JavaScript',
            page: 1,
        });

        expect(gyms).toHaveLength(1);
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'JavaScript Gym' }),
        ]);
    });

    test('Deve poder buscar por academias de forma paginada', async () => {
        for (let i = 1; i <= 22; i++) {
            await gymsRepository.create({
                title: `JavaScript Gym ${i}`,
                description: null,
                phone: null,
                latitude: -22.893397,
                longitude: -43.477866,
            });
        }

        const { gyms } = await searchGymsUseCase.execute({
            query: 'JavaScript',
            page: 2,
        });

        expect(gyms).toHaveLength(2);
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'JavaScript Gym 21' }),
            expect.objectContaining({ title: 'JavaScript Gym 22' }),
        ]);
    });
});
