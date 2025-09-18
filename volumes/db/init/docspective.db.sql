-- Create uploads table to track batch uploads
CREATE TABLE IF NOT EXISTS "uploads" (
  "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "timestamp" timestamp with time zone DEFAULT now(),
  "filepath" text UNIQUE NOT NULL
);

-- Create templates table with batch_id reference
CREATE TABLE IF NOT EXISTS "templates" (
  "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "template_type" text,
  "system_name" text,
  "name" text,
  "categories" text,
  "data_context" text,
  "participant_role" text,
  "output_title" text,
  "output_file_name" text,
  "document_source" text,
  "docid" text UNIQUE NOT NULL,
  "batch_id" uuid REFERENCES "uploads"("id") ON DELETE SET NULL,
  "converted_file_path" text
);

-- Grant permissions for PostgREST API access
GRANT ALL ON TABLE "uploads" TO authenticator;
GRANT ALL ON TABLE "uploads" TO service_role;
GRANT ALL ON TABLE "uploads" TO anon;

GRANT ALL ON TABLE "templates" TO authenticator;
GRANT ALL ON TABLE "templates" TO service_role;
GRANT ALL ON TABLE "templates" TO anon;