import { FastifyInstance } from 'fastify';
import { verifyJWT } from '../../middlewares/verify-jwt';
import { CreateController } from './create.controller';
import { SearchController } from './search.controller';
import { NearbyController } from './nearby.controller';
import { verifyUserRole } from 'http/middlewares/verify-user-role';

export async function gymsRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJWT);

    const createController = new CreateController();
    const searchController = new SearchController();
    const nearbyController = new NearbyController();

    app.post(
        '/gyms',
        { onRequest: [verifyUserRole('ADMIN')] },
        createController.execute,
    );

    app.get('/gyms/search', searchController.execute);
    app.get('/gyms/nearby', nearbyController.execute);
}
