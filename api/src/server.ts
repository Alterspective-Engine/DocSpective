import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import path from 'path';
import fs from 'fs';

// Load environment variables early from api/.env when running compiled dist or tsx
(() => {
  // If variables already appear loaded (e.g., in Docker), skip
  if (process.env.SHAREDO_HOSTNAME || process.env.PORT) return;
  const envPath = path.resolve(__dirname, '..', '.env'); // dist/server.js => dist, go up one -> dist/.. = project root of api
  const fallbackEnvPath = path.resolve(process.cwd(), '.env');
  let chosen: string | null = null;
  if (fs.existsSync(envPath)) chosen = envPath; else if (fs.existsSync(fallbackEnvPath)) chosen = fallbackEnvPath;
  if (chosen) {
    try {
      // Lazy require to avoid type overhead
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('dotenv').config({ path: chosen });
    } catch (e) {
      // Silent – Fastify/env will still validate later
    }
  }
})();

// Create Fastify instance with TypeScript support
const fastify = Fastify({
  logger: process.env.NODE_ENV !== 'production' ? {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  } : true
});

// Set up graceful shutdown handlers early
let isShuttingDown = false;

const gracefulShutdown = async (signal: string) => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  
  console.log(`\nReceived ${signal}, shutting down gracefully...`);
  
  try {
    await fastify.close();
    console.log('Server closed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});

// Add custom validator compiler for multipart uploads with Swagger
fastify.setValidatorCompiler(({ schema }: { schema: any }) => {
  return (data: any) => {
    // Check if any property has isFile: true - if so, skip all validation
    function hasFileProperty(obj: any): boolean {
      if (typeof obj !== 'object' || obj === null) return false;
      
      for (const key in obj) {
        if (obj[key] && obj[key].isFile === true) {
          return true;
        }
        if (typeof obj[key] === 'object' && hasFileProperty(obj[key])) {
          return true;
        }
      }
      return false;
    }
    
    if (hasFileProperty(schema)) {
      return { value: data };
    }
    
    // For non-file schemas, use default validation
    const Ajv = require('ajv');
    const ajv = new Ajv({
      removeAdditional: true,
      useDefaults: true,
      coerceTypes: true,
      allErrors: true,
      strict: false
    });
    
    // Add support for binary format
    ajv.addFormat('binary', true);
    
    // Add custom keyword for isFile
    ajv.addKeyword({
      keyword: 'isFile',
      type: 'string',
      schemaType: 'boolean',
      compile: function (schemaVal: boolean) {
        return function validate() {
          return true;
        };
      }
    });
    
    const validate = ajv.compile(schema);
    const valid = validate(data);
    
    if (valid) {
      return { value: data };
    }
    
    return { error: validate.errors };
  };
});

// Register plugins
async function registerPlugins() {
  // Environment variables validation
  await fastify.register(import('@fastify/env'), {
    schema: {
      type: 'object',
      required: ['PORT'],
      properties: {
        PORT: {
          type: 'string',
          default: '3002'
        },
        NODE_ENV: {
          type: 'string',
          default: 'development'
        },
        DATABASE_URL: {
          type: 'string',
          default: 'postgres://supabase:supabase@localhost:5432/supabase'
        },
        SUPABASE_URL: {
          type: 'string',
          default: 'http://localhost:54321'
        },
        SUPABASE_ANON_KEY: {
          type: 'string',
          default: 'your_supabase_anon_key_here'
        }
      }
    }
  });

  // CORS
  await fastify.register(import('@fastify/cors'), {
    origin: process.env.NODE_ENV === 'production' ? false : true
  });

  // Security headers
  await fastify.register(import('@fastify/helmet'));

  // Sensible defaults (error handling, etc.)
  await fastify.register(import('@fastify/sensible'));

  // Multipart file upload support
  await fastify.register(import('@fastify/multipart'));

  // Swagger documentation
  await fastify.register(import('@fastify/swagger'), {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'DocSpective API',
        description: 'API for DocSpective application',
        version: '1.0.0'
      },
      servers: [
        {
          url: `http://localhost:${process.env.PORT || '3001'}`,
          description: 'Development server'
        }
      ]
    }
  });

  await fastify.register(import('@fastify/swagger-ui'), {
    routePrefix: '/',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false
    }
  });
}

// Register routes
async function registerRoutes() {
  const healthMod = await import('./routes/health');
  fastify.register(healthMod.default || healthMod, { prefix: '/api' });

  const sharedoMod = await import('./routes/sharedo/index');
  fastify.register(sharedoMod.default || sharedoMod, { prefix: '/api/sharedo' });

  const analyserMod = await import('./routes/analyser/index');
  fastify.register(analyserMod.default || analyserMod, { prefix: '/api/analyser' });
}

// Start server
async function start() {
  try {
    await registerPlugins();
    await registerRoutes();

    const port = parseInt(process.env.PORT || '3001');
    const host = '0.0.0.0'; // Always bind to 0.0.0.0 for Docker compatibility

    // One-time diagnostic for ShareDo vars (only in non-production, and only if any missing)
    if (process.env.NODE_ENV !== 'production') {
      const requiredShareDo = ['SHAREDO_HOSTNAME','SHAREDO_DOMAIN','SHAREDO_USERNAME'];
      const missing = requiredShareDo.filter(k => !process.env[k]);
      if (missing.length) {
        fastify.log.warn({ missing }, 'Some ShareDo environment variables are missing');
      }
    }

    await fastify.listen({ port, host, exclusive:false });
    
    fastify.log.info(`🚀 Server ready at http://${host}:${port}`);
    fastify.log.info(`📚 Documentation available at http://${host}:${port}/`);

  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

// Start the server
start();