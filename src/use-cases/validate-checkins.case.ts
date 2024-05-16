import { CheckIn } from '@prisma/client';
import { CheckInsRepository } from 'repositories/checkins.repository';
import { GymsRepository } from 'repositories/gyms.repository';
import { ResourceNotFound } from './errors/resource-not-found.error';
import { getDistanceBetweenCoordinates } from 'utils/get-distance-between-coordinates';
import { MaxNumberOfCheckinsError } from './errors/max-number-of-checkins.error';
import { MaxDistanceError } from './errors/max-distance.error';
import dayjs from 'dayjs';
import { LateCheckinValidationError } from './errors/late-checkin-validation.error';

interface ValidateCheckInUseCaseRequest {
    checkinId: string;
}

interface ValidateCheckInUseCaseResponse {
    checkIn: CheckIn;
}

export class ValidateCheckInUseCase {
    constructor(private checkinsRepository: CheckInsRepository) {}

    async execute({
        checkinId,
    }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
        const checkIn = await this.checkinsRepository.findById(checkinId);

        if (!checkIn) {
            throw new ResourceNotFound();
        }

        const checkInDeltaTime = dayjs(new Date()).diff(
            checkIn.created_at,
            'minutes',
        );

        if (checkInDeltaTime > 20) {
            throw new LateCheckinValidationError();
        }

        checkIn.validated_at = new Date();

        await this.checkinsRepository.save(checkIn);

        return {
            checkIn,
        };
    }
}
