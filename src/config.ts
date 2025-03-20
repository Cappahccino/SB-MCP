import dotenv from 'dotenv';
import { SupabaseConfig } from './types/supabase';

// Load environment variables
dotenv.config();

// Supabase configuration
export const supabaseConfig: SupabaseConfig = {
  url: process.env.SUPABASE_URL || '',
  anonKey: process.env.SUPABASE_ANON_KEY || '',
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
};

// MCP server configuration
export const mcpConfig = {
  port: parseInt(process.env.MCP_SERVER_PORT || '3000', 10),
  host: process.env.MCP_SERVER_HOST || 'localhost',
  apiKey: process.env.MCP_API_KEY || '',
};

// Validate required configuration
export function validateConfig() {
  const missingEnvVars = [];

  if (!supabaseConfig.url) missingEnvVars.push('SUPABASE_URL');
  if (!supabaseConfig.anonKey) missingEnvVars.push('SUPABASE_ANON_KEY');
  if (!supabaseConfig.serviceRoleKey) missingEnvVars.push('SUPABASE_SERVICE_ROLE_KEY');
  if (!mcpConfig.apiKey) missingEnvVars.push('MCP_API_KEY');

  if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  }
}

// MCP manifest configuration (used in the /.well-known/mcp-manifest route)
export const mcpManifest = {
  schema_version: "1.0",
  human_description: "Supabase MCP server for performing CRUD operations on Postgres tables and interacting with Edge Functions",
  models: ["claude-3-opus-20240229", "claude-3-sonnet-20240229", "claude-3-haiku-20240307"],
  display_name: "Supabase Database & Edge Functions",
  contact_email: "your-email@example.com",
  logo_url: null,
  capabilities: [
    {
      name: "supabase",
      description: "Perform CRUD operations on Supabase Postgres tables and invoke Edge Functions",
      authentication: {
        type: "api_key",
        instructions: "Set the MCP_API_KEY environment variable in the .env file"
      },
      tools: [
        {
          name: "queryDatabase",
          description: "Query data from a Postgres table with filters",
          parameters: {
            type: "object",
            properties: {
              table: { type: "string", description: "Name of the table to query" },
              select: { type: "string", description: "Comma-separated list of columns to select (default: *)" },
              query: { type: "object", description: "Filter conditions" }
            },
            required: ["table"]
          }
        },
        {
          name: "insertData",
          description: "Insert data into a Postgres table",
          parameters: {
            type: "object",
            properties: {
              table: { type: "string", description: "Name of the table" },
              data: { 
                type: "object",
                description: "Data to insert as key-value pairs or array of objects"
              }
            },
            required: ["table", "data"]
          }
        },
        {
          name: "updateData",
          description: "Update data in a Postgres table",
          parameters: {
            type: "object",
            properties: {
              table: { type: "string", description: "Name of the table" },
              data: { type: "object", description: "Data to update as key-value pairs" },
              query: { type: "object", description: "Filter conditions for the update" }
            },
            required: ["table", "data", "query"]
          }
        },
        {
          name: "deleteData",
          description: "Delete data from a Postgres table",
          parameters: {
            type: "object",
            properties: {
              table: { type: "string", description: "Name of the table" },
              query: { type: "object", description: "Filter conditions for deletion" }
            },
            required: ["table", "query"]
          }
        },
        {
          name: "invokeEdgeFunction",
          description: "Invoke a Supabase Edge Function",
          parameters: {
            type: "object",
            properties: {
              functionName: { type: "string", description: "Name of the Edge Function to invoke" },
              payload: { type: "object", description: "Optional payload to send to the function" }
            },
            required: ["functionName"]
          }
        },
        {
          name: "listTables",
          description: "Get a list of available tables in the database",
          parameters: {
            type: "object",
            properties: {}
          }
        }
      ],
      is_default: true
    }
  ]
};