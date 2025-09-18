import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DocAnalyserService } from '../../services/DocAnalyserService';

export default async function uploadRoutes(fastify: FastifyInstance) {
    fastify.post('/upload', {
        schema: {
            description: 'Upload and process ZIP files containing documents and CSV template data',
            tags: ['Document Analyser'],
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
                        csvFile: {
                            type: 'object',
                            properties: {
                                fileName: { type: 'string' },
                                storagePath: { type: 'string' }
                            }
                        },
                        uploadedFiles: {
                            type: 'array',
                            items: {
                                type: 'string',
                                description: 'Storage path of uploaded file'
                            }
                        },
                        upsertedTemplates: {
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
                                    original_file_path: { type: 'string' },
                                    converted_file_path: { type: 'string' },
                                    another_field: { type: 'string' } // Example of an additional optional field
                                }
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

            if (!data.filename.endsWith('.zip')) {
                return reply.status(400).send('File must be a ZIP archive');
            }

            // Read file buffer from the stream
            const chunks: Buffer[] = [];
            for await (const chunk of data.file) {
                chunks.push(chunk);
            }
            const zipBuffer = Buffer.concat(chunks);

            const docAnalyserService = new DocAnalyserService();
            
            try {
                const result = await docAnalyserService.processUploadWorkflow(
                    zipBuffer, 
                    data.filename.replace('.zip', '.csv')
                );

                await docAnalyserService.close();
                return result;

            } catch (serviceError) {
                await docAnalyserService.close();
                throw serviceError;
            }

        } catch (error) {
            fastify.log.error('Upload processing failed: %s', error instanceof Error ? error.message : error);
            return reply.status(500).send(error instanceof Error ? error.message : 'Unknown error');
        }
    });
}
