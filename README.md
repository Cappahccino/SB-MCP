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

## Installation

### Option 1: Install from npm (recommended)

The package is now published on npm! You can install it globally with:

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

## Usage with Claude Desktop

### Option 1: Simple Configuration with npm package (Recommended)

Now that the package is published on npm, you can use a much simpler configuration. Create a `mcp-config.json` file with the following content:

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

## API Documentation

### MCP Manifest

- `GET /.well-known/mcp-manifest` - Returns the MCP manifest describing available capabilities

### Database Operations

- `POST /database/queryDatabase` - Query data from a table
- `POST /database/insertData` - Insert data into a table
- `POST /database/updateData` - Update data in a table
- `POST /database/deleteData` - Delete data from a table
- `GET /database/tables` - List all tables

### Edge Functions

- `POST /edge-functions/:functionName` - Invoke an Edge Function
- `GET /edge-functions` - Get information about listing Edge Functions

## Security

- All endpoints (except the manifest) require an API key to be provided in the `x-api-key` header
- The API key should match the `MCP_API_KEY` in your environment variables
- The server uses the Supabase service role key for database operations, so be cautious about what operations are allowed

## Publishing to npm (for maintainers)

The package is already published to npm as `supabase-mcp`.

If you want to publish updates:

1. Update the version in package.json
2. Build the project: `npm run build`
3. Log in to npm: `npm login`
4. Publish: `npm publish`

## License

MIT