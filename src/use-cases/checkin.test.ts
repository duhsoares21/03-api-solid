import { expect, describe, test, beforeEach, afterEach, vi } from 'vitest';
import { CheckInsInMemoryRepository } from 'repositories/in-memory/checkins.repository';
import { CheckInUseCase } from './checkin.case';
import { GymsInMemoryRepository } from 'repositories/in-memory/gyms.repository';
import { Decimal } from '@prisma/client/runtime/library';
import { MaxNumberOfCheckinsError } from './errors/max-number-of-checkins.error';
import { MaxDistanceError } from './errors/max-distance.error';

let checkinsRepository: CheckInsInMemoryRepository;
let gymsRepository: GymsInMemoryRepository;
let checkinUseCase: CheckInUseCase;

describe('Check-in', () => {
    beforeEach(async () => {
        checkinsRepository = new CheckInsInMemoryRepository();
        gymsRepository = new GymsInMemoryRepository();
        checkinUseCase = new CheckInUseCase(checkinsRepository, gymsRepository);

        await gymsRepository.create({
            id: 'gym-01',
            title: 'Javascript Gym',
            description: '',
            phone: '',
            latitude: -22.893397,
            longitude: -43.477866,
            created_at: new Date(),
            updated_at: new Date(),
        });

        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    test('Deve poder fazer check-in', async () => {
        const { checkIn } = await checkinUseCase.execute({
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: -22.893397,
            userLongitude: -43.477866,
        });

        expect(checkIn.id).toEqual(expect.any(String));
    });

    test('Não deve poder fazer check-in duas vezes no mesmo dia', async () => {
        vi.setSystemTime(new Date(2002, 0, 15, 8, 0, 0));

        await checkinUseCase.execute({
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: -22.893397,
            userLongitude: -43.477866,
        });

        await expect(
            checkinUseCase.execute({
                userId: 'user-01',
                gymId: 'gym-01',
                userLatitude: -22.893397,
                userLongitude: -43.477866,
            }),
        ).rejects.toBeInstanceOf(MaxNumberOfCheckinsError);
    });

    test('Deve poder fazer check-in duas vezes em dias diferentes', async () => {
        vi.setSystemTime(new Date(2002, 0, 15, 8, 0, 0));

        await checkinUseCase.execute({
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: -22.893397,
            userLongitude: -43.477866,
        });

        vi.setSystemTime(new Date(2002, 0, 16, 8, 0, 0));

        const { checkIn } = await checkinUseCase.execute({
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: -22.893397,
            userLongitude: -43.477866,
        });

        expect(checkIn.id).toEqual(expect.any(String));
    });

    test('Não deve poder fazer check-in em academias distantes', async () => {
        gymsRepository.items.push({
            id: 'gym-02',
            title: 'Javascript Gym',
            description: '',
            phone: '',
            latitude: new Decimal(-22.893397),
            longitude: new Decimal(-43.477866),
            created_at: new Date(),
            updated_at: new Date(),
        });

        await expect(
            checkinUseCase.execute({
                gymId: 'gym-02',
                userId: 'user-01',
                userLatitude: -22.891979,
                userLongitude: -43.47908,
            }),
        ).rejects.toBeInstanceOf(MaxDistanceError);

        /*-22,89207, -43,478851 - Montaria (70m)
        -22,891979, -43,47908 - Cairo 
        -22,893397, -43,477866 - Tibagi (400m)*/
    });
});
