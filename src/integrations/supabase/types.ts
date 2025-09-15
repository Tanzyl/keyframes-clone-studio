export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      media_assets: {
        Row: {
          created_at: string
          dimensions: Json | null
          duration: number | null
          file_path: string
          file_size: number
          file_url: string | null
          id: string
          is_brand_asset: boolean | null
          media_type: Database["public"]["Enums"]["media_type"]
          metadata: Json | null
          mime_type: string
          name: string
          original_name: string
          project_id: string | null
          thumbnail_url: string | null
          uploaded_by: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          dimensions?: Json | null
          duration?: number | null
          file_path: string
          file_size: number
          file_url?: string | null
          id?: string
          is_brand_asset?: boolean | null
          media_type: Database["public"]["Enums"]["media_type"]
          metadata?: Json | null
          mime_type: string
          name: string
          original_name: string
          project_id?: string | null
          thumbnail_url?: string | null
          uploaded_by: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          dimensions?: Json | null
          duration?: number | null
          file_path?: string
          file_size?: number
          file_url?: string | null
          id?: string
          is_brand_asset?: boolean | null
          media_type?: Database["public"]["Enums"]["media_type"]
          metadata?: Json | null
          mime_type?: string
          name?: string
          original_name?: string
          project_id?: string | null
          thumbnail_url?: string | null
          uploaded_by?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_assets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_assets_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      project_exports: {
        Row: {
          completed_at: string | null
          created_by: string
          error_message: string | null
          export_settings: Json
          file_size: number | null
          file_url: string | null
          id: string
          progress: number | null
          project_id: string
          started_at: string | null
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          created_by: string
          error_message?: string | null
          export_settings: Json
          file_size?: number | null
          file_url?: string | null
          id?: string
          progress?: number | null
          project_id: string
          started_at?: string | null
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          created_by?: string
          error_message?: string | null
          export_settings?: Json
          file_size?: number | null
          file_url?: string | null
          id?: string
          progress?: number | null
          project_id?: string
          started_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_exports_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_templates: {
        Row: {
          category: string | null
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          template_data: Json
          thumbnail_url: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          template_data: Json
          thumbnail_url?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          template_data?: Json
          thumbnail_url?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          canvas_data: Json | null
          created_at: string
          description: string | null
          id: string
          name: string
          owner_id: string
          settings: Json | null
          status: Database["public"]["Enums"]["project_status"] | null
          thumbnail_url: string | null
          timeline_data: Json | null
          updated_at: string
          workspace_id: string
        }
        Insert: {
          canvas_data?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          owner_id: string
          settings?: Json | null
          status?: Database["public"]["Enums"]["project_status"] | null
          thumbnail_url?: string | null
          timeline_data?: Json | null
          updated_at?: string
          workspace_id: string
        }
        Update: {
          canvas_data?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          owner_id?: string
          settings?: Json | null
          status?: Database["public"]["Enums"]["project_status"] | null
          thumbnail_url?: string | null
          timeline_data?: Json | null
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_items: {
        Row: {
          created_at: string
          duration: number
          end_time: number
          id: string
          layer_order: number | null
          media_asset_id: string | null
          project_id: string
          properties: Json | null
          start_time: number
          track_id: string
        }
        Insert: {
          created_at?: string
          duration: number
          end_time: number
          id?: string
          layer_order?: number | null
          media_asset_id?: string | null
          project_id: string
          properties?: Json | null
          start_time: number
          track_id: string
        }
        Update: {
          created_at?: string
          duration?: number
          end_time?: number
          id?: string
          layer_order?: number | null
          media_asset_id?: string | null
          project_id?: string
          properties?: Json | null
          start_time?: number
          track_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "timeline_items_media_asset_id_fkey"
            columns: ["media_asset_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timeline_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timeline_items_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "timeline_tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_tracks: {
        Row: {
          created_at: string
          height: number | null
          id: string
          is_locked: boolean | null
          is_visible: boolean | null
          name: string
          position: number
          project_id: string
          track_type: string
        }
        Insert: {
          created_at?: string
          height?: number | null
          id?: string
          is_locked?: boolean | null
          is_visible?: boolean | null
          name: string
          position?: number
          project_id: string
          track_type: string
        }
        Update: {
          created_at?: string
          height?: number | null
          id?: string
          is_locked?: boolean | null
          is_visible?: boolean | null
          name?: string
          position?: number
          project_id?: string
          track_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "timeline_tracks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_members: {
        Row: {
          id: string
          joined_at: string
          role: Database["public"]["Enums"]["workspace_role"]
          user_id: string
          workspace_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          role?: Database["public"]["Enums"]["workspace_role"]
          user_id: string
          workspace_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          role?: Database["public"]["Enums"]["workspace_role"]
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          owner_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          owner_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          owner_id?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      media_type:
        | "image"
        | "video"
        | "audio"
        | "font"
        | "element"
        | "transition"
        | "sticker"
      project_status: "draft" | "published" | "archived"
      workspace_role: "owner" | "admin" | "editor" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      media_type: [
        "image",
        "video",
        "audio",
        "font",
        "element",
        "transition",
        "sticker",
      ],
      project_status: ["draft", "published", "archived"],
      workspace_role: ["owner", "admin", "editor", "viewer"],
    },
  },
} as const
