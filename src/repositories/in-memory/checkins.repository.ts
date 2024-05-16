import { CheckIn, Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import { randomUUID } from 'node:crypto';
import { CheckInsRepository } from 'repositories/checkins.repository';

export class CheckInsInMemoryRepository implements CheckInsRepository {
    async findByUserIdOnDate(userId: string, date: Date) {
        const startOfTheDay = dayjs(date).startOf('date');
        const endOfTheDay = dayjs(date).endOf('date');

        const checkinOnSameDate = this.items.find((checkin) => {
            const checkInDate = dayjs(checkin.created_at);
            const isOnSameDate =
                checkInDate.isAfter(startOfTheDay) &&
                checkInDate.isBefore(endOfTheDay);

            return checkin.user_id === userId && isOnSameDate;
        });

        if (!checkinOnSameDate) {
            return null;
        }

        return checkinOnSameDate;
    }

    public items: CheckIn[] = [];

    async findById(checkinId: string) {
        const checkIn = this.items.find((item) => item.id === checkinId);

        if (!checkIn) {
            return null;
        }

        return checkIn;
    }

    async findManyByUserId(userId: string, page: number) {
        return this.items
            .filter((item) => item.user_id === userId)
            .slice((page - 1) * 20, page * 20);
    }

    async countByUserId(userId: string) {
        return this.items.filter((item) => item.user_id === userId).length;
    }

    async create(data: Prisma.CheckInUncheckedCreateInput) {
        const checkin = {
            id: randomUUID(),
            user_id: data.user_id,
            gym_id: data.gym_id,
            validated_at: data.validated_at
                ? new Date(data.validated_at)
                : null,
            created_at: new Date(),
            updated_at: new Date(),
        };

        this.items.push(checkin);

        return checkin;
    }

    async save(checkIn: CheckIn) {
        const checkInIndex = this.items.findIndex(
            (item) => item.id === checkIn.id,
        );

        if (checkInIndex >= 0) {
            this.items[checkInIndex] = checkIn;
        }

        return checkIn;
    }
}
