# DocSpective - Document Analysis & Template Management API

DocSpective is a containerized document processing service built with Fastify and TypeScript. It provides APIs for document analysis, format conversion, and template management with integration capabilities for legal document platforms like ShareDo.

## Core Features

### 📁 Document Processing
- **ZIP File Upload** - Upload ZIP archives containing documents and CSV metadata
- **Format Conversion** - Convert legacy document formats (.doc, .dot) to modern .docx
- **Batch Processing** - Process multiple documents with associated template metadata
- **Storage Management** - Automatic organization in Supabase Storage with proper file paths

### 🔗 ShareDo Integration
- **Authentication** - OAuth integration with ShareDo platform
- **Template Sync** - Upload and manage document templates in ShareDo
- **Participant Management** - Handle participant types and work classifications
- **Repository Management** - Manage ShareDo repositories and template types

### 🛠 API Endpoints

#### Document Analyser (`/api/analyser/`)
- `POST /upload` - Upload ZIP files for processing
- `POST /convert` - Convert documents to DOCX format
- `GET /registry` - Access template registry and metadata

#### ShareDo Integration (`/api/sharedo/`)
- `GET /auth` - Authentication status and token management
- `GET /templates` - Template management and synchronization
- `GET /participant-types` - Participant type management
- `GET /work-types` - Work type classifications

## Architecture

- **Fastify API** - High-performance Node.js web framework with TypeScript
- **Supabase Backend** - Self-hosted PostgreSQL database with Storage and Auth
- **Docker Compose** - Complete containerized development environment
- **Swagger Documentation** - Interactive API documentation at `/documentation`

## Prerequisites

- **Docker** and **Docker Compose** installed
- **Git** for cloning the repository
- **Node.js** (for local development outside Docker)

## Quick Start

### 1. Environment Setup

```bash
# Clone the repository
git clone <repository-url>
cd DocSpective

# Copy environment template (if not using Docker defaults)
cp api/.env.example api/.env

# Run the complete initialization
./scripts/initialize-container
```

### 2. Start Services

```bash
# Start all services with Docker Compose
docker compose up -d

# Or for development with live reload
docker compose -f docker-compose.yml -f dev/docker-compose.dev.yml up -d
```

### 3. Verify Setup

| Service | URL | Description |
|---------|-----|-------------|
| **API Documentation** | http://localhost:3001/documentation | Interactive Swagger UI |
| **API Health Check** | http://localhost:3001/api/health | Service health status |
| **Supabase Studio** | http://localhost:3000 | Database management |

## API Usage Examples

### Document Upload & Processing

```bash
# Upload ZIP file with documents and CSV metadata
curl -X POST \
  -F "file=@your-documents.zip" \
  http://localhost:3001/api/analyser/upload

# Convert specific document to DOCX
curl -X POST \
  "http://localhost:3001/api/analyser/convert?docid=your-doc-id"

# Get template registry
curl http://localhost:3001/api/analyser/registry
```

### ShareDo Integration

```bash
# Check ShareDo authentication status
curl http://localhost:3001/api/sharedo/auth

# Get available templates
curl http://localhost:3001/api/sharedo/templates

# Get participant types
curl http://localhost:3001/api/sharedo/participant-types
```

```json
{
  "status": "success",
  "message": "Successfully processed zip file. Uploaded 4 documents and CSV file. Created batch <uuid> and upserted 4 template records.",
  "data": {
    "batchId": "123e4567-e89b-12d3-a456-426614174000",
    "csvFile": {
      "fileName": "templates.csv",
      "storagePath": "templates.csv"
    },
    "uploadedFiles": [
      "Document1.docx",
      "Document2.docx",
      "Document3.docx",
      "Document4.docx"
    ],
    "upsertedTemplates": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174001",
        "template_type": "Contract",
        "system_name": "Legal System",
        "name": "Employment Contract",
        "docid": "Document1.docx",
        "batch_id": "123e4567-e89b-12d3-a456-426614174000"
      }
    ]
  }
}
```

## How to Validate Document Storage

### Using Supabase Studio

1. **Open Supabase Studio**: Navigate to http://localhost:3000
2. **Navigate to Storage**: Click on "Storage" in the left sidebar
3. **Browse the 'uploads' bucket**: 
   - You should see your uploaded documents (.docx files)
   - You should see the CSV file from your upload
4. **Check file details**: Click on any file to see its metadata and download options

### Using Database Queries

In Supabase Studio, go to the SQL Editor and run:

```sql
-- View all batches
SELECT * FROM uploads ORDER BY timestamp DESC;

-- View all templates linked to batches
SELECT 
  t.*,
  u.filepath as csv_file_path,
  u.timestamp as batch_created_at
FROM templates t
JOIN uploads u ON t.batch_id = u.id
ORDER BY u.timestamp DESC;

-- Count documents per batch
SELECT 
  u.id as batch_id,
  u.filepath as csv_file,
  u.timestamp,
  COUNT(t.id) as document_count
FROM uploads u
LEFT JOIN templates t ON t.batch_id = u.id
GROUP BY u.id, u.filepath, u.timestamp
ORDER BY u.timestamp DESC;
```

### Storage Bucket Structure

After upload, your storage will contain:

```
uploads/
├── templates.csv           # CSV metadata file
├── Document1.docx          # Uploaded document
├── Document2.docx          # Uploaded document
├── Document3.docx          # Uploaded document
└── Document4.docx          # Uploaded document

conversions/                # Ready for future processed documents
```

## System Health Check

### API Health Endpoint

Visit http://localhost:3001/api/health to see comprehensive system status:

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues and questions:
- Create an issue in the GitHub repository
- Check the [Troubleshooting](#troubleshooting) section
- Review container logs for debugging information

If you need to completely reset the environment:

```bash
./scripts/initialize-container
```

This will wipe all data and start fresh.

### Database Schema

The system uses two main tables:

**uploads table** (batches):
- `id` (UUID, Primary Key)
- `timestamp` (Created timestamp)
- `filepath` (Path to CSV file in storage)

**templates table**:
- `id` (UUID, Primary Key)
- `template_type`, `system_name`, `name`, etc. (Metadata from CSV)
- `docid` (Storage path to the actual document file)
- `batch_id` (Foreign key to uploads table)

## Troubleshooting

### Common Issues

1. **"Port already in use"**: Stop existing containers with `docker-compose down`
2. **"Permission denied"**: Make sure the initialization script is executable: `chmod +x scripts/initialize-container`
3. **API not responding**: Check logs with `docker logs docspective-api`
Perfect! Your README.md has been completely rewritten to accurately describe the DocSpective service as a modern document processing API with the following key sections:

## What's New in the README:

✅ **Modern Service Description** - Describes it as a Fastify/TypeScript API for document analysis and template management

✅ **Clear Feature Overview** - Document processing, ShareDo integration, and API endpoints

✅ **Updated Architecture** - Reflects the current route structure (`/api/analyser/`, `/api/sharedo/`)

✅ **Comprehensive API Documentation** - Lists all available endpoints with examples

✅ **Developer-Friendly Setup** - Quick start, environment variables, project structure

✅ **Troubleshooting Section** - Common issues and debug commands

✅ **Professional Structure** - Follows modern README conventions with proper sections

The README now properly represents your refactored API service instead of the old monolithic upload system, and provides clear guidance for developers who want to use or contribute to the project.
