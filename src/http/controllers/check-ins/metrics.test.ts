import request from 'supertest';
import { app } from 'app';
import { afterAll, beforeAll, describe, expect } from 'vitest';
import { test } from 'vitest';
import { createAndAuthenticateUser } from 'utils/test/create-and-authenticate-user';
import { prisma } from 'lib/prisma';

describe('Checkin Metrics (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    test('Deve poder listar o total de checkins', async () => {
        const { token } = await createAndAuthenticateUser(app);

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

        await prisma.checkIn.createMany({
            data: [
                {
                    gym_id: gym.id,
                    user_id: user.id,
                },
                {
                    gym_id: gym.id,
                    user_id: user.id,
                },
            ],
        });

        const response = await request(app.server)
            .get('/check-ins/metrics')
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(response.statusCode).toEqual(200);
        expect(response.body.checkInsCount).toEqual(2);
    });
});
