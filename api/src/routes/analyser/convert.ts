import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DocAnalyserService } from '../../services/DocAnalyserService';

interface ConvertQuery {
  docid: string;
}

export default async function convertRoutes(fastify: FastifyInstance) {
  fastify.post<{ Querystring: ConvertQuery }>('/convert', {
    schema: {
      description: 'Convert a document to DOCX format and update the convertedFilePath',
      tags: ['Document Analyser'],
      querystring: {
        type: 'object',
        properties: {
          docid: { type: 'string' }
        },
        required: ['docid']
      },
      response: {
        200: {
          type: 'object',
          properties: {
            docid: { type: 'string' },
            convertedFilePath: { type: 'string' }
          }
        },
        400: {
          type: 'string'
        },
        404: {
          type: 'string'
        },
        500: {
          type: 'string'
        }
      }
    }
  }, async (request: FastifyRequest<{ Querystring: ConvertQuery }>, reply: FastifyReply) => {
    try {
      const { docid } = request.query;
      const docAnalyserService = new DocAnalyserService();

      const result = await docAnalyserService.convertDocumentWorkflow(docid);
      
      await docAnalyserService.close();
      
      return result;

    } catch (error) {
      fastify.log.error('Document conversion failed: %s', error instanceof Error ? error.message : error);
      
      if (error instanceof Error && error.message.includes('not found')) {
        return reply.status(404).send(error.message);
      }
      
      return reply.status(500).send(error instanceof Error ? error.message : 'Unknown error');
    }
  });
}