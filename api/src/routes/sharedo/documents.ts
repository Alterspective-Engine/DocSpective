import { FastifyInstance, FastifyRequest } from 'fastify';
import { shareDoService } from '../../services/ShareDoService';

export default async function documentsRoutes(fastify: FastifyInstance) {

  // Get documents in folder endpoint
  fastify.get('/documents/:folder', {
    schema: {
      tags: ['ShareDo'],
      summary: 'Get documents in folder',
      description: 'Retrieve document templates from a specific folder in ShareDo repository',
      params: {
        type: 'object',
        properties: {
          folder: {
            type: 'string',
            description: 'Name of the folder to retrieve documents from',
            required: []
          },
        },
      },
      response: {
        200: {
          description: 'Documents retrieved successfully',
          type: 'object',
          properties: {
            items: {
              type: 'array',
              description: 'List of documents and folders',
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
          description: 'Failed to retrieve documents',
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
      const { folder } = request.params as { folder: string };
      const documents = await shareDoService.getDocuments(folder);
      return documents;
    } catch (error) {
      reply.status(500).send({
        error: 'Failed to get documents',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Upload document to ShareDo repository
  fastify.post('/documents/:folder', {
    schema: {
      tags: ['ShareDo'],
      summary: 'Upload document to ShareDo repository',
      description: 'Upload a document file to ShareDo repository folder',
      consumes: ['multipart/form-data'],
      params: {
        type: 'object',
        properties: {
          folder: {
            type: 'string',
            description: 'Folder to upload document to'
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
      // Get the uploaded file
      const data = await request.file();

      if (!data) {
        reply.status(400).send({
          error: 'No file uploaded'
        });
        return;
      }

      // Get folder from params
      const params = request.params as { folder?: string };
      const folder = params.folder;

      // Convert file to buffer
      const fileBuffer = await data.toBuffer();

      // Upload to ShareDo
      const result = await shareDoService.uploadDocument(
        fileBuffer,
        data.filename,
        folder
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