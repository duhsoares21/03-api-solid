import request from 'supertest';
import { app } from 'app';
import { afterAll, beforeAll, describe, expect } from 'vitest';
import { test } from 'vitest';
import { createAndAuthenticateUser } from 'utils/test/create-and-authenticate-user';

describe('Create Gym (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    test('Deve poder encontrar academias próximas', async () => {
        const { token } = await createAndAuthenticateUser(app, true);
        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'JavaScript Gym',
                description: 'Some description',
                phone: '2199999999',
                latitude: -22.893397,
                longitude: -43.477866,
            });

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'TypeScript Gym',
                description: 'Some description',
                phone: '2199999999',
                latitude: -22.697929,
                longitude: -43.850425,
            });

        const response = await request(app.server)
            .get('/gyms/nearby')
            .query({
                latitude: -22.893397,
                longitude: -43.477866,
            })
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(response.statusCode).toEqual(200);
        expect(response.body.gyms).toHaveLength(1);
        expect(response.body.gyms).toEqual([
            expect.objectContaining({
                title: 'JavaScript Gym',
            }),
        ]);
    });
});
