import request from 'supertest';
import { app } from 'app';
import { afterAll, beforeAll, describe, expect } from 'vitest';
import { test } from 'vitest';
import { createAndAuthenticateUser } from 'utils/test/create-and-authenticate-user';
import { prisma } from 'lib/prisma';

describe('Validate Checkin (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    test('Deve poder validar o checkin', async () => {
        const { token } = await createAndAuthenticateUser(app, true);

        const user = await prisma.user.findFirstOrThrow();

        const gym = await prisma.gym.create({
            data: {
                title: 'JavaScript Gym',
                description: 'Some description',
                phone: '2199999999',
                latitude: -27.2092052,
                longitude: -49.6401091,
            },
        });

        let checkin = await prisma.checkIn.create({
            data: {
                gym_id: gym.id,
                user_id: user.id,
            },
        });

        const response = await request(app.server)
            .patch(`/check-ins/${checkin.id}/validate`)
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(response.statusCode).toEqual(204);

        checkin = await prisma.checkIn.findUniqueOrThrow({
            where: {
                id: checkin.id,
            },
        });

        expect(checkin.validated_at).toEqual(expect.any(Date));
    });
});
