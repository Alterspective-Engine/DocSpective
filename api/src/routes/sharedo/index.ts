import { FastifyInstance } from 'fastify';
import authRoute from './auth';
import documentsRoute from './documents';
import templatesRoute from './templates';
import workTypesRoute from './workTypes';
import participantsRoute from './participants';
import tagsRoute from './tags';
import repositoryRoutes from './repositories';

export default async function sharedoRoutes(fastify: FastifyInstance) {
  // Register all ShareDo route modules
  await fastify.register(authRoute);
  await fastify.register(documentsRoute);
  await fastify.register(templatesRoute);
  await fastify.register(workTypesRoute);
  await fastify.register(participantsRoute);
  await fastify.register(tagsRoute);
  await fastify.register(repositoryRoutes);
}