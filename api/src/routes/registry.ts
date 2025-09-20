import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { RegistryService } from '../services/RegistryService';

export default async function registryRoutes(fastify: FastifyInstance) {
    // POST endpoint for uploading and processing ZIP files 
    fastify.post('/registry', {
        schema: {
            description: 'Upload and process ZIP files containing documents and CSV template data',
            tags: ['Registry'],
            consumes: ['multipart/form-data'],
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
                    type: 'object',
                    properties: {
                        batchId: { type: 'string' },
                        uploadedFiles: {
                            type: 'array',
                            items: { type: 'string' }
                        },
                        registryEntries: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    template_type: { type: 'string' },
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
                                    sharedo_pathid: { type: 'string' },
                                    sharedo_downloadurl: { type: 'string' }
                                }
                            }
                        },
                        csvFile: {
                            type: 'object',
                            properties: {
                                fileName: { type: 'string' },
                                storagePath: { type: 'string' }
                            }
                        }
                    }
                },
                400: {
                    type: 'string'
                },
                500: {
                    type: 'string'
                }
            }
        }
    }, async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const data = await request.file();

            if (!data) {
                return reply.status(400).send('No file uploaded');
            }

            const registryService = new RegistryService();

            try {
                // Convert file buffer and extract filename
                const fileBuffer = await data.toBuffer();
                const fileName = data.filename || 'unknown.zip';
                
                const result = await registryService.upload(fileBuffer, fileName);
                
                await registryService.close();
                return result;

            } catch (serviceError) {
                await registryService.close();
                throw serviceError;
            }

        } catch (error) {
            fastify.log.error('Upload processing failed: %s', error instanceof Error ? error.message : error);
            return reply.status(500).send(error instanceof Error ? error.message : 'Unknown error');
        }
    });

    // GET endpoint for retrieving all templates from registry
    fastify.get('/registry', {
        schema: {
            description: 'Get all templates from the registry',
            tags: ['Registry'],
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
            const registryService = new RegistryService();
            const templates = await registryService.getRegistryEntries();
            await registryService.close();

            return templates;

        } catch (error) {
            fastify.log.error('Registry query failed: %s', error instanceof Error ? error.message : error);
            return reply.status(500).send(error instanceof Error ? error.message : 'Unknown error');
        }
    });

    // POST endpoint for converting documents to DOCX format
    fastify.post<{ Querystring: { docid: string } }>('/registry/convert', {
        schema: {
            description: 'Convert a document to DOCX format and update the convertedFilePath',
            tags: ['Registry'],
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
                500: {
                    type: 'string'
                }
            }
        }
    }, async (request: FastifyRequest<{ Querystring: { docid: string } }>, reply: FastifyReply) => {
        try {
            const { docid } = request.query;

            if (!docid) {
                return reply.status(400).send('docid parameter is required');
            }

            const registryService = new RegistryService();

            try {
                const conversionResult = await registryService.convertDocument(docid);
                
                return {
                    docid: conversionResult.docid,
                    convertedFilePath: conversionResult.convertedFilePath
                };

            } catch (serviceError) {
                await registryService.close();
                throw serviceError;
            }

        } catch (error) {
            fastify.log.error('Conversion failed: %s', error instanceof Error ? error.message : error);
            return reply.status(500).send(error instanceof Error ? error.message : 'Unknown error');
        }
    });

    // POST endpoint for deploying documents as ShareDo templates
    fastify.post<{ Body: { docid: string; templateFolder: string } }>('/registry/deploy', {
        schema: {
            description: 'Deploy a document as a ShareDo template',
            tags: ['Registry'],
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
    }, async (request: FastifyRequest<{ Body: { docid: string; templateFolder: string } }>, reply: FastifyReply) => {
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

            // Initialize Registry Service
            const registryService = new RegistryService();

            try {
                // Deploy template to ShareDo using the service
                const result = await registryService.deployToShareDo(docid, templateFolder);
                
                fastify.log.info(`Template deployed successfully for docid: ${docid}, templateFolder: ${templateFolder}, ShareDo template ID: ${result.id}`);
                
                await registryService.close();
                return result;

            } catch (serviceError) {
                await registryService.close();
                throw serviceError;
            }

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
