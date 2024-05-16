import { expect, describe, test, beforeEach } from 'vitest';
import { CheckInsInMemoryRepository } from 'repositories/in-memory/checkins.repository';
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-checkins.case';
import { GetUserMetricsUseCase } from './get-user-metrics.case';

let checkinsRepository: CheckInsInMemoryRepository;
let getUserMetricsUseCase: GetUserMetricsUseCase;

describe('Métricas do Usuário', () => {
    beforeEach(async () => {
        checkinsRepository = new CheckInsInMemoryRepository();
        getUserMetricsUseCase = new GetUserMetricsUseCase(checkinsRepository);
    });

    test('Deve poder buscar métricas do usuário', async () => {
        await checkinsRepository.create({
            gym_id: 'gym-01',
            user_id: 'user-01',
        });

        await checkinsRepository.create({
            gym_id: 'gym-02',
            user_id: 'user-01',
        });

        const { checkInsCount } = await getUserMetricsUseCase.execute({
            userId: 'user-01',
        });

        expect(checkInsCount).toEqual(2);
    });
});
