import { expect, describe, test, beforeEach, afterEach, vi } from 'vitest';
import { CheckInsInMemoryRepository } from 'repositories/in-memory/checkins.repository';
import { ValidateCheckInUseCase } from './validate-checkins.case';
import { ResourceNotFound } from './errors/resource-not-found.error';

let checkinsRepository: CheckInsInMemoryRepository;
let validateCheckinUseCase: ValidateCheckInUseCase;

describe('Check-in', () => {
    beforeEach(async () => {
        checkinsRepository = new CheckInsInMemoryRepository();
        validateCheckinUseCase = new ValidateCheckInUseCase(checkinsRepository);

        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    test('Deve poder validar check-in', async () => {
        const createdCheckin = await checkinsRepository.create({
            gym_id: 'gym-01',
            user_id: 'user-01',
        });

        const { checkIn } = await validateCheckinUseCase.execute({
            checkinId: createdCheckin.id,
        });

        expect(checkIn.validated_at).toEqual(expect.any(Date));
        expect(checkinsRepository.items[0].validated_at).toEqual(
            expect.any(Date),
        );
    });

    test('Não deve poder validar check-in inexistente', async () => {
        await expect(() =>
            validateCheckinUseCase.execute({
                checkinId: 'inexistent-checkin',
            }),
        ).rejects.toBeInstanceOf(ResourceNotFound);
    });

    test('Não deve poder validar o check-in após 20 minutos', async () => {
        vi.setSystemTime(new Date(2023, 0, 1, 13, 40));

        const createdCheckin = await checkinsRepository.create({
            gym_id: 'gym-01',
            user_id: 'user-01',
        });

        const MINUTES_IN_MS = 1000 * 60 * 21;

        vi.advanceTimersByTime(MINUTES_IN_MS);

        await expect(() =>
            validateCheckinUseCase.execute({
                checkinId: createdCheckin.id,
            }),
        ).rejects.toBeInstanceOf(Error);
    });
});
