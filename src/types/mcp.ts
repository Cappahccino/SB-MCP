// Basic MCP types as per the Model Context Protocol specification

export interface MCPManifest {
  schema_version: string;
  human_description: string;
  models: string[];
  display_name: string;
  contact_email: string;
  logo_url?: string;
  capabilities: MCPCapability[];
}

export interface MCPCapability {
  name: string;
  description: string;
  authentication?: MCPAuthentication;
  resources?: MCPResource[];
  tools?: MCPTool[];
  is_default: boolean;
}

export interface MCPAuthentication {
  type: string;
  instructions: string;
}

export interface MCPResource {
  name: string;
  description: string;
  content: string;
}

export interface MCPTool {
  name: string;
  description: string;
  parameters?: {
    type: string;
    properties?: Record<string, any>;
    required?: string[];
  };
  returns?: {
    type: string;
    properties?: Record<string, any>;
    required?: string[];
  };
}

// Request and response types for MCP API

export interface MCPToolCallRequest {
  name: string;
  parameters: Record<string, any>;
}

export interface MCPToolCallResponse {
  content?: any;
  error?: string;
}

// Database CRUD operation types

export interface DatabaseParams {
  table: string;
  data?: Record<string, any> | Record<string, any>[];
  id?: string | number;
  query?: Record<string, any>;
  select?: string;
}

// Edge Function types

export interface EdgeFunctionParams {
  functionName: string;
  payload?: Record<string, any>;
}