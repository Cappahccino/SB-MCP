#!/usr/bin/env node

import { createServer } from './server';
import { mcpConfig, validateConfig } from './config';
import getPort from 'get-port';

// Validate required configuration
try {
  validateConfig();
} catch (error: any) {
  console.error('Configuration error:', error.message);
  process.exit(1);
}

const app = createServer();
const { port: configuredPort, host } = mcpConfig;

// Auto port selection function
const startServer = async () => {
  try {
    // Try to use the configured port first, or find an available port
    const availablePort = await getPort({
      port: [configuredPort, ...Array.from({ length: 20 }, (_, i) => configuredPort + i + 1)]
    });

    app.listen(availablePort, () => {
      // If we're using a different port than configured, show a message
      if (availablePort !== configuredPort) {
        console.log(`Port ${configuredPort} was in use, using port ${availablePort} instead.`);
      }
      
      console.log(`Supabase MCP server listening at http://${host}:${availablePort}`);
      console.log(`MCP manifest available at http://${host}:${availablePort}/.well-known/mcp-manifest`);
    }).on('error', (err) => {
      console.error('Error starting server:', err);
      process.exit(1);
    });
  } catch (error) {
    console.error('Failed to find an available port:', error);
    process.exit(1);
  }
};

// Start the server with auto port selection
startServer();