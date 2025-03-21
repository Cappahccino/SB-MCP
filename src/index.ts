#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { supabaseService } from "./supabase.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create the MCP server
const server = new McpServer({
  name: "Supabase MCP",
  version: "1.1.0",
  description: "MCP server for Supabase CRUD operations and Edge Functions"
});

// ==== Database Tools ====

// Query Database Tool
server.tool(
  "queryDatabase",
  {
    table: z.string().describe("Name of the table to query"),
    select: z.string().optional().describe("Comma-separated list of columns to select (default: *)"),
    query: z.record(z.any()).optional().describe("Filter conditions")
  },
  async ({ table, select = "*", query = {} }) => {
    const result = await supabaseService.queryData(table, query, select);
    
    if (result.error) {
      return {
        content: [{ 
          type: "text", 
          text: `Error querying table ${table}: ${JSON.stringify(result.error)}` 
        }],
        isError: true
      };
    }
    
    return {
      content: [{ 
        type: "text", 
        text: JSON.stringify(result.data, null, 2) 
      }]
    };
  }
);

// Insert Data Tool
server.tool(
  "insertData",
  {
    table: z.string().describe("Name of the table"),
    data: z.union([
      z.record(z.any()),
      z.array(z.record(z.any()))
    ]).describe("Data to insert")
  },
  async ({ table, data }) => {
    const result = await supabaseService.insertData(table, data);
    
    if (result.error) {
      return {
        content: [{ 
          type: "text", 
          text: `Error inserting data into table ${table}: ${JSON.stringify(result.error)}` 
        }],
        isError: true
      };
    }
    
    return {
      content: [{ 
        type: "text", 
        text: `Successfully inserted data into ${table}. Result: ${JSON.stringify(result.data, null, 2)}` 
      }]
    };
  }
);

// Update Data Tool
server.tool(
  "updateData",
  {
    table: z.string().describe("Name of the table"),
    data: z.record(z.any()).describe("Data to update as key-value pairs"),
    query: z.record(z.any()).describe("Filter conditions for the update")
  },
  async ({ table, data, query }) => {
    const result = await supabaseService.updateData(table, data, query);
    
    if (result.error) {
      return {
        content: [{ 
          type: "text", 
          text: `Error updating data in table ${table}: ${JSON.stringify(result.error)}` 
        }],
        isError: true
      };
    }
    
    return {
      content: [{ 
        type: "text", 
        text: `Successfully updated data in ${table}. Result: ${JSON.stringify(result.data, null, 2)}` 
      }]
    };
  }
);

// Delete Data Tool
server.tool(
  "deleteData",
  {
    table: z.string().describe("Name of the table"),
    query: z.record(z.any()).describe("Filter conditions for deletion")
  },
  async ({ table, query }) => {
    const result = await supabaseService.deleteData(table, query);
    
    if (result.error) {
      return {
        content: [{ 
          type: "text", 
          text: `Error deleting data from table ${table}: ${JSON.stringify(result.error)}` 
        }],
        isError: true
      };
    }
    
    return {
      content: [{ 
        type: "text", 
        text: `Successfully deleted data from ${table}. Result: ${JSON.stringify(result.data, null, 2)}` 
      }]
    };
  }
);

// List Tables Tool
server.tool(
  "listTables",
  {},
  async () => {
    const result = await supabaseService.listTables();
    
    if (result.error) {
      return {
        content: [{ 
          type: "text", 
          text: `Error fetching tables: ${JSON.stringify(result.error)}` 
        }],
        isError: true
      };
    }
    
    return {
      content: [{ 
        type: "text", 
        text: JSON.stringify(result.tables, null, 2) 
      }]
    };
  }
);

// ==== Edge Functions ====

// Invoke Edge Function Tool
server.tool(
  "invokeEdgeFunction",
  {
    functionName: z.string().describe("Name of the Edge Function to invoke"),
    payload: z.record(z.any()).optional().describe("Optional payload to send to the function")
  },
  async ({ functionName, payload = {} }) => {
    const result = await supabaseService.invokeEdgeFunction(functionName, payload);
    
    if (result.error) {
      return {
        content: [{ 
          type: "text", 
          text: `Error invoking Edge Function ${functionName}: ${JSON.stringify(result.error)}` 
        }],
        isError: true
      };
    }
    
    return {
      content: [{ 
        type: "text", 
        text: JSON.stringify(result.data, null, 2) 
      }]
    };
  }
);

// Start the server with stdio transport
const transport = new StdioServerTransport();
server.connect(transport)
  .then(() => {
    console.error("Supabase MCP server connected and ready"); // Using console.error to send to stderr, not interfere with MCP protocol
  })
  .catch((error) => {
    console.error("Error starting Supabase MCP server:", error);
    process.exit(1);
  });