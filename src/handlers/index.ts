export * from './database.js';
export * from './edge-functions.js';
export * from './mcp-rpc.js';

import { Request, Response } from 'express';
import { mcpManifest, mcpConfig } from '../config.js';

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