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

## Usage with Claude

### REST API Endpoints

The server exposes several REST API endpoints that Claude can interact with:

- `GET /.well-known/mcp-manifest` - Returns the MCP manifest
- `POST /mcp` - MCP JSON-RPC endpoint
- `GET /health` - Health check
- `POST /database/:operation` - CRUD operations
- `GET /database/tables` - List tables
- `POST /edge-functions/:functionName` - Invoke Edge Functions
- `GET /edge-functions` - List Edge Functions

Make sure to include the `x-api-key` header with your API key for all endpoints except the manifest.

### Example Prompts for Claude

Once connected, you can use natural language to interact with your Supabase database:

- "Query all users from the 'profiles' table where the status is 'active'"
- "Insert a new product with name 'Widget', price 19.99, and category 'Tools' into the products table"
- "Update the 'users' table to set status to 'inactive' where last_login was before 2023-01-01"
- "Delete all expired sessions from the 'sessions' table"
- "Invoke the 'process-payment' Edge Function with the order ID and amount"

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

## Troubleshooting

If you encounter issues:

1. Ensure your Supabase credentials are correct
2. Check if the server is running with `curl http://localhost:3000/health`
3. Verify your API key is correctly set and included in requests
4. Check for error messages in the console where the server is running
5. Ensure you're using the latest version of the package

## Development

To contribute to this project:

1. Clone the repository
2. Install dependencies: `npm install`
3. Make changes
4. Build: `npm run build`
5. Test: `npm test`

## Version History

- 1.0.0: Initial release
- 1.0.1: Added automatic port selection
- 1.0.2: Fixed protocol compatibility issues
- 1.0.3: Added JSON-RPC support
- 1.1.0: Complete rewrite using official MCP SDK
- 1.2.0: Module format update for improved compatibility

## License

MIT