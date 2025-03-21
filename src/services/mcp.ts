import { supabaseService } from './supabase.js';
import { MCPToolCallRequest, MCPToolCallResponse, DatabaseParams, EdgeFunctionParams } from '../types/mcp.js';

class MCPService {
  /**
   * Handle tool call requests from Claude
   */
  async handleToolCall(toolCall: MCPToolCallRequest): Promise<MCPToolCallResponse> {
    const { name, parameters } = toolCall;

    try {
      switch (name) {
        case 'queryDatabase':
          return await this.handleQueryDatabase(parameters as DatabaseParams);
        
        case 'insertData':
          return await this.handleInsertData(parameters as DatabaseParams);
        
        case 'updateData':
          return await this.handleUpdateData(parameters as DatabaseParams);
        
        case 'deleteData':
          return await this.handleDeleteData(parameters as DatabaseParams);
        
        case 'invokeEdgeFunction':
          return await this.handleInvokeEdgeFunction(parameters as EdgeFunctionParams);
        
        case 'listTables':
          return await this.handleListTables();
        
        default:
          return {
            error: `Unknown tool: ${name}`
          };
      }
    } catch (error: any) {
      return {
        error: `Error executing tool ${name}: ${error.message}`
      };
    }
  }

  /**
   * Handle database query operation
   */
  private async handleQueryDatabase(params: DatabaseParams): Promise<MCPToolCallResponse> {
    const { table, query = {}, select = '*' } = params;
    
    if (!table) {
      return { error: 'Table name is required' };
    }

    const result = await supabaseService.queryData(table, query, select);
    
    if (result.error) {
      return {
        error: `Database query error: ${result.error.message || JSON.stringify(result.error)}`
      };
    }

    return { content: result.data };
  }

  /**
   * Handle database insert operation
   */
  private async handleInsertData(params: DatabaseParams): Promise<MCPToolCallResponse> {
    const { table, data } = params;
    
    if (!table) {
      return { error: 'Table name is required' };
    }
    
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return { error: 'Data is required for insert operation' };
    }

    const result = await supabaseService.insertData(table, data);
    
    if (result.error) {
      return {
        error: `Database insert error: ${result.error.message || JSON.stringify(result.error)}`
      };
    }

    return { content: result.data };
  }

  /**
   * Handle database update operation
   */
  private async handleUpdateData(params: DatabaseParams): Promise<MCPToolCallResponse> {
    const { table, data, query } = params;
    
    if (!table) {
      return { error: 'Table name is required' };
    }
    
    if (!data || Object.keys(data).length === 0) {
      return { error: 'Data is required for update operation' };
    }
    
    if (!query || Object.keys(query).length === 0) {
      return { error: 'Query is required for update operation' };
    }

    const result = await supabaseService.updateData(table, data as Record<string, any>, query);
    
    if (result.error) {
      return {
        error: `Database update error: ${result.error.message || JSON.stringify(result.error)}`
      };
    }

    return { content: result.data };
  }

  /**
   * Handle database delete operation
   */
  private async handleDeleteData(params: DatabaseParams): Promise<MCPToolCallResponse> {
    const { table, query } = params;
    
    if (!table) {
      return { error: 'Table name is required' };
    }
    
    if (!query || Object.keys(query).length === 0) {
      return { error: 'Query is required for delete operation' };
    }

    const result = await supabaseService.deleteData(table, query);
    
    if (result.error) {
      return {
        error: `Database delete error: ${result.error.message || JSON.stringify(result.error)}`
      };
    }

    return { content: result.data };
  }

  /**
   * Handle Edge Function invocation
   */
  private async handleInvokeEdgeFunction(params: EdgeFunctionParams): Promise<MCPToolCallResponse> {
    const { functionName, payload = {} } = params;
    
    if (!functionName) {
      return { error: 'Function name is required' };
    }

    const result = await supabaseService.invokeEdgeFunction(functionName, payload);
    
    if (result.error) {
      return {
        error: `Edge Function error: ${result.error.message || JSON.stringify(result.error)}`
      };
    }

    return { content: result.data };
  }

  /**
   * Handle listing database tables
   */
  private async handleListTables(): Promise<MCPToolCallResponse> {
    const result = await supabaseService.listTables();
    
    if (result.error) {
      return {
        error: `Error fetching tables: ${result.error.message || JSON.stringify(result.error)}`
      };
    }

    return { content: result.tables };
  }
}

// Export a singleton instance
export const mcpService = new MCPService();