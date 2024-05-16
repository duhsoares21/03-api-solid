import { CheckinsPrismaRepository } from 'repositories/prisma/checkins.repository';
import { ValidateCheckInUseCase } from 'use-cases/validate-checkins.case';

export function MakeValidateCheckinUseCase() {
    const repository = new CheckinsPrismaRepository();
    const useCase = new ValidateCheckInUseCase(repository);

    return useCase;
}
