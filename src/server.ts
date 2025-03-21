import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { 
  handleManifest, 
  validateApiKey, 
  handleHealthCheck,
  handleDatabaseOperation,
  handleListTables,
  handleEdgeFunction,
  handleListEdgeFunctions
} from './handlers';

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(bodyParser.json());
  
  // Skip API key validation for manifest endpoint
  app.use((req, res, next) => {
    if (req.path === '/.well-known/mcp-manifest') {
      return next();
    }
    validateApiKey(req, res, next);
  });

  // MCP required endpoints
  app.get('/.well-known/mcp-manifest', handleManifest);
  
  // Health check
  app.get('/health', handleHealthCheck);

  // Database operations
  app.post('/database/:operation', handleDatabaseOperation);
  app.get('/database/tables', handleListTables);

  // Edge Functions
  app.post('/edge-functions/:functionName', handleEdgeFunction);
  app.get('/edge-functions', handleListEdgeFunctions);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  // Error handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Server error:', err);
    res.status(500).json({ error: `Server error: ${err.message}` });
  });

  return app;
}