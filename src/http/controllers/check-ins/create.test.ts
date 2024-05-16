import request from 'supertest';
import { app } from 'app';
import { afterAll, beforeAll, describe, expect } from 'vitest';
import { test } from 'vitest';
import { createAndAuthenticateUser } from 'utils/test/create-and-authenticate-user';
import { prisma } from 'lib/prisma';

describe('Create Checkin (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    test('Deve poder criar checkin', async () => {
        const { token } = await createAndAuthenticateUser(app);

        const gym = await prisma.gym.create({
            data: {
                title: 'JavaScript Gym',
                description: 'Some description',
                phone: '2199999999',
                latitude: -27.2092052,
                longitude: -49.6401091,
            },
        });

        const response = await request(app.server)
            .post(`/gyms/${gym.id}/check-ins`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                latitude: -27.2092052,
                longitude: -49.6401091,
            });

        expect(response.statusCode).toEqual(201);
    });
});
