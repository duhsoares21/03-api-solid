import { FastifyInstance } from 'fastify';
import { RegisterController } from './register.controller';
import { AuthenticateController } from './authenticate.controller';
import { ProfileController } from './profile.controller';
import { verifyJWT } from '../../middlewares/verify-jwt';
import { RefreshController } from './refresh.controller';

export async function usersRoutes(app: FastifyInstance) {
    const userController = new RegisterController();
    const authenticateController = new AuthenticateController();
    const profileController = new ProfileController();
    const refreshController = new RefreshController();

    app.post('/users', userController.execute);
    app.post('/sessions', authenticateController.execute);

    app.patch('/token/refresh', refreshController.execute);

    /* Rotas Authenticadas */
    app.get('/me', { onRequest: [verifyJWT] }, profileController.execute);
}
