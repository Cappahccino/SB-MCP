import { Request, Response } from 'express';
import { mcpService } from '../services/mcp.js';
import { MCPToolCallRequest } from '../types/mcp.js';
import { mcpConfig } from '../config.js';

/**
 * Handle MCP tool call requests for database operations
 */
export const handleDatabaseOperation = async (req: Request, res: Response) => {
  try {
    // Validate API key
    const apiKey = req.headers['x-api-key'] as string;
    if (apiKey !== mcpConfig.apiKey) {
      return res.status(401).json({ error: 'Unauthorized: Invalid API key' });
    }

    const toolCall: MCPToolCallRequest = {
      name: req.params.operation,
      parameters: req.body
    };

    // Only allow database operations
    const allowedOperations = ['queryDatabase', 'insertData', 'updateData', 'deleteData', 'listTables'];
    if (!allowedOperations.includes(toolCall.name)) {
      return res.status(400).json({ 
        error: `Invalid database operation: ${toolCall.name}. Allowed operations are: ${allowedOperations.join(', ')}` 
      });
    }

    const result = await mcpService.handleToolCall(toolCall);
    
    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    return res.status(200).json({ data: result.content });
  } catch (error: any) {
    console.error('Database operation error:', error);
    return res.status(500).json({ error: `Server error: ${error.message}` });
  }
};

/**
 * Handle listing of database tables
 */
export const handleListTables = async (req: Request, res: Response) => {
  try {
    // Validate API key
    const apiKey = req.headers['x-api-key'] as string;
    if (apiKey !== mcpConfig.apiKey) {
      return res.status(401).json({ error: 'Unauthorized: Invalid API key' });
    }

    const toolCall: MCPToolCallRequest = {
      name: 'listTables',
      parameters: {}
    };

    const result = await mcpService.handleToolCall(toolCall);
    
    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    return res.status(200).json({ tables: result.content });
  } catch (error: any) {
    console.error('List tables error:', error);
    return res.status(500).json({ error: `Server error: ${error.message}` });
  }
};