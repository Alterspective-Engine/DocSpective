import { FastifyInstance } from 'fastify';
import { shareDoService } from '../../services/ShareDoService';

export default async function uploadRoutes(fastify: FastifyInstance) {

  // Upload document to ShareDo repository
  fastify.post('/templates/:templateFolder/upload', {
    schema: {
      tags: ['ShareDo'],
      summary: 'Upload document to ShareDo repository',
      description: 'Upload a document file to ShareDo repository templates',
      consumes: ['multipart/form-data'],
      params: {
        type: 'object',
        properties: {
          templateFolder: {
            type: 'string',
            description: 'Template folder to upload to'
          }
        }
      },
      body: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
            isFile: true
          }
        }
      },
      response: {
        200: {
          description: 'Document uploaded successfully',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              size: { 
                type: 'number', 
                description: 'File size in bytes' 
              },
              extension: { 
                type: 'string', 
                description: 'File extension including dot (e.g., .dotx)' 
              },
              icon: { 
                type: 'string', 
                description: 'FontAwesome icon class for the file type' 
              },
              url: { 
                type: 'string', 
                description: 'SharePoint URL for viewing the file' 
              },
              urls: { 
                type: ['object', 'null'], 
                description: 'Additional URLs (can be null)' 
              },
              downloadUrl: { 
                type: 'string', 
                description: 'Direct download URL path' 
              },
              urlMeta: { 
                type: 'object', 
                description: 'URL metadata object' 
              },
              versions: { 
                type: 'array', 
                description: 'File version history' 
              },
              editMetaUrl: { 
                type: 'string', 
                description: 'SharePoint edit metadata URL' 
              },
              type: { 
                type: 'number', 
                description: 'File type indicator' 
              },
              id: { 
                type: 'string', 
                description: 'Unique file identifier path' 
              },
              pathId: { 
                type: 'string', 
                description: 'File path identifier' 
              },
              name: { 
                type: 'string', 
                description: 'Full filename with extension' 
              },
              title: { 
                type: 'string', 
                description: 'File title without extension' 
              },
              lastModifiedDate: { 
                type: 'string', 
                format: 'date-time',
                description: 'Last modification timestamp' 
              },
              lastModifiedBy: { 
                type: 'string', 
                description: 'Username who last modified the file' 
              },
              createdDate: { 
                type: 'string', 
                format: 'date-time',
                description: 'File creation timestamp' 
              },
              meta: { 
                type: 'object', 
                description: 'Additional metadata object' 
              }
            },
            required: [
              'size', 'extension', 'icon', 'url', 'downloadUrl', 
              'urlMeta', 'versions', 'editMetaUrl', 'type', 'id', 
              'pathId', 'name', 'title', 'lastModifiedDate', 
              'lastModifiedBy', 'createdDate', 'meta'
            ]
          }
        },
        400: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        },
        500: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      // Get the uploaded file (same pattern as existing upload.ts)
      const data = await request.file();

      if (!data) {
        reply.status(400).send({
          error: 'No file uploaded'
        });
        return;
      }

      // Get template folder from params
      const params = request.params as { templateFolder?: string };
      const templateFolder = params.templateFolder;

      // Convert file to buffer
      const fileBuffer = await data.toBuffer();

      // Upload to ShareDo
      const result = await shareDoService.uploadDocument(
        fileBuffer,
        data.filename,
        templateFolder
      );

      return result;
    } catch (error) {
      reply.status(500).send({
        error: 'Failed to upload document to ShareDo',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}