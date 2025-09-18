import { FastifyInstance } from 'fastify';
import { shareDoService } from '../../services/ShareDoService';

export default async function templateTypesRoutes(fastify: FastifyInstance) {

  // Get template types endpoint
  fastify.get('/templateTypes', {
    schema: {
      tags: ['ShareDo'],
      summary: 'Get template types',
      description: 'Retrieve all available document template types from ShareDo',
      response: {
        200: {
          description: 'Template types retrieved successfully',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'Human-readable name of the template type',
                examples: ['Document - Internal', 'Document - Issued', 'Pass Through Generator']
              },
              systemName: {
                type: 'string',
                description: 'System identifier for the template type',
                examples: ['document-internal', 'document-issued', 'core-straight-through']
              }
            },
            required: ['name', 'systemName']
          }
        },
        500: {
          description: 'Failed to retrieve template types',
          type: 'object',
          properties: {
            error: { type: 'string', description: 'Error message' },
            message: { type: 'string', description: 'Detailed error description' },
            status: { type: 'number', description: 'HTTP status code' },
            statusText: { type: 'string', description: 'HTTP status text' },
            response: { description: 'Raw response from ShareDo API' }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const templateTypes = await shareDoService.getTemplateTypes();
      return templateTypes;
    } catch (error) {
      reply.status(500).send({
        error: 'Failed to get template types',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}