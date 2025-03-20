import { createServer } from './server';
import { mcpConfig, validateConfig } from './config';

// Validate required configuration
try {
  validateConfig();
} catch (error: any) {
  console.error('Configuration error:', error.message);
  process.exit(1);
}

const app = createServer();
const { port, host } = mcpConfig;

app.listen(port, () => {
  console.log(`Supabase MCP server listening at http://${host}:${port}`);
  console.log(`MCP manifest available at http://${host}:${port}/.well-known/mcp-manifest`);
});