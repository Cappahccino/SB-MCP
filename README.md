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

## Usage as a Standalone Server

After installing globally:

```bash
supabase-mcp
```

This will start the MCP server at http://localhost:3000 (or the port specified in your .env file).

## Usage with Claude Desktop

To use with Claude Desktop, you have two options:

### Option 1: Using the Configuration UI

1. Open Claude Desktop
2. Go to Settings > Model Context Protocol
3. Click "Add MCP Server"
4. For the configuration, set:
   - **Name**: Supabase
   - **Transport Type**: Stdio
   - **Command**: supabase-mcp-claude
   - **Environment Variables**: Add the required Supabase environment variables
5. Click "Add"

### Option 2: Using mcp-config.json

Create a `mcp-config.json` file with the following content:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "supabase-mcp-claude",
      "env": {
        "SUPABASE_URL": "your_supabase_project_url",
        "SUPABASE_ANON_KEY": "your_supabase_anon_key",
        "SUPABASE_SERVICE_ROLE_KEY": "your_supabase_service_role_key",
        "MCP_API_KEY": "your_secret_api_key"
      }
    }
  }
}
```

Then:

1. Open Claude Desktop
2. Go to Settings > Model Context Protocol
3. Click on "Advanced Configuration"
4. Click on "Select Configuration File"
5. Browse to and select your `mcp-config.json` file
6. Click "Save" or "Apply"

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

### Port Already in Use

If you see "Port XXXX is already in use", the server will automatically try to find an available port. You can manually specify a different port in your `.env` file by changing the `MCP_SERVER_PORT` value.

### Missing Required Environment Variables

If you see "Missing required environment variables", make sure you have a proper `.env` file with all the required values or that you've set the environment variables in your system.

### JSON Parsing Errors in Claude

If Claude is showing "Unexpected token" errors, make sure you're using the correct Claude-specific command:

```bash
supabase-mcp-claude  # For Claude Desktop specifically
```

Instead of:

```bash
supabase-mcp  # The regular HTTP server
```

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

## License

MIT