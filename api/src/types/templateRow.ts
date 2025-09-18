export interface TemplateRow {
  id?: string;
  template_type?: string;
  system_name?: string;
  name?: string;
  categories?: string;
  data_context?: string;
  participant_role?: string;
  output_title?: string;
  output_file_name?: string;
  document_source?: string;
  docid: string;
  batch_id?: string;
  converted_file_path?: string;
}