export interface Database {
  public: {
    Tables: {
      tool_favorites: {
        Row: {
          id: string;
          user_id: string;
          tool_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          tool_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          tool_id?: string;
          created_at?: string;
        };
      };
      tool_history: {
        Row: {
          id: string;
          user_id: string;
          tool_id: string;
          input_data: JSON | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          tool_id: string;
          input_data?: JSON | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          tool_id?: string;
          input_data?: JSON | null;
          created_at?: string;
        };
      };
      user_settings: {
        Row: {
          user_id: string;
          theme: string;
          language: string;
          dashboard_layout: JSON | null;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          theme?: string;
          language?: string;
          dashboard_layout?: JSON | null;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          theme?: string;
          language?: string;
          dashboard_layout?: JSON | null;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
} 
