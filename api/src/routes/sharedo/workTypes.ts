import { FastifyInstance } from 'fastify';
import { shareDoService } from '../../services/ShareDoService';

export default async function workTypesRoutes(fastify: FastifyInstance) {

  // Get work types endpoint
  fastify.get('/workTypes', {
    schema: {
      tags: ['ShareDo'],
      summary: 'Get work types',
      description: 'Retrieve all available work types from ShareDo modeller',
      response: {
        200: {
          description: 'Work types retrieved successfully',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              systemName: {
                type: 'string',
                description: 'System identifier for the work type',
                examples: ['account-adjustment', 'ud-global-admin-tasks']
              },
              name: {
                type: 'string',
                description: 'Human-readable name of the work type',
                examples: ['Account Adjustment', 'Admin Tasks']
              },
              icon: {
                type: 'string',
                description: 'FontAwesome icon class for the work type',
                examples: ['fa-money', 'fa-tasks']
              },
              description: {
                type: ['string', 'null'],
                description: 'Description of the work type purpose'
              },
              isActive: {
                type: 'boolean',
                description: 'Whether the work type is currently active'
              },
              isAbstract: {
                type: 'boolean',
                description: 'Whether this is an abstract type (parent of other types)'
              },
              isCoreType: {
                type: 'boolean',
                description: 'Whether this is a core system type'
              },
              tileColour: {
                type: ['string', 'null'],
                description: 'Hex color code for UI tile display',
                examples: ['#999999', '#2779BD']
              },
              systemNamePath: {
                type: 'string',
                description: 'Full system path for the work type',
                examples: ['/account-adjustment/', '/ud-global-admin-tasks/']
              },
              derivedTypes: {
                type: 'array',
                description: 'Child work types derived from this type',
                items: {
                  type: 'object',
                  properties: {
                    systemName: { type: 'string' },
                    name: { type: 'string' },
                    icon: { type: 'string' },
                    description: { type: ['string', 'null'] },
                    isActive: { type: 'boolean' },
                    isAbstract: { type: 'boolean' },
                    isCoreType: { type: 'boolean' },
                    tileColour: { type: ['string', 'null'] },
                    systemNamePath: { type: 'string' },
                    derivedTypes: { type: 'array' },
                    hasPortals: { type: 'boolean' }
                  }
                }
              },
              hasPortals: {
                type: 'boolean',
                description: 'Whether the work type has portal functionality'
              }
            }
          }
        },
        500: {
          description: 'Failed to retrieve work types',
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
      const workTypes = await shareDoService.getWorkTypes();
      return workTypes;
    } catch (error) {
      reply.status(500).send({
        error: 'Failed to get work types',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}