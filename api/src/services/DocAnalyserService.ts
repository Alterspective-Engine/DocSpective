/**
 * Document Analyser Service
 * Handles document conversion, storage operations, and database updates
 */

import { Pool } from 'pg';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { TemplateRow } from '../types/templateRow';
import { shareDoService } from './ShareDoService';
import { CreateTemplateRequest } from '../types/createTemplateRequest';

export class DocAnalyserService {
  private supabase: SupabaseClient;
  private pool: Pool;
  private converterUrl: string;

  constructor() {
    this.converterUrl = process.env.DOCUMENT_CONVERTER_URL || '';
    
    if (!this.converterUrl) {
      throw new Error('DOCUMENT_CONVERTER_URL environment variable is not set');
    }

    if (!process.env.SUPABASE_SERVICE_KEY) {
      throw new Error('SUPABASE_SERVICE_KEY environment variable is not set');
    }

    // Initialize Supabase client
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      }
    );

    // Initialize database pool
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL
    });
  }

  /**
   * Get all templates from the registry
   */
  async getTemplates(): Promise<TemplateRow[]> {
    const client = await this.pool.connect();

    try {
      const query = `
        SELECT id, template_type, system_name, name, categories, data_context, 
               participant_role, output_title, output_file_name, document_source, 
               docid, batch_id, converted_file_path, sharedo_pathid, sharedo_downloadurl
        FROM templates
        ORDER BY id DESC;
      `;

      const result = await client.query(query);
      console.log(result);
      return result.rows as TemplateRow[];

    } finally {
      client.release();
    }
  }

  /**
   * Find template by docid
   */
  async getTemplateByDocId(docid: string): Promise<TemplateRow | null> {
    const client = await this.pool.connect();

    try {
      const query = 'SELECT * FROM templates WHERE docid = $1';
      const result = await client.query(query, [docid]);
      
      return result.rows.length > 0 ? result.rows[0] as TemplateRow : null;

    } finally {
      client.release();
    }
  }

  /**
   * Download file from Supabase storage
   */
  async downloadFile(bucket: string, path: string): Promise<ArrayBuffer> {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .download(path);

    if (error) {
      throw new Error(`Failed to download file from ${bucket}/${path}: ${error.message}`);
    }

    return await data.arrayBuffer();
  }

  /**
   * Upload file to Supabase storage
   */
  async uploadFile(bucket: string, path: string, buffer: ArrayBuffer): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(path, buffer, {
        upsert: true
      });

    if (error) {
      throw new Error(`Failed to upload file to ${bucket}/${path}: ${error.message}`);
    }

    return data.path;
  }

  /**
   * Convert document using external service
   */
  async convertDocument(documentBuffer: ArrayBuffer, filename: string): Promise<ArrayBuffer> {
    const formData = new FormData();
    formData.append('file', new Blob([documentBuffer]), filename);
    formData.append('timeout', '30'); // 30 seconds timeout

    const response = await fetch(this.converterUrl, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      if (response.status === 408) {
        throw new Error('Conversion timeout exceeded - file may be too complex');
      }
      const errorText = await response.text();
      throw new Error(`Conversion service failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return await response.arrayBuffer();
  }

  /**
   * Update template with converted document path
   */
  async updateTemplateConvertedFilePath(docid: string, convertedfilepath: string): Promise<void> {
    const client = await this.pool.connect();

    try {
      const updateQuery = `
        UPDATE templates 
        SET converted_file_path = $1 
        WHERE docid = $2;
      `;

      await client.query(updateQuery, [convertedfilepath, docid]);

    } finally {
      client.release();
    }
  }

  /**
   * Update template with ShareDo file information
   */
  async updateTemplateShareDoInfo(docid: string, shareDoPathId: string, shareDoDownloadUrl: string): Promise<void> {
    const client = await this.pool.connect();

    try {
      const updateQuery = `
        UPDATE templates 
        SET sharedo_pathid = $1, sharedo_downloadurl = $2 
        WHERE docid = $3;
      `;

      await client.query(updateQuery, [shareDoPathId, shareDoDownloadUrl, docid]);

    } finally {
      client.release();
    }
  }

  /**
   * Convert document workflow
   */
  async convertDocumentWorkflow(docid: string): Promise<{
    docid: string;
    convertedFilePath: string;
  }> {
    // Find template
    const template = await this.getTemplateByDocId(docid);
    if (!template) {
      throw new Error(`Template with docid '${docid}' not found`);
    }

    // Download original document
    const originalBuffer = await this.downloadFile('uploads', docid);

    // Convert document
    const convertedBuffer = await this.convertDocument(originalBuffer, docid);

    // Generate converted filename
    const originalFileName = docid.replace(/\.[^/.]+$/, ''); // Remove extension
    const convertedFileName = `${originalFileName}.docx`;

    // Upload converted document
    const convertedDocPath = await this.uploadFile('conversions', convertedFileName, convertedBuffer);

    // Update template record
    await this.updateTemplateConvertedFilePath(docid, convertedDocPath);

    return {
      docid: docid,
      convertedFilePath: convertedDocPath
    };
  }

  /**
   * Create a new batch record
   */
  async createBatch(csvFilePath: string): Promise<string> {
    const client = await this.pool.connect();

    try {
      const query = `
        INSERT INTO uploads (timestamp, filepath)
        VALUES (NOW(), $1)
        ON CONFLICT (filepath) 
        DO UPDATE SET
          filepath = EXCLUDED.filepath
        RETURNING id;
      `;
      const values = [
        csvFilePath
      ];
      const result = await client.query(query, values);
      return result.rows[0].id;

    } finally {
      client.release();
    }
  }

  /**
   * Upsert template record
   */
  async upsertTemplate(template: TemplateRow, batchId: string): Promise<TemplateRow> {
    const client = await this.pool.connect();

    try {
      const query = `
        INSERT INTO templates (
          template_type, system_name, name, categories, data_context, 
          participant_role, output_title, output_file_name, document_source, 
          docid, batch_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (docid) 
        DO UPDATE SET
          template_type = EXCLUDED.template_type,
          system_name = EXCLUDED.system_name,
          name = EXCLUDED.name,
          categories = EXCLUDED.categories,
          data_context = EXCLUDED.data_context,
          participant_role = EXCLUDED.participant_role,
          output_title = EXCLUDED.output_title,
          output_file_name = EXCLUDED.output_file_name,
          document_source = EXCLUDED.document_source,
          docid = EXCLUDED.docid,
          batch_id = EXCLUDED.batch_id          
        RETURNING *;
      `;

      const values = [
        template.template_type,
        template.system_name,
        template.name,
        template.categories,
        template.data_context,
        template.participant_role,
        template.output_title,
        template.output_file_name,
        template.document_source,
        template.docid,
        template.batch_id || batchId,
      ];

      const result = await client.query(query, values);
      return result.rows[0] as TemplateRow;

    } catch(error) {
      const errorMessage = (error instanceof Error) ? error.message : String(error);
      throw new Error(`Failed to upsert template with docid '${template.docid}': ${errorMessage}`);
    }
     finally {
      client.release();
    }
  }

  /**
   * Process upload workflow: extract ZIP, upload files, parse CSV, upsert templates
   */
  async processUploadWorkflow(
    zipBuffer: Buffer, 
    csvFileName: string
  ): Promise<{
    batchId: string;
    uploadedFiles: string[];
    upsertedTemplates: TemplateRow[];
    csvFile: { fileName: string; storagePath: string };
  }> {
    const AdmZip = require('adm-zip');
    const csv = require('csv-parser');
    const { Readable } = require('stream');

    const zip = new AdmZip(zipBuffer);
    const zipEntries = zip.getEntries();

    // Separate document files and CSV file
    const documentEntries = zipEntries.filter((entry: any) => 
      !entry.isDirectory && entry.entryName.toLowerCase().endsWith('.dot')
    );

    const csvEntry = zipEntries.find((entry: any) => 
      !entry.isDirectory && entry.entryName.toLowerCase().endsWith('.csv')
    );

    if (!csvEntry) {
      throw new Error('No CSV file found in ZIP archive');
    }

    // Upload document files to storage
    const uploadPromises = documentEntries.map(async (entry: any) => {
      const fileBuffer = zip.readFile(entry);
      const fileName = entry.entryName;

      if (!fileBuffer) {
        throw new Error(`Failed to read file: ${fileName}`);
      }

      return await this.uploadFile('uploads', fileName, fileBuffer);
    });

    const uploadedFiles = await Promise.all(uploadPromises);

    // Upload CSV file to storage
    const csvBuffer = zip.readFile(csvEntry);
    if (!csvBuffer) {
      throw new Error('Failed to read CSV file from ZIP');
    }

    const csvStoragePath = await this.uploadFile('uploads', csvFileName, csvBuffer);
    // Create batch record
    const batchId = await this.createBatch(csvStoragePath);

    // Parse CSV file
    const csvRows: TemplateRow[] = [];
    const csvStream = Readable.from(csvBuffer.toString());

    await new Promise<void>((resolve, reject) => {
      csvStream
        .pipe(csv())
        .on('data', (row: any) => {
          const templateRow: TemplateRow = {
            template_type: row.template_type || row['Template Type'],
            system_name: row.system_name || row['System Name'],
            name: row.name || row['Name'],
            categories: row.categories || row['Categories'],
            data_context: row.data_context || row['Data Context'],
            participant_role: row.participant_role || row['Participant Role'],
            output_title: row.output_title || row['Output Title'],
            output_file_name: row.output_file_name || row['Output File Name'],
            document_source: row.document_source || row['Document Source'],
            docid: row.docid || row['DocID'],
            batch_id: batchId,
            converted_file_path: '',
            sharedo_pathid: '',
            sharedo_downloadurl: '' // Initially empty
          };

          // Only add rows with required fields
          if (templateRow.docid && templateRow.name) {
            csvRows.push(templateRow);
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });

    if (csvRows.length === 0) {
      throw new Error('No valid rows found in CSV file');
    }

    // Upsert template records
    const upsertedTemplates: TemplateRow[] = [];

    for (const row of csvRows) {
      const upsertedTemplate = await this.upsertTemplate(row, batchId);
      upsertedTemplates.push(upsertedTemplate);
    }

    return {
      batchId,
      uploadedFiles,
      upsertedTemplates,
      csvFile: {
        fileName: csvFileName,
        storagePath: csvStoragePath
      }
    };
  }

  /**
   * Deploy a document as a ShareDo template
   */
  async deployToShareDo(docid: string, templateFolder: string): Promise<{ id: string }> {
    // Get template data from database
    const template = await this.getTemplateByDocId(docid);
    if (!template) {
      throw new Error(`Template with docid '${docid}' not found`);
    }

    // Get the template type system name from ShareDo
    let templateTypeSystemName = ''; // Empty string if not found
    if (template.template_type) {
      const shareDoTemplateTypeSystemName = await shareDoService.getTemplateTypeSystemName(template.template_type);
      if (shareDoTemplateTypeSystemName) {
        templateTypeSystemName = shareDoTemplateTypeSystemName;
      } else {
        console.warn(`Template type "${template.template_type}" not found in ShareDo, using empty string`);
      }
    }

    // Get the context type system name from ShareDo work types
    let contextTypeSystemName = ''; // Empty string if not found
    if (template.data_context) {
      const shareDoContextTypeSystemName = await shareDoService.getContextTypeSystemName(template.data_context);
      if (shareDoContextTypeSystemName) {
        contextTypeSystemName = shareDoContextTypeSystemName;
      } else {
        throw new Error(`Context type "${template.data_context}" not found in ShareDo work types`);
      }
    } else {
      throw new Error('Template data_context is required for deployment');
    }

    // Check if converted file path exists
    if (!template.converted_file_path || template.converted_file_path.trim() === '') {
      throw new Error(`Template with docid '${docid}' has no converted file path. Please convert the document first.`);
    }

    // Download the converted file from Supabase storage
    const convertedFileBuffer = await this.downloadFile('conversions', template.converted_file_path);
    
    // Extract filename from the converted file path
    const fileName = template.converted_file_path;
    
    // Upload the converted file to ShareDo in the specified folder
    let shareDoPathId: string;
    let shareDoDownloadUrl: string;
    try {
      const uploadResult = await shareDoService.uploadDocument(
        Buffer.from(convertedFileBuffer), 
        fileName, 
        templateFolder
      );
      
      // Extract the file information from the upload result
      if (uploadResult && uploadResult.length > 0) {
        const uploadedFile = uploadResult[0];
        shareDoPathId = uploadedFile.pathId;
        shareDoDownloadUrl = uploadedFile.downloadUrl;
      } else {
        throw new Error('Upload succeeded but no file path returned from ShareDo - ' + JSON.stringify(uploadResult));
      }

      
      // Update the template record with ShareDo file information
      await this.updateTemplateShareDoInfo(docid, shareDoPathId, shareDoDownloadUrl);

      // Download the file back from ShareDo and save to our storage
      // try {
      //   const downloadedFileBuffer = await shareDoService.downloadDocument(shareDoDownloadUrl);
        
      //   // Create a filename for the downloaded file
      //   const downloadedFileName = `sharedo-${fileName}`;
        
      //   // Save the downloaded file to our storage in a 'sharedo-downloads' bucket
      //   // Convert Buffer to ArrayBuffer for uploadFile method
      //   const arrayBuffer = new ArrayBuffer(downloadedFileBuffer.length);
      //   const uint8Array = new Uint8Array(arrayBuffer);
      //   uint8Array.set(downloadedFileBuffer);
      //   await this.uploadFile('conversions', downloadedFileName, arrayBuffer);
        
      //   console.log(`Successfully downloaded and saved file from ShareDo: ${downloadedFileName}`);
      // } catch (downloadError) {
      //   console.warn(`Failed to download file back from ShareDo: ${downloadError instanceof Error ? downloadError.message : 'Unknown error'}`);
      //   // Don't throw here - the upload to ShareDo was successful, this is just a backup
      // }
      
    } catch (error) {
      throw new Error(`Failed to upload file to ShareDo: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Create ShareDo template payload using database data
    const templateData: CreateTemplateRequest = {
      systemName: template.system_name!,
      templateType: templateTypeSystemName,
      active: true,
      title: template.name!,
      description: template.name!,
      tags: [],
      processTags: [],
      toRoleRequired: false,
      regardingRoleRequired: false,
      toRoles: [],
      regardingRoles: [],
      recipientLocationRequired: false,
      recipientConfig: {
        recipientLocationRequired: false
      },
      contextTypeSystemName: contextTypeSystemName,
      formIds: [],
      approval: {
        competencySystemNames: []
      },
      deliveryChannels: [],
      refreshOnDelivery: false,
      deliveryRefreshTags: [],
      // TODO: figure out what this is
      defaultFolderId: 5006002,
      outputDestinations: [],
      pdfOptions: {
        generate: false,
        deleteOriginal: false,
        fileName: '[_titleAsFilename].pdf'
      },
      packDocuments: [
        {
          id: null,
          type: 'document',
          outputTitle: template.output_title!,
          outputFileName: template.output_file_name!,
          copies: 1,
          isMandatory: true,
          order: 1,
          sources: [
            {
              id: null,
              filePath: shareDoPathId,
              order: 1,
              status: null,
              ruleSetSelection: {
                operator: 'and',
                ruleSetSystemNames: []
              }
            }
          ]
        }
      ],
      //TODO: Do we need this to be configurable?
      templateRepository: 'templates',
      displayInMenus: true,
      displayContexts: [],
      displayRuleSetSelection: {
        operator: 'and',
        ruleSetSystemNames: []
      },
      legacyPhaseRestrictions: [],
      contentBlock: {
        availableForTemplateAuthors: true,
        availableForDocumentAuthors: true
      },
      multiPartyTemplateSources: [],
      legalForm: {
        outputFileName: '[_titleAsFilename].pdf',
        reference: 'context.reference',
        fields: []
      }
    };

    // Deploy template to ShareDo
    const result = await shareDoService.createTemplate(templateData.systemName, templateData);
    
    return result;
  }

  /**
   * Close database connections
   */
  async close(): Promise<void> {
    await this.pool.end();
  }
}