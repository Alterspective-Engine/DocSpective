import { FastifyInstance } from 'fastify';
import { shareDoService } from '../../services/ShareDoService';
import { CreateTemplateRequest } from '../../types/createTemplateRequest';

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

  // Create template endpoint
  fastify.post<{ Params: { templateSystemName: string }, Body: CreateTemplateRequest }>('/templates/:templateSystemName', {
    schema: {
      tags: ['ShareDo'],
      summary: 'Create document template',
      description: 'Create a new document template in ShareDo',
      params: {
        type: 'object',
        properties: {
          templateSystemName: {
            type: 'string',
            description: 'System name for the template (unique identifier)'
          }
        },
        required: ['templateSystemName']
      },
      body: {
        type: 'object',
        properties: {
          systemName: { type: 'string', description: 'System name for the template' },
          templateType: { type: 'string', description: 'Template type (e.g., document-internal)' },
          active: { type: 'boolean', description: 'Whether the template is active' },
          title: { type: 'string', description: 'Template title' },
          description: { type: 'string', description: 'Template description' },
          tags: { type: 'array', items: { type: 'string' }, description: 'Template tags' },
          processTags: { type: 'array', items: { type: 'string' }, description: 'Process tags' },
          toRoleRequired: { type: 'boolean', description: 'Whether to role is required' },
          regardingRoleRequired: { type: 'boolean', description: 'Whether regarding role is required' },
          toRoles: { type: 'array', items: { type: 'string' }, description: 'To roles' },
          regardingRoles: { type: 'array', items: { type: 'string' }, description: 'Regarding roles' },
          recipientLocationRequired: { type: 'boolean', description: 'Whether recipient location is required' },
          recipientConfig: {
            type: 'object',
            properties: {
              recipientLocationRequired: { type: 'boolean' }
            },
            description: 'Recipient configuration'
          },
          contextTypeSystemName: { type: 'string', description: 'Context type system name' },
          formIds: { type: 'array', items: { type: 'string' }, description: 'Form IDs' },
          approval: {
            type: 'object',
            properties: {
              competencySystemNames: { type: 'array', items: { type: 'string' } }
            },
            description: 'Approval configuration'
          },
          deliveryChannels: { type: 'array', items: { type: 'string' }, description: 'Delivery channels' },
          refreshOnDelivery: { type: 'boolean', description: 'Whether to refresh on delivery' },
          deliveryRefreshTags: { type: 'array', items: { type: 'string' }, description: 'Delivery refresh tags' },
          defaultFolderId: { type: 'number', description: 'Default folder ID' },
          outputDestinations: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                typeSystemName: { type: 'string' },
                repository: { type: 'string' },
                path: { type: 'string' }
              }
            },
            description: 'Output destinations'
          },
          pdfOptions: {
            type: 'object',
            properties: {
              generate: { type: 'boolean' },
              deleteOriginal: { type: 'boolean' },
              fileName: { type: 'string' }
            },
            description: 'PDF generation options'
          },
          packDocuments: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: ['string', 'null'] },
                type: { type: 'string' },
                outputTitle: { type: 'string' },
                outputFileName: { type: 'string' },
                copies: { type: 'number' },
                isMandatory: { type: 'boolean' },
                order: { type: 'number' },
                sources: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: ['string', 'null'] },
                      filePath: { type: 'string' },
                      order: { type: 'number' },
                      status: { type: ['string', 'null'] },
                      ruleSetSelection: {
                        type: 'object',
                        properties: {
                          operator: { type: 'string' },
                          ruleSetSystemNames: { type: 'array', items: { type: 'string' } }
                        }
                      }
                    }
                  }
                }
              }
            },
            description: 'Pack documents configuration'
          },
          templateRepository: { type: 'string', description: 'Template repository' },
          displayInMenus: { type: 'boolean', description: 'Whether to display in menus' },
          displayContexts: { type: 'array', items: { type: 'string' }, description: 'Display contexts' },
          displayRuleSetSelection: {
            type: 'object',
            properties: {
              operator: { type: 'string' },
              ruleSetSystemNames: { type: 'array', items: { type: 'string' } }
            },
            description: 'Display rule set selection'
          },
          legacyPhaseRestrictions: { type: 'array', items: { type: 'string' }, description: 'Legacy phase restrictions' },
          contentBlock: {
            type: 'object',
            properties: {
              availableForTemplateAuthors: { type: 'boolean' },
              availableForDocumentAuthors: { type: 'boolean' }
            },
            description: 'Content block configuration'
          },
          multiPartyTemplateSources: { type: 'array', items: { type: 'string' }, description: 'Multi-party template sources' },
          legalForm: {
            type: 'object',
            properties: {
              outputFileName: { type: 'string' },
              reference: { type: 'string' },
              fields: { type: 'array', items: { type: 'object' } }
            },
            description: 'Legal form configuration'
          }
        },
        required: ['systemName', 'templateType', 'active', 'title']
      },
      response: {
        200: {
          description: 'Template created successfully',
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Created template ID' }
          }
        },
        400: {
          description: 'Invalid request data',
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        },
        500: {
          description: 'Failed to create template',
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
            status: { type: 'number' },
            statusText: { type: 'string' },
            response: { description: 'Raw response from ShareDo API' }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { templateSystemName } = request.params;
      const templateData = request.body;

      // Ensure systemName matches the URL parameter
      templateData.systemName = templateSystemName;

      const result = await shareDoService.createTemplate(templateSystemName, templateData);
      return result;
    } catch (error) {
      fastify.log.error('Template creation failed: %s', error instanceof Error ? error.message : error);

      if (error instanceof Error && error.message.includes('400')) {
        return reply.status(400).send({
          error: 'Invalid request data',
          message: error.message
        });
      }

      return reply.status(500).send({
        error: 'Failed to create template',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}