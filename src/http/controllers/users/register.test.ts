import request from 'supertest';
import { app } from 'app';
import { afterAll, beforeAll, describe, expect } from 'vitest';
import { test } from 'vitest';

describe('Register (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    test('Deve poder se cadastrar', async () => {
        const response = await request(app.server).post('/users').send({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        expect(response.statusCode).toEqual(201);
    });
});
