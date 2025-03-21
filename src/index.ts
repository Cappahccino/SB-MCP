#!/usr/bin/env node

import { createServer } from './server.js';
import { validateConfig, mcpConfig } from './config.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Validate the configuration
try {
  validateConfig();
} catch (error) {
  console.error('Configuration error:', error instanceof Error ? error.message : String(error));
  process.exit(1);
}

// Create the server
const app = createServer();

// Start the server
const server = app.listen(mcpConfig.port, mcpConfig.host, () => {
  console.log(`Supabase MCP server running at http://${mcpConfig.host}:${mcpConfig.port}`);
  console.log('Press Ctrl+C to stop');
});

// Handle shutdown gracefully
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server shut down successfully');
    process.exit(0);
  });
});

// Export everything needed for the npm package
export * from './config.js';
export * from './handlers/index.js';
export * from './services/mcp.js';
export * from './services/supabase.js';
export * from './types/mcp.js';
export * from './types/supabase.js';
export { createServer } from './server.js';