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
  - Invoke Edge Functions
  - Pass payloads to functions

- Server features:
  - Automatic port selection (will find an available port if the default is in use)
  - Full MCP protocol compatibility with JSON-RPC support

## Installation

### Option 1: Install from npm (recommended)

The package is published on npm! You can install it globally with:

```bash
npm install -g supabase-mcp
```

This makes it easy to use with Claude Desktop without specifying absolute paths.

### Option 2: Clone the repository

```bash
git clone https://github.com/Cappahccino/SB-MCP.git
cd SB-MCP
npm install
npm run build
```

## Configuration

Create a `.env` file with your Supabase credentials and MCP configuration:

```
# Supabase credentials
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# MCP Server configuration
MCP_SERVER_PORT=3000
MCP_SERVER_HOST=localhost
MCP_API_KEY=your_mcp_api_key
```

## Usage

### Running as a standalone server

If you installed globally:

```bash
supabase-mcp
```

If you cloned the repository:

```bash
npm start
```

## Auto Port Selection

The server includes automatic port selection! If the configured port (default 3000) is already in use, the server will automatically find the next available port. This eliminates the "EADDRINUSE: address already in use" error that happens when multiple instances of the server try to use the same port.

For example, if port 3000 is already in use, the server will try ports 3001, 3002, etc., until it finds an available one.

## Usage with Claude Desktop

### Option 1: Simple Configuration with npm package (Recommended)

Create a `mcp-config.json` file with the following content:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "supabase-mcp"],
      "env": {
        "SUPABASE_URL": "your_supabase_project_url",
        "SUPABASE_ANON_KEY": "your_supabase_anon_key",
        "SUPABASE_SERVICE_ROLE_KEY": "your_supabase_service_role_key",
        "MCP_API_KEY": "your_mcp_api_key"
      }
    }
  }
}
```

### Option 2: If using the cloned repository

```json
{
  "mcpServers": {
    "supabase": {
      "command": "node",
      "args": ["/absolute/path/to/SB-MCP/dist/index.js"],
      "env": {
        "SUPABASE_URL": "your_supabase_project_url",
        "SUPABASE_ANON_KEY": "your_supabase_anon_key",
        "SUPABASE_SERVICE_ROLE_KEY": "your_supabase_service_role_key",
        "MCP_API_KEY": "your_mcp_api_key"
      }
    }
  }
}
```

### Connecting to Claude

1. Open Claude Desktop
2. Go to Settings > MCP
3. For manual configuration:
   - Click "Add MCP Server"
   - Enter the URL: `http://localhost:3000` (or your chosen host/port)
   - Click "Add"
4. For automatic configuration:
   - Click on "Advanced Configuration"
   - Click on "Select Configuration File"
   - Browse to and select your `mcp-config.json` file
   - Click "Save" or "Apply"
5. You should see a green "active" status once connected

## Example Prompts

Once connected, you can use natural language to interact with your Supabase database:

- "Query all users from the 'profiles' table where the status is 'active'"
- "Insert a new product with name 'Widget', price 19.99, and category 'Tools' into the products table"
- "Update the 'users' table to set status to 'inactive' where last_login was before 2023-01-01"
- "Delete all expired sessions from the 'sessions' table"
- "Invoke the 'process-payment' Edge Function with the order ID and amount"

## Troubleshooting

### JSON Parsing Errors

If you see errors like `Unexpected token 'S', "Supabase M"...` in your logs, make sure you're using version 1.0.2 or later of the package which fixes MCP protocol compatibility issues.

### Request Timeout Errors

If you see errors like `"Error: MCP error -32001: Request timed out"`, make sure you're using version 1.0.3 or later which implements the proper JSON-RPC protocol that Claude expects.

## API Documentation

### MCP Protocol Endpoints

- `GET /.well-known/mcp-manifest` - Returns the MCP manifest describing capabilities
- `POST /mcp` - JSON-RPC endpoint for MCP protocol communication

### REST API Endpoints

- `POST /database/queryDatabase` - Query data from a table
- `POST /database/insertData` - Insert data into a table
- `POST /database/updateData` - Update data in a table
- `POST /database/deleteData` - Delete data from a table
- `GET /database/tables` - List all tables
- `POST /edge-functions/:functionName` - Invoke an Edge Function
- `GET /edge-functions` - Get information about listing Edge Functions

## Security

- All endpoints (except the manifest and MCP JSON-RPC) require an API key to be provided in the `x-api-key` header
- The API key should match the `MCP_API_KEY` in your environment variables
- The server uses the Supabase service role key for database operations, so be cautious about what operations are allowed

## Publishing to npm (for maintainers)

The package is published to npm as `supabase-mcp`.

If you want to publish updates:

1. Update the version in package.json
2. Build the project: `npm run build`
3. Log in to npm: `npm login`
4. Publish: `npm publish`

## Version History

- 1.0.0: Initial release
- 1.0.1: Added automatic port selection to fix EADDRINUSE errors
- 1.0.2: Fixed MCP protocol compatibility issues by directing logs to stderr
- 1.0.3: Implemented proper JSON-RPC support for full MCP protocol compliance

## License

MIT