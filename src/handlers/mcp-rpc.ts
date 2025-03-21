import { Request, Response } from 'express';
import { mcpService } from '../services/mcp';

interface JsonRpcRequest {
  jsonrpc: string;
  id: number | string;
  method: string;
  params: any;
}

interface JsonRpcResponse {
  jsonrpc: string;
  id: number | string;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

/**
 * Handle JSON-RPC requests for the Model Context Protocol
 */
export const handleJsonRpc = async (req: Request, res: Response) => {
  try {
    // Parse the JSON-RPC request
    const jsonRpcRequest = req.body as JsonRpcRequest;
    
    if (!jsonRpcRequest || !jsonRpcRequest.method) {
      return res.status(400).json({
        jsonrpc: '2.0',
        id: null,
        error: {
          code: -32600,
          message: 'Invalid Request'
        }
      });
    }

    // Handle initialization
    if (jsonRpcRequest.method === 'initialize') {
      // Just acknowledge the initialization
      return res.status(200).json({
        jsonrpc: '2.0',
        id: jsonRpcRequest.id,
        result: {
          capabilities: {
            tools: true
          }
        }
      });
    }
    
    // Handle tool calls
    if (jsonRpcRequest.method === 'tools/invoke') {
      const { name, parameters } = jsonRpcRequest.params;
      
      const result = await mcpService.handleToolCall({
        name,
        parameters
      });
      
      if (result.error) {
        return res.status(200).json({
          jsonrpc: '2.0',
          id: jsonRpcRequest.id,
          error: {
            code: -32000,
            message: result.error
          }
        });
      }
      
      return res.status(200).json({
        jsonrpc: '2.0',
        id: jsonRpcRequest.id,
        result: result.content
      });
    }

    // Unknown method
    return res.status(200).json({
      jsonrpc: '2.0',
      id: jsonRpcRequest.id,
      error: {
        code: -32601,
        message: 'Method not found'
      }
    });
  } catch (error: any) {
    console.error('JSON-RPC handler error:', error);
    return res.status(200).json({
      jsonrpc: '2.0',
      id: null,
      error: {
        code: -32603,
        message: 'Internal error',
        data: error.message
      }
    });
  }
};