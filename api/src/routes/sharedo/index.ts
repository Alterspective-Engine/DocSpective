import { FastifyInstance } from 'fastify';
import authRoute from './auth';
import templatesRoute from './templates';
import templateTypesRoute from './templateTypes';
import workTypesRoute from './work-types';
import uploadRoute from './upload';
import participantTypeRoute from './participantTypes';

export default async function sharedoRoutes(fastify: FastifyInstance) {
  // Register all ShareDo route modules
  await fastify.register(authRoute);
  await fastify.register(templatesRoute);
  await fastify.register(templateTypesRoute);
  await fastify.register(workTypesRoute);
  await fastify.register(uploadRoute);
  await fastify.register(participantTypeRoute);
}