import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { supabaseConfig } from '../config.js';
import { DatabaseResult, FetchTablesResult } from '../types/supabase.js';

class SupabaseService {
  private client: SupabaseClient;
  
  constructor() {
    // Initialize the Supabase client with service role key for full access
    this.client = createClient(
      supabaseConfig.url,
      supabaseConfig.serviceRoleKey
    );
  }

  // Database CRUD operations

  /**
   * Query data from a table with optional filters
   */
  async queryData<T = any>(
    tableName: string,
    query: Record<string, any> = {},
    select: string = '*'
  ): Promise<DatabaseResult<T[]>> {
    try {
      const queryBuilder = this.client.from(tableName).select(select);
      
      // Apply filters
      Object.entries(query).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          const [operator, operand] = Object.entries(value)[0];
          
          switch (operator) {
            case 'eq':
              queryBuilder.eq(key, operand);
              break;
            case 'neq':
              queryBuilder.neq(key, operand);
              break;
            case 'gt':
              queryBuilder.gt(key, operand);
              break;
            case 'gte':
              queryBuilder.gte(key, operand);
              break;
            case 'lt':
              queryBuilder.lt(key, operand);
              break;
            case 'lte':
              queryBuilder.lte(key, operand);
              break;
            case 'in':
              queryBuilder.in(key, Array.isArray(operand) ? operand : [operand]);
              break;
            case 'like':
              queryBuilder.like(key, `%${operand}%`);
              break;
            case 'ilike':
              queryBuilder.ilike(key, `%${operand}%`);
              break;
            default:
              queryBuilder.eq(key, value);
          }
        } else {
          queryBuilder.eq(key, value);
        }
      });

      const { data, error } = await queryBuilder;
      // Fix the type casting here
      return { data: data as T[], error };
    } catch (error) {
      return { data: null, error };
    }
  }

  /**
   * Insert data into a table
   */
  async insertData<T = any>(
    tableName: string,
    data: Record<string, any> | Record<string, any>[]
  ): Promise<DatabaseResult<T>> {
    try {
      const { data: result, error } = await this.client
        .from(tableName)
        .insert(data)
        .select();
      
      return { data: result as T, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  /**
   * Update data in a table based on a query
   */
  async updateData<T = any>(
    tableName: string,
    data: Record<string, any>,
    query: Record<string, any>
  ): Promise<DatabaseResult<T>> {
    try {
      let queryBuilder = this.client.from(tableName).update(data);
      
      // Apply filters
      Object.entries(query).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          const [operator, operand] = Object.entries(value)[0];
          
          switch (operator) {
            case 'eq':
              queryBuilder = queryBuilder.eq(key, operand);
              break;
            case 'neq':
              queryBuilder = queryBuilder.neq(key, operand);
              break;
            case 'gt':
              queryBuilder = queryBuilder.gt(key, operand);
              break;
            case 'gte':
              queryBuilder = queryBuilder.gte(key, operand);
              break;
            case 'lt':
              queryBuilder = queryBuilder.lt(key, operand);
              break;
            case 'lte':
              queryBuilder = queryBuilder.lte(key, operand);
              break;
            case 'in':
              queryBuilder = queryBuilder.in(key, Array.isArray(operand) ? operand : [operand]);
              break;
            default:
              queryBuilder = queryBuilder.eq(key, value);
          }
        } else {
          queryBuilder = queryBuilder.eq(key, value);
        }
      });

      const { data: result, error } = await queryBuilder.select();
      return { data: result as T, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  /**
   * Delete data from a table based on a query
   */
  async deleteData<T = any>(
    tableName: string,
    query: Record<string, any>
  ): Promise<DatabaseResult<T>> {
    try {
      let queryBuilder = this.client.from(tableName).delete();
      
      // Apply filters
      Object.entries(query).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          const [operator, operand] = Object.entries(value)[0];
          
          switch (operator) {
            case 'eq':
              queryBuilder = queryBuilder.eq(key, operand);
              break;
            case 'neq':
              queryBuilder = queryBuilder.neq(key, operand);
              break;
            case 'in':
              queryBuilder = queryBuilder.in(key, Array.isArray(operand) ? operand : [operand]);
              break;
            default:
              queryBuilder = queryBuilder.eq(key, value);
          }
        } else {
          queryBuilder = queryBuilder.eq(key, value);
        }
      });

      const { data: result, error } = await queryBuilder.select();
      return { data: result as T, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  /**
   * Fetch database table information
   */
  async listTables(): Promise<FetchTablesResult> {
    try {
      // Query to get tables and their columns
      const { data, error } = await this.client.rpc('get_tables_info');
      
      if (error) {
        return { tables: [], error };
      }
      
      // If no built-in RPC function, use this SQL query instead
      if (!data) {
        const { data: tablesData, error: tablesError } = await this.client
          .from('pg_tables')
          .select('schemaname, tablename')
          .eq('schemaname', 'public');
          
        if (tablesError) {
          return { tables: [], error: tablesError };
        }
        
        const tables = [];
        
        for (const table of tablesData || []) {
          const { data: columnsData, error: columnsError } = await this.client
            .from('information_schema.columns')
            .select('column_name, data_type, is_nullable')
            .eq('table_schema', 'public')
            .eq('table_name', table.tablename);
            
          if (columnsError) {
            continue;
          }
          
          tables.push({
            name: table.tablename,
            schema: table.schemaname,
            columns: columnsData.map((col) => ({
              name: col.column_name,
              type: col.data_type,
              is_nullable: col.is_nullable === 'YES',
              is_identity: false,
              is_primary_key: false
            }))
          });
        }
        
        return { tables, error: null };
      }
      
      return { tables: data, error: null };
    } catch (error) {
      return { tables: [], error };
    }
  }
}

// Export a singleton instance
export const supabaseService = new SupabaseService();