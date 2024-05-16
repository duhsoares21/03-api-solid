import { FastifyReply, FastifyRequest } from 'fastify';

export function verifyUserRole(roleToVerifiy: 'ADMIN' | 'MEMBER') {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        const { role } = request.user;

        if (role !== roleToVerifiy) {
            return reply.status(401).send({ message: 'Unauthorized' });
        }
    };
}
