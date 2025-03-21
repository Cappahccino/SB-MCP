import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { 
  handleManifest, 
  validateApiKey, 
  handleHealthCheck,
  handleDatabaseOperation,
  handleListTables,
  handleJsonRpc
} from './handlers/index.js';

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(bodyParser.json());
  
  // Skip API key validation for manifest endpoint
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path === '/.well-known/mcp-manifest' || req.path === '/mcp') {
      return next();
    }
    validateApiKey(req, res, next);
  });

  // MCP required endpoints
  app.get('/.well-known/mcp-manifest', handleManifest);
  
  // MCP JSON-RPC endpoint
  app.post('/mcp', handleJsonRpc);
  
  // Health check
  app.get('/health', handleHealthCheck);

  // Database operations
  app.post('/database/:operation', handleDatabaseOperation);
  app.get('/database/tables', handleListTables);

  // 404 handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Not found' });
  });

  // Error handler
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Server error:', err);
    res.status(500).json({ error: `Server error: ${err.message}` });
  });

  return app;
}