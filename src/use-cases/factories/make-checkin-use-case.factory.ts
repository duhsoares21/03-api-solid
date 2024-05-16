import { CheckinsPrismaRepository } from 'repositories/prisma/checkins.repository';
import { GymsPrismaRepository } from 'repositories/prisma/gyms.repository';
import { CheckInUseCase } from 'use-cases/checkin.case';

export function MakeCheckInUseCase() {
    const checkinsRepository = new CheckinsPrismaRepository();
    const gymsRepository = new GymsPrismaRepository();

    const useCase = new CheckInUseCase(checkinsRepository, gymsRepository);

    return useCase;
}
