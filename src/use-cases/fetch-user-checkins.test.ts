import { expect, describe, test, beforeEach } from 'vitest';
import { CheckInsInMemoryRepository } from 'repositories/in-memory/checkins.repository';
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-checkins.case';

let checkinsRepository: CheckInsInMemoryRepository;
let fetchUserCheckInsHistoryUseCase: FetchUserCheckInsHistoryUseCase;

describe('Histórico de Check-ins', () => {
    beforeEach(async () => {
        checkinsRepository = new CheckInsInMemoryRepository();
        fetchUserCheckInsHistoryUseCase = new FetchUserCheckInsHistoryUseCase(
            checkinsRepository,
        );
    });

    test('Deve poder buscar histórico de checkins', async () => {
        await checkinsRepository.create({
            gym_id: 'gym-01',
            user_id: 'user-01',
        });

        await checkinsRepository.create({
            gym_id: 'gym-02',
            user_id: 'user-01',
        });

        const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
            userId: 'user-01',
            page: 1,
        });

        expect(checkIns).toHaveLength(2);
        expect(checkIns).toEqual([
            expect.objectContaining({ gym_id: 'gym-01' }),
            expect.objectContaining({ gym_id: 'gym-02' }),
        ]);
    });

    test('Deve poder buscar histórico de checkins paginado', async () => {
        for (let i = 1; i <= 22; i++) {
            await checkinsRepository.create({
                gym_id: `gym-${i}`,
                user_id: 'user-01',
            });
        }

        const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
            userId: 'user-01',
            page: 2,
        });

        expect(checkIns).toHaveLength(2);
        expect(checkIns).toEqual([
            expect.objectContaining({ gym_id: 'gym-21' }),
            expect.objectContaining({ gym_id: 'gym-22' }),
        ]);
    });
});
