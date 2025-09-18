/**
 * Document Analyser Service
 * Handles document conversion, storage operations, and database updates
 */

import { Pool } from 'pg';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { TemplateRow } from '../types/templateRow';

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
               docid, batch_id, converted_file_path
        FROM templates
        ORDER BY id DESC;
      `;

      const result = await client.query(query);
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
            converted_file_path: '' // Initially empty
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
   * Close database connections
   */
  async close(): Promise<void> {
    await this.pool.end();
  }
}