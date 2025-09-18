import { FastifyInstance } from 'fastify';
import { shareDoService } from '../../services/ShareDoService';

export default async function templatesRoutes(fastify: FastifyInstance) {

  // Get templates in folder endpoint
  fastify.get('/templates/:templateFolder', {
    schema: {
      tags: ['ShareDo'],
      summary: 'Get templates in folder',
      description: 'Retrieve document templates from a specific folder in ShareDo repository',
      params: {
        type: 'object',
        properties: {
          templateFolder: {
            type: 'string',
            description: 'Name of the template folder to retrieve templates from',
            required: []
          },
        },
      },
      response: {
        200: {
          description: 'Templates retrieved successfully',
          type: 'object',
          properties: {
            items: {
              type: 'array',
              description: 'List of templates and folders',
              items: {
                type: 'object',
                properties: {
                  type: { type: 'number', description: 'Item type (0 = file, 1 = folder)' },
                  id: { type: 'string', description: 'Unique identifier' },
                  pathId: { type: 'string', description: 'Path-based identifier' },
                  name: { type: 'string', description: 'Display name' },
                  title: { type: 'string', description: 'Title' },
                  size: { type: 'number', description: 'File size in bytes (files only)' },
                  extension: { type: 'string', description: 'File extension (files only)' },
                  icon: { type: 'string', description: 'FontAwesome icon class' },
                  url: { type: 'string', description: 'SharePoint URL for viewing' },
                  downloadUrl: { type: 'string', description: 'Download URL' },
                  lastModifiedDate: { type: 'string', format: 'date-time', description: 'Last modification date' },
                  lastModifiedBy: { type: 'string', description: 'Last modified by user' },
                  createdDate: { type: 'string', format: 'date-time', description: 'Creation date' },
                  meta: { type: 'object', description: 'SharePoint metadata' }
                }
              }
            },
            repositoryUrl: { type: 'string', description: 'SharePoint repository URL' }
          },
          required: ['items', 'repositoryUrl']
        },
        500: {
          description: 'Failed to retrieve templates',
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
      const { templateFolder } = request.params as { templateFolder: string };
      const templates = await shareDoService.getTemplates(templateFolder);
      return templates;
    } catch (error) {
      reply.status(500).send({
        error: 'Failed to get templates',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}