import { FastifyInstance } from 'fastify';
import { shareDoService } from '../../services/ShareDoService';

export default async function participantsRoutes(fastify: FastifyInstance) {

  // Get participant types endpoint
  fastify.get('/participants/types', {
    schema: {
      tags: ['ShareDo'],
      summary: 'Get participant types',
      description: 'Retrieve all available participant types from ShareDo',
      response: {
        200: {
          description: 'Participant types retrieved successfully',
          type: 'object',
          properties: {
            participantTypes: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  systemName: {
                    type: 'string',
                    description: 'System identifier for the participant type'
                  },
                  name: {
                    type: 'string',
                    description: 'Display name for the participant type'
                  },
                  description: {
                    type: 'string',
                    description: 'Description of the participant type'
                  },
                  iconClass: {
                    type: 'string',
                    description: 'CSS class for the icon'
                  },
                  enabled: {
                    type: 'boolean',
                    description: 'Whether this participant type is enabled'
                  },
                  odsEntityTypeSystemName: {
                    type: 'string',
                    description: 'ODS entity type system name'
                  },
                  onAddParticipantMenu: {
                    type: 'boolean',
                    description: 'Whether to show on add participant menu'
                  },
                  isPerson: {
                    type: 'boolean',
                    description: 'Flag indicating if this is a person type'
                  },
                  isUser: {
                    type: 'boolean',
                    description: 'Flag indicating if this is a user type'
                  },
                  isTeam: {
                    type: 'boolean',
                    description: 'Flag indicating if this is a team type'
                  },
                  isOrganisation: {
                    type: 'boolean',
                    description: 'Flag indicating if this is an organisation type'
                  }
                },
              }
            },
            partyTypes: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  systemName: {
                    type: 'string',
                    description: 'System identifier for the party type'
                  },
                  name: {
                    type: 'string',
                    description: 'Display name for the party type'
                  },
                  description: {
                    type: 'string',
                    description: 'Description of the party type'
                  },
                  isPersonTag: {
                    type: 'boolean',
                    description: 'Flag indicating if this is a person tag'
                  },
                  isOrganisationTag: {
                    type: 'boolean',
                    description: 'Flag indicating if this is an organisation tag'
                  },
                  isUserTag: {
                    type: 'boolean',
                    description: 'Flag indicating if this is a user tag'
                  },
                  canHaveTeamsOrUsers: {
                    type: 'boolean',
                    description: 'Whether this party type can have teams or users'
                  },
                  isTeamTag: {
                    type: 'boolean',
                    description: 'Flag indicating if this is a team tag'
                  },
                  readPermission: {
                    type: ['string', 'null'],
                    description: 'Read permission setting'
                  },
                  assignPermission: {
                    type: ['string', 'null'],
                    description: 'Assign permission setting'
                  },
                  updatePermission: {
                    type: ['string', 'null'],
                    description: 'Update permission setting'
                  },
                  isActive: {
                    type: 'boolean',
                    description: 'Whether this party type is active'
                  },
                  enableForSearch: {
                    type: 'boolean',
                    description: 'Whether to enable for search'
                  },
                  enableQuickLink: {
                    type: 'boolean',
                    description: 'Whether to enable quick link'
                  },
                  roleRestrictionRuleTypeId: {
                    type: ['number', 'null'],
                    description: 'Role restriction rule type ID'
                  },
                  iconClass: {
                    type: 'string',
                    description: 'CSS class for the icon'
                  },
                  displayColour: {
                    type: ['string', 'null'],
                    pattern: '^#[0-9A-Fa-f]{6}$|^null$',
                    description: 'Hex color code for display (e.g., #FF0000) or null'
                  }
                },
              }
            }
          },
          required: ['participantTypes', 'partyTypes']
        },
        500: {
          description: 'Failed to retrieve participant types',
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
      const participantTypes = await shareDoService.getParticipantTypes();
      return participantTypes;
    } catch (error) {
      reply.status(500).send({
        error: 'Failed to get participant types',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}