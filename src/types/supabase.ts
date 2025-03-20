// Supabase specific types

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey: string;
}

export interface EdgeFunctionResult {
  data: any;
  error: any;
}

export interface DatabaseResult<T = any> {
  data: T | null;
  error: any;
}

export interface FetchTablesResult {
  tables: {
    name: string;
    schema: string;
    columns: {
      name: string;
      type: string;
      is_nullable: boolean;
      is_identity: boolean;
      is_primary_key: boolean;
    }[];
  }[];
  error: any;
}

// Add any other Supabase-specific types as needed