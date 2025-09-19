import { FastifyInstance } from 'fastify';
import { shareDoService } from '../../services/ShareDoService';

export default async function repositoriesRoutes(fastify: FastifyInstance) {

  // Get repositories endpoint
  fastify.get('/repositories', {
    schema: {
      tags: ['ShareDo'],
      summary: 'Get repositories',
      description: 'Retrieve a list of available ShareDo repositories',
      response: {
        200: {
          description: 'Repositories retrieved successfully',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                description: 'Unique repository identifier',
                examples: ['client-documents', 'document-templates', 'matter-files']
              },
              name: {
                type: 'string',
                description: 'Human-readable repository name',
                examples: ['Client documents', 'Document Templates', 'Matter Files']
              },
              configuration: {
                type: 'object',
                description: 'Repository configuration settings',
                properties: {
                  encodedForwardSlash: {
                    type: 'string',
                    description: 'Encoded forward slash configuration'
                  },
                  invalidCharacters: {
                    type: 'string',
                    description: 'Invalid characters configuration'
                  }
                },
                required: ['encodedForwardSlash', 'invalidCharacters']
              }
            },
            required: ['id', 'name', 'configuration']
          }
        },
        500: {
          description: 'Failed to retrieve repositories',
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
      const repositories = await shareDoService.getRepositories();
      return repositories;
    } catch (error) {
      fastify.log.error('Failed to get repositories: %s', error instanceof Error ? error.message : error);
      
      return reply.status(500).send({
        error: 'Failed to get repositories',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}