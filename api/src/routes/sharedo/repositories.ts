import { FastifyInstance } from 'fastify';
import { ShareDoService } from '../../services/ShareDoService.js';

export default async function repositoriesRoutes(fastify: FastifyInstance) {
  const shareDoService = new ShareDoService();

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
                examples: ['inboundEmailStaging', 'documentTemplates', 'matterFiles']
              },
              name: {
                type: 'string',
                description: 'Human-readable repository name',
                examples: ['Email attachment staging store', 'Document Templates', 'Matter Files']
              },
              provider: {
                type: 'string',
                description: 'Repository provider type',
                examples: ['office-365', 'sharepoint', 'file-system']
              },
              configuration: {
                type: 'object',
                description: 'Repository configuration settings',
                properties: {
                  'context.graph': {
                    type: 'string',
                    description: 'Microsoft Graph context configuration'
                  },
                  'type.features': {
                    type: 'string',
                    description: 'Comma-separated list of supported repository features',
                    examples: ['DeleteFolders,DeleteFiles,OpenNatively,Upload,CreateFolders,DownloadCopy']
                  },
                  'type.host': {
                    type: 'string',
                    description: 'SharePoint host domain',
                    examples: ['slicedbreaduk.sharepoint.com']
                  },
                  'type.site': {
                    type: 'string',
                    description: 'SharePoint site path',
                    examples: ['/sites/sharedo-DemoAus']
                  },
                  'type.library': {
                    type: 'string',
                    description: 'SharePoint document library name',
                    examples: ['Admin', 'Documents', 'Shared Documents']
                  },
                  'type.folder': {
                    type: 'string',
                    description: 'Repository folder path template',
                    examples: ['EmailStaging/[Id]/', 'Templates/', 'Matters/[MatterId]/']
                  },
                  'type.expandMetadataFields': {
                    type: 'string',
                    description: 'Whether to expand metadata fields (true/false)'
                  },
                  'type.extensionBlacklist': {
                    type: 'string',
                    description: 'Comma-separated list of blocked file extensions',
                    examples: ['exe,com,dll', 'bat,scr,vbs']
                  }
                },
                additionalProperties: true
              },
              loaders: {
                type: 'array',
                description: 'Array of loader configurations',
                items: {
                  type: 'object',
                  description: 'Loader configuration object'
                }
              },
              fileMetaLoaders: {
                type: 'array',
                description: 'Array of file metadata loader configurations',
                items: {
                  type: 'object',
                  description: 'File metadata loader configuration object'
                }
              },
              contextGraph: {
                type: 'string',
                description: 'Context graph configuration'
              },
              contextEntityId: {
                type: ['string', 'null'],
                description: 'Context entity identifier'
              },
              contextExecuteCalculatedFields: {
                type: 'boolean',
                description: 'Whether to execute calculated fields in context'
              }
            },
            required: ['id', 'name', 'provider', 'configuration']
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
      reply.status(500).send({
        error: 'Failed to get repositories',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}