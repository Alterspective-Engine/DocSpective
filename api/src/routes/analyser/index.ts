import { FastifyInstance } from 'fastify';
import uploadRoute from './upload';
import registryRoute from './registry';
import convertRoute from './convert';
import deployRoute from './deploy';

export default async function analyserRoutes(fastify: FastifyInstance) {
  // Register all Document Analyser route modules
  await fastify.register(uploadRoute);
  await fastify.register(registryRoute);
  await fastify.register(convertRoute);
  await fastify.register(deployRoute);
}