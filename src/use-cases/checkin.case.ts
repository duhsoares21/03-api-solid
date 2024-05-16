import { CheckIn } from '@prisma/client';
import { CheckInsRepository } from 'repositories/checkins.repository';
import { GymsRepository } from 'repositories/gyms.repository';
import { ResourceNotFound } from './errors/resource-not-found.error';
import { getDistanceBetweenCoordinates } from 'utils/get-distance-between-coordinates';
import { MaxNumberOfCheckinsError } from './errors/max-number-of-checkins.error';
import { MaxDistanceError } from './errors/max-distance.error';

interface CheckInUseCaseRequest {
    userId: string;
    gymId: string;
    userLatitude: number;
    userLongitude: number;
}

interface CheckInUseCaseResponse {
    checkIn: CheckIn;
}

export class CheckInUseCase {
    constructor(
        private checkinsRepository: CheckInsRepository,
        private gymsRepository: GymsRepository,
    ) {}

    async execute({
        userId,
        gymId,
        userLatitude,
        userLongitude,
    }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
        const gym = await this.gymsRepository.findById(gymId);

        if (!gym) {
            throw new ResourceNotFound();
        }

        const distance = getDistanceBetweenCoordinates(
            { latitude: userLatitude, longitude: userLongitude },
            {
                latitude: gym.latitude.toNumber(),
                longitude: gym.longitude.toNumber(),
            },
        );

        const KM_MAX_DISTANCE = 0.1;

        if (distance > KM_MAX_DISTANCE) {
            throw new MaxDistanceError();
        }

        const checkInOnSameDay =
            await this.checkinsRepository.findByUserIdOnDate(
                userId,
                new Date(),
            );

        if (checkInOnSameDay) {
            throw new MaxNumberOfCheckinsError();
        }

        const checkIn = await this.checkinsRepository.create({
            user_id: userId,
            gym_id: gymId,
        });

        return {
            checkIn,
        };
    }
}
