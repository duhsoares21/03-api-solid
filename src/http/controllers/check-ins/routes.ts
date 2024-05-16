import { FastifyInstance } from 'fastify';
import { verifyJWT } from '../../middlewares/verify-jwt';
import { CreateController } from './create.controller';
import { ValidateController } from './validate.controller';
import { HistoryController } from './history.controller';
import { MetricsController } from './metrics.controller';
import { verifyUserRole } from 'http/middlewares/verify-user-role';

export async function checkinsRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJWT);

    const createController = new CreateController();
    const validateController = new ValidateController();
    const historyController = new HistoryController();
    const metricsController = new MetricsController();

    app.get('/check-ins/history', historyController.execute);
    app.get('/check-ins/metrics', metricsController.execute);

    app.post('/gyms/:gymId/check-ins', createController.execute);
    app.patch(
        '/check-ins/:checkInId/validate',
        { onRequest: [verifyUserRole('ADMIN')] },
        validateController.execute,
    );
}
