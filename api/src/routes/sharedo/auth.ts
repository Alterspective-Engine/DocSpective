import { FastifyInstance } from 'fastify';
import { shareDoService } from '../../services/ShareDoService';

export default async function authRoutes(fastify: FastifyInstance) {
  // Auth status endpoint
  fastify.get('/auth/status', {
    schema: {
      tags: ['ShareDo'],
      summary: 'Get ShareDo authentication status',
      description: 'Check authentication status and get access token information. Returns cached token if valid, fetches new token if expired.',
      response: {
        200: {
          description: 'Authentication successful',
          type: 'object',
          properties: {
            access_token: { type: 'string', description: 'Bearer access token for ShareDo API' },
            expires_in: { type: 'number', description: 'Token expiration time in seconds' },
            token_type: { type: 'string', description: 'Token type (typically "Bearer")' },
            cached: { type: 'boolean', description: 'Whether token was retrieved from cache' },
            expires_at: { type: 'number', description: 'Unix timestamp when token expires' }
          },
          required: ['access_token', 'token_type']
        },
        500: {
          description: 'Authentication failed',
          type: 'object',
          properties: {
            error: { type: 'string', description: 'Error message' },
            message: { type: 'string', description: 'Detailed error description' },
            missing: {
              type: 'array',
              items: { type: 'string' },
              description: 'List of missing environment variables'
            },
            status: { type: 'number', description: 'HTTP status code from ShareDo' },
            statusText: { type: 'string', description: 'HTTP status text from ShareDo' },
            response: { description: 'Raw response from ShareDo API' }
          },
          required: ['error']
        }
      }
    }
  }, async (request, reply) => {
    try {
      const authResponse = await shareDoService.getAuthStatus();
      return authResponse;
    } catch (error) {
      reply.status(500).send({
        error: 'Failed to get authentication status',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}