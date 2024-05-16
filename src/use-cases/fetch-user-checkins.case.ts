import { CheckIn } from '@prisma/client';
import { CheckInsRepository } from 'repositories/checkins.repository';

interface FetchUserCheckInsHistoryUseCaseRequest {
    userId: string;
    page: number;
}

interface FetchUserCheckInsHistoryUseCaseResponse {
    checkIns: CheckIn[];
}

export class FetchUserCheckInsHistoryUseCase {
    constructor(private checkinsRepository: CheckInsRepository) {}

    async execute({
        userId,
        page,
    }: FetchUserCheckInsHistoryUseCaseRequest): Promise<FetchUserCheckInsHistoryUseCaseResponse> {
        const checkIns = await this.checkinsRepository.findManyByUserId(
            userId,
            page,
        );

        return {
            checkIns,
        };
    }
}
