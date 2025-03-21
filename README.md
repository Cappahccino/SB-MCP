# Supabase MCP Server

A Model Context Protocol (MCP) server that allows Claude and other LLMs to interact with Supabase to perform CRUD operations on Postgres tables and invoke Edge Functions.

## Features

- Database operations:
  - Query data with filters
  - Insert data
  - Update data
  - Delete data
  - List tables

- Edge Functions:
  - Invoke Edge Functions with custom payloads

## Prerequisites

- Node.js (v16 or newer)
- npm or yarn
- Supabase project with API keys

## Installation

### Option 1: Install from npm (recommended)

The package is published on npm! You can install it globally with:

```bash
npm install -g supabase-mcp
```

Or locally in your project:

```bash
npm install supabase-mcp
```

### Option 2: Clone the repository

```bash
git clone https://github.com/Cappahccino/SB-MCP.git
cd SB-MCP
npm install
npm run build
```

## Configuration

Create a `.env` file with your Supabase credentials:

```
# Supabase credentials
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# MCP server configuration
MCP_SERVER_PORT=3000
MCP_SERVER_HOST=localhost
MCP_API_KEY=your_secret_api_key
```

## Usage with Claude

Claude requires a specific transport mode for compatibility. This package provides a dedicated binary for Claude integration:

### In Claude Desktop MCP Config

```json
"supabase": {
  "command": "npx",
  "args": [
    "-y",
    "supabase-mcp@latest",
    "supabase-mcp-claude"
  ],
  "env": {
    "SUPABASE_URL": "your_supabase_project_url",
    "SUPABASE_ANON_KEY": "your_supabase_anon_key", 
    "SUPABASE_SERVICE_ROLE_KEY": "your_service_role_key",
    "MCP_API_KEY": "your_secret_api_key"
  }
}
```

Make sure you set the required environment variables in the configuration. Claude will use the stdio transport for communication.

### Manual Testing with Claude Binary

For testing outside of Claude, you can run:

```bash
npm run start:claude
```

Or if installed globally:

```bash
supabase-mcp-claude
```

## Usage as a Standalone Server

After installing globally:

```bash
supabase-mcp
```

This will start the MCP server at http://localhost:3000 (or the port specified in your .env file).

## Usage in Your Code

You can also use supabase-mcp as a library in your own Node.js projects:

```javascript
import { createServer, mcpConfig, validateConfig } from 'supabase-mcp';

// Validate configuration
validateConfig();

// Create the server
const app = createServer();

// Start the server
app.listen(mcpConfig.port, mcpConfig.host, () => {
  console.log(`Supabase MCP server running at http://${mcpConfig.host}:${mcpConfig.port}`);
});
```

## Troubleshooting

### Common Issues and Solutions

#### 1. "Port XXXX is already in use"
The HTTP server attempts to find an available port automatically. You can manually specify a different port in your `.env` file by changing the `MCP_SERVER_PORT` value.

#### 2. "Missing required environment variables"
Make sure you have a proper `.env` file with all the required values or that you've set the environment variables in your system.

#### 3. "TypeError: Class constructor Server cannot be invoked without 'new'"
If you see this error, you may be running an older version of the package. Update to the latest version:
```bash
npm install -g supabase-mcp@latest
```

#### 4. JSON parsing errors with Claude
Make sure you're using the Claude-specific binary (`supabase-mcp-claude`) instead of the regular HTTP server (`supabase-mcp`).

#### 5. Request timed out with Claude
This usually means Claude initiated the connection but the server was unable to respond in time. Check:
- Are your Supabase credentials correct?
- Is your server setup properly and running?
- Is there anything blocking the connection?

## Tools Reference

### Database Tools

1. **queryDatabase**
   - Parameters:
     - `table` (string): Name of the table to query
     - `select` (string, optional): Comma-separated list of columns (default: "*")
     - `query` (object, optional): Filter conditions

2. **insertData**
   - Parameters:
     - `table` (string): Name of the table
     - `data` (object or array of objects): Data to insert

3. **updateData**
   - Parameters:
     - `table` (string): Name of the table
     - `data` (object): Data to update as key-value pairs
     - `query` (object): Filter conditions for the update

4. **deleteData**
   - Parameters:
     - `table` (string): Name of the table
     - `query` (object): Filter conditions for deletion

5. **listTables**
   - Parameters: None

### Edge Functions

1. **invokeEdgeFunction**
   - Parameters:
     - `functionName` (string): Name of the Edge Function to invoke
     - `payload` (object, optional): Optional payload to send to the function

## Version History

- 1.0.0: Initial release
- 1.0.1: Added automatic port selection
- 1.0.2: Fixed protocol compatibility issues
- 1.0.3: Added JSON-RPC support
- 1.1.0: Complete rewrite using official MCP SDK
- 1.2.0: Added separate Claude transport and fixed port conflict issues
- 1.3.0: Updated for improved compatibility with TypeScript projects
- 1.4.0: Fixed Claude stdio transport integration based on Supabase community best practices

## License

MIT