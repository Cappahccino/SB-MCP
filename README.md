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

## Prerequisites

- Node.js (v16 or newer)
- npm or yarn
- Supabase project with API keys

## Installation

1. Clone this repository:
```bash
git clone https://github.com/Cappahccino/SB-MCP.git
cd SB-MCP
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your Supabase credentials and MCP configuration:
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

4. Build the project:
```bash
npm run build
```

5. Start the server:
```bash
npm start
```

## Usage with Claude

1. Start the MCP server
2. In Claude Desktop, go to Settings > MCP
3. Add a new MCP server with the URL `http://localhost:3000` (or your chosen host/port)
4. You should see a green active status once connected
5. You can now use Claude to perform database operations and invoke Edge Functions

Example prompts:

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

## License

MIT