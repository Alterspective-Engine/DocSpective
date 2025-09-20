import { FastifyInstance, FastifyRequest } from 'fastify';
import { shareDoService } from '../../services/ShareDoService';
import { CreateTemplateRequest } from '../../types/createTemplateRequest';

export default async function templatesRoutes(fastify: FastifyInstance) {

  // Get template types endpoint
  fastify.get('/templates/types', {
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

  // Create template endpoint
  fastify.post<{ Params: { systemName: string }, Body: CreateTemplateRequest }>('/templates/:systemName', {
    schema: {
      tags: ['ShareDo'],
      summary: 'Create document template',
      description: 'Create a new document template in ShareDo',
      params: {
        type: 'object',
        properties: {
          systemName: {
            type: 'string',
            description: 'System name for the template (unique identifier)'
          }
        },
        required: ['systemName']
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
      const { systemName } = request.params;
      const templateData = request.body;

      // Ensure systemName matches the URL parameter
      templateData.systemName = systemName;

      const result = await shareDoService.createTemplate(systemName, templateData);
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

  // Delete template endpoint
  fastify.delete('/templates/:systemName', {
    schema: {
      tags: ['ShareDo'],
      summary: 'Delete a ShareDo template',
      description: 'Delete a document template from ShareDo by system name',
      params: {
        type: 'object',
        properties: {
          systemName: {
            type: 'string',
            description: 'System name of the template to delete'
          }
        },
        required: ['systemName']
      },
      response: {
        200: {
          description: 'Template deletion status',
          type: 'object',
          properties: {
            itemDeleted: {
              type: 'boolean',
              description: 'Whether the template was successfully deleted'
            }
          }
        },
        404: {
          description: 'Template not found',
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        },
        500: {
          description: 'Server error',
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request: FastifyRequest<{ Params: { systemName: string } }>, reply) => {
    try {
      const { systemName } = request.params;

      fastify.log.info(`[DELETE Template] Attempting to delete template: ${systemName}`);
      
      const result = await shareDoService.deleteTemplate(systemName);
      
      fastify.log.info(`[DELETE Template] ShareDo response: ${JSON.stringify(result)}`);
      
      return result;
    } catch (error) {
      fastify.log.error('Template deletion failed: %s', error instanceof Error ? error.message : error);

      if (error instanceof Error && error.message.includes('404')) {
        return reply.status(404).send({
          error: 'Template not found',
          message: error.message
        });
      }

      return reply.status(500).send({
        error: 'Failed to delete template',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}