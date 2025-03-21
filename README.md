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
```

## Usage with Claude Desktop

### Option 1: Using the Configuration UI

1. Open Claude Desktop
2. Go to Settings > MCP
3. Click "Add MCP Server"
4. For the configuration, set:
   - **Name**: Supabase
   - **Transport Type**: Stdio
   - **Command**: npx
   - **Arguments**: `-y supabase-mcp`
   - **Environment Variables**: Add the required Supabase environment variables
5. Click "Add"

### Option 2: Using mcp-config.json

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
        "SUPABASE_SERVICE_ROLE_KEY": "your_supabase_service_role_key"
      }
    }
  }
}
```

Then:

1. Open Claude Desktop
2. Go to Settings > MCP
3. Click on "Advanced Configuration"
4. Click on "Select Configuration File"
5. Browse to and select your `mcp-config.json` file
6. Click "Save" or "Apply"

You should see a green "active" status once connected.

## Example Prompts

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

If you encounter connection issues, ensure:

1. Your Supabase credentials are correct
2. The MCP server is properly configured in Claude Desktop
3. You're using the latest version of the package
4. There are no other MCP servers running on the same port

## Publishing to npm (for maintainers)

The package is published to npm as `supabase-mcp`.

If you want to publish updates:

1. Update the version in package.json
2. Build the project: `npm run build`
3. Log in to npm: `npm login`
4. Publish: `npm publish`

## Architecture

This MCP server is built using the [Model Context Protocol TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk), which provides a standardized interface for connecting AI assistants like Claude to external tools and data.

The server uses a stdio transport to communicate with Claude Desktop, meaning it receives requests on stdin and sends responses on stdout, following the MCP JSON-RPC protocol.

## Version History

- 1.0.0: Initial release
- 1.0.1: Added automatic port selection
- 1.0.2: Fixed protocol compatibility issues
- 1.0.3: Added JSON-RPC support
- 1.1.0: Complete rewrite using official MCP SDK

## License

MIT