import { GymsInMemoryRepository } from 'repositories/in-memory/gyms.repository';
import { expect, describe, test, beforeEach } from 'vitest';
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms.case';

let gymsRepository: GymsInMemoryRepository;
let fetchNearbyGymsUseCase: FetchNearbyGymsUseCase;

describe('Busca de Academias próximas', () => {
    beforeEach(async () => {
        gymsRepository = new GymsInMemoryRepository();
        fetchNearbyGymsUseCase = new FetchNearbyGymsUseCase(gymsRepository);
    });

    test('Deve poder buscar por academias próximas', async () => {
        await gymsRepository.create({
            title: 'Near Gym',
            description: null,
            phone: null,
            latitude: -22.893397,
            longitude: -43.477866,
        });

        await gymsRepository.create({
            title: 'Far Gym',
            description: null,
            phone: null,
            latitude: -22.697929,
            longitude: -43.850425,
        });

        const { gyms } = await fetchNearbyGymsUseCase.execute({
            userLatitude: -22.891979,
            userLongitude: -43.47908,
        });

        expect(gyms).toHaveLength(1);
        expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })]);
    });
});
