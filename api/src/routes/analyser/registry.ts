import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DocAnalyserService } from '../../services/DocAnalyserService';

export default async function registryRoutes(fastify: FastifyInstance) {
  fastify.get('/registry', {
    schema: {
      description: 'Get all templates from the registry',
      tags: ['Document Analyser'],
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              template_type: { type: 'string' },
              sharedo_pathid: { type: 'string' },
              sharedo_downloadurl: { type: 'string' },
              system_name: { type: 'string' },
              name: { type: 'string' },
              categories: { type: 'string' },
              data_context: { type: 'string' },
              participant_role: { type: 'string' },
              output_title: { type: 'string' },
              output_file_name: { type: 'string' },
              document_source: { type: 'string' },
              docid: { type: 'string' },
              batch_id: { type: 'string' },
              converted_file_path: { type: 'string' },
            }
          }
        },
        500: {
          type: 'string'
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const docAnalyserService = new DocAnalyserService();
      const templates = await docAnalyserService.getTemplates();
      await docAnalyserService.close();

      return templates;

    } catch (error) {
      fastify.log.error('Registry query failed: %s', error instanceof Error ? error.message : error);
      return reply.status(500).send(error instanceof Error ? error.message : 'Unknown error');
    }
  });
}
