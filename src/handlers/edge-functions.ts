import { Request, Response } from 'express';
import { mcpService } from '../services/mcp';
import { MCPToolCallRequest } from '../types/mcp';
import { mcpConfig } from '../config';

/**
 * Handle MCP tool call requests for Edge Functions
 */
export const handleEdgeFunction = async (req: Request, res: Response) => {
  try {
    // Validate API key
    const apiKey = req.headers['x-api-key'] as string;
    if (apiKey !== mcpConfig.apiKey) {
      return res.status(401).json({ error: 'Unauthorized: Invalid API key' });
    }

    const functionName = req.params.functionName;
    if (!functionName) {
      return res.status(400).json({ error: 'Function name is required' });
    }

    const toolCall: MCPToolCallRequest = {
      name: 'invokeEdgeFunction',
      parameters: {
        functionName,
        payload: req.body || {}
      }
    };

    const result = await mcpService.handleToolCall(toolCall);
    
    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    return res.status(200).json({ data: result.content });
  } catch (error: any) {
    console.error('Edge function error:', error);
    return res.status(500).json({ error: `Server error: ${error.message}` });
  }
};

/**
 * List available Edge Functions
 * This isn't directly tied to the MCP service as listing functions
 * might require a different approach depending on your Supabase setup
 */
export const handleListEdgeFunctions = async (req: Request, res: Response) => {
  try {
    // Validate API key
    const apiKey = req.headers['x-api-key'] as string;
    if (apiKey !== mcpConfig.apiKey) {
      return res.status(401).json({ error: 'Unauthorized: Invalid API key' });
    }

    // Note: Supabase doesn't have a direct API to list edge functions
    // You might need to either:
    // 1. Maintain a list of functions in your own database
    // 2. Use the Supabase Management API if available
    // 3. Create a special edge function that returns all other function names
    
    // For this example, we'll return a message about the limitation
    return res.status(200).json({ 
      message: "Listing Edge Functions directly is not supported by the Supabase API. Consider creating a dedicated function that returns the list of available functions.",
      suggestion: "You can create an Edge Function called 'list-functions' that returns metadata about all available functions."
    });
  } catch (error: any) {
    console.error('List edge functions error:', error);
    return res.status(500).json({ error: `Server error: ${error.message}` });
  }
};