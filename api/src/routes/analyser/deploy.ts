import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DocAnalyserService } from '../../services/DocAnalyserService';

interface DeployBody {
  docid: string;
  templateFolder: string;
}

export default async function deployRoutes(fastify: FastifyInstance) {
  
  fastify.post<{ Body: DeployBody }>('/deploy', {
    schema: {
      description: 'Deploy a document as a ShareDo template',
      tags: ['Document Analyser'],
      body: {
        type: 'object',
        properties: {
          docid: { 
            type: 'string',
            description: 'Document ID to deploy as template'
          },
          templateFolder: {
            type: 'string',
            description: 'ShareDo template folder/repository name'
          }
        },
        required: ['docid', 'templateFolder']
      },
      response: {
        200: {
          description: 'Template deployed successfully',
          type: 'object',
          properties: {
            id: { 
              type: 'string', 
              description: 'Created template ID from ShareDo' 
            }
          }
        },
        400: {
          description: 'Invalid request body or missing template data',
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        },
        404: {
          description: 'Document not found',
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        },
        500: {
          description: 'Failed to deploy template',
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request: FastifyRequest<{ Body: DeployBody }>, reply: FastifyReply) => {
    try {
      const { docid, templateFolder } = request.body;

      if (!docid) {
        return reply.status(400).send({
          error: 'Invalid request',
          message: 'docid is required in request body'
        });
      }

      if (!templateFolder) {
        return reply.status(400).send({
          error: 'Invalid request',
          message: 'templateFolder is required in request body'
        });
      }

      // Initialize DocAnalyserService
      const docAnalyserService = new DocAnalyserService();

      // Deploy template to ShareDo using the service
      const result = await docAnalyserService.deployToShareDo(docid, templateFolder);
      
      fastify.log.info(`Template deployed successfully for docid: ${docid}, templateFolder: ${templateFolder}, ShareDo template ID: ${result.id}`);
      
      return result;

    } catch (error) {
      fastify.log.error('Template deployment failed: %s', error instanceof Error ? error.message : error);

      if (error instanceof Error) {
        if (error.message.includes('400')) {
          return reply.status(400).send({
            error: 'Invalid template data',
            message: error.message
          });
        }
        
        if (error.message.includes('not found') || error.message.includes('404')) {
          return reply.status(404).send({
            error: 'Document not found',
            message: error.message
          });
        }
      }

      return reply.status(500).send({
        error: 'Failed to deploy template',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}