import { FastifyInstance } from 'fastify';
import { shareDoService } from '../../services/ShareDoService';

export default async function tagsRoutes(fastify: FastifyInstance) {
  
  // Get template tags endpoint
  fastify.get('/tags', {
    schema: {
      tags: ['ShareDo'],
      summary: 'Get template tags',
      description: 'Retrieve available template tags and process tags from ShareDo',
      response: {
        200: {
          description: 'Tags retrieved successfully',
          type: 'object',
          properties: {
            tags: {
              type: 'array',
              items: { type: 'string' },
              description: 'List of available template tags'
            },
            processTags: {
              type: 'array', 
              items: { type: 'string' },
              description: 'List of available process tags'
            }
          },
          required: ['tags', 'processTags']
        },
        500: {
          description: 'Failed to retrieve tags',
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
      const tags = await shareDoService.getTags();
      return tags;
    } catch (error) {
      fastify.log.error('Failed to get tags: %s', error instanceof Error ? error.message : error);
      
      return reply.status(500).send({
        error: 'Failed to get tags',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}