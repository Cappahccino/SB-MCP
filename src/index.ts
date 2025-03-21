#!/usr/bin/env node

import { createServer } from './server.js';
import { validateConfig, mcpConfig } from './config.js';
import dotenv from 'dotenv';
import { createServer as createNetServer } from 'net';

// Load environment variables
dotenv.config();

// Validate the configuration
try {
  validateConfig();
} catch (error) {
  console.error('Configuration error:', error instanceof Error ? error.message : String(error));
  process.exit(1);
}

// Function to find an available port
async function findAvailablePort(startPort: number): Promise<number> {
  return new Promise((resolve) => {
    const server = createNetServer();
    server.listen(startPort, '127.0.0.1');
    
    server.on('listening', () => {
      const { port } = server.address() as { port: number };
      server.close(() => resolve(port));
    });
    
    server.on('error', () => {
      // Port is in use, try the next one
      resolve(findAvailablePort(startPort + 1));
    });
  });
}

// Create the server
const app = createServer();

// Start the server with port detection
(async () => {
  const port = await findAvailablePort(mcpConfig.port);
  
  if (port !== mcpConfig.port) {
    console.error(`Port ${mcpConfig.port} was in use, using port ${port} instead.`);
    mcpConfig.port = port;
  }
  
  const server = app.listen(port, mcpConfig.host, () => {
    console.error(`Supabase MCP server listening at http://${mcpConfig.host}:${port}`);
    console.error(`MCP manifest available at http://${mcpConfig.host}:${port}/.well-known/mcp-manifest`);
    console.error('Press Ctrl+C to stop');
  });
  
  // Handle shutdown gracefully
  process.on('SIGINT', () => {
    console.error('Shutting down server...');
    server.close(() => {
      console.error('Server shut down successfully');
      process.exit(0);
    });
  });
})();

// Export everything needed for the npm package
export * from './config.js';
export * from './handlers/index.js';
export * from './services/mcp.js';
export * from './services/supabase.js';
export * from './types/mcp.js';
export * from './types/supabase.js';
export { createServer } from './server.js';