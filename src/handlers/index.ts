export * from './database';
export * from './edge-functions';

import { Request, Response } from 'express';
import { mcpManifest, mcpConfig } from '../config';

/**
 * Handle MCP manifest request
 * This is a required route for MCP protocol compliance
 */
export const handleManifest = (req: Request, res: Response) => {
  res.status(200).json(mcpManifest);
};

/**
 * Handle API key validation
 */
export const validateApiKey = (req: Request, res: Response, next: Function) => {
  const apiKey = req.headers['x-api-key'] as string;
  
  // Skip validation for manifest endpoint
  if (req.path === '/.well-known/mcp-manifest') {
    return next();
  }
  
  if (!apiKey || apiKey !== mcpConfig.apiKey) {
    return res.status(401).json({ error: 'Unauthorized: Invalid API key' });
  }
  
  next();
};

/**
 * Handle health check request
 */
export const handleHealthCheck = (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Supabase MCP server is running' });
};

/**
 * Handle generic tool call requests
 */
export const handleToolCall = async (req: Request, res: Response, next: Function) => {
  // Extract operation type from path
  const pathParts = req.path.split('/');
  const operationType = pathParts[1]; // e.g., 'database' or 'edge-functions'
  
  if (operationType === 'database') {
    // Pass to database handler
    // Expects routes like /database/queryDatabase, /database/insertData, etc.
    req.params.operation = pathParts[2];
    return await require('./database').handleDatabaseOperation(req, res);
  } else if (operationType === 'edge-functions') {
    // Pass to edge functions handler
    // Expects routes like /edge-functions/{functionName}
    req.params.functionName = pathParts[2];
    return await require('./edge-functions').handleEdgeFunction(req, res);
  }
  
  // If no handler matched, continue to the 404 handler
  next();
};