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
  handleListEdgeFunctions,
  handleToolCall
} from './handlers';

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(bodyParser.json());
  app.use(validateApiKey);

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

  // Generic tool call handler (as a fallback)
  app.use('*', handleToolCall);

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