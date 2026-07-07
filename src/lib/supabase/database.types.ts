export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      banners: {
        Row: {
          active: boolean;
          created_at: string;
          ends_at: string;
          id: string;
          image_path: string | null;
          link: string | null;
          starts_at: string;
          subtitle: string | null;
          title: string;
        };
        Insert: {
          active?: boolean;
          created_at?: string;
          ends_at: string;
          id?: string;
          image_path?: string | null;
          link?: string | null;
          starts_at: string;
          subtitle?: string | null;
          title: string;
        };
        Update: {
          active?: boolean;
          created_at?: string;
          ends_at?: string;
          id?: string;
          image_path?: string | null;
          link?: string | null;
          starts_at?: string;
          subtitle?: string | null;
          title?: string;
        };
        Relationships: [];
      };
      delivery_zones: {
        Row: {
          active: boolean;
          fee_cop: number;
          id: string;
          municipality: string;
        };
        Insert: {
          active?: boolean;
          fee_cop: number;
          id?: string;
          municipality: string;
        };
        Update: {
          active?: boolean;
          fee_cop?: number;
          id?: string;
          municipality?: string;
        };
        Relationships: [];
      };
      occasions: {
        Row: {
          emoji: string | null;
          id: string;
          name: string;
          position: number;
          slug: string;
        };
        Insert: {
          emoji?: string | null;
          id?: string;
          name: string;
          position?: number;
          slug: string;
        };
        Update: {
          emoji?: string | null;
          id?: string;
          name?: string;
          position?: number;
          slug?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          product_name: string;
          qty: number;
          unit_price_cop: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          product_name: string;
          qty: number;
          unit_price_cop: number;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          product_name?: string;
          qty?: number;
          unit_price_cop?: number;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          address: string | null;
          card_message: string | null;
          created_at: string;
          customer_name: string;
          delivery_fee_cop: number;
          delivery_method: Database["public"]["Enums"]["delivery_method"];
          delivery_zone_id: string | null;
          desired_date: string | null;
          id: string;
          order_number: string;
          payment_status: Database["public"]["Enums"]["payment_status"];
          phone: string;
          status: Database["public"]["Enums"]["order_status"];
          total_cop: number;
          updated_at: string;
        };
        Insert: {
          address?: string | null;
          card_message?: string | null;
          created_at?: string;
          customer_name: string;
          delivery_fee_cop?: number;
          delivery_method: Database["public"]["Enums"]["delivery_method"];
          delivery_zone_id?: string | null;
          desired_date?: string | null;
          id?: string;
          order_number?: string;
          payment_status?: Database["public"]["Enums"]["payment_status"];
          phone: string;
          status?: Database["public"]["Enums"]["order_status"];
          total_cop: number;
          updated_at?: string;
        };
        Update: {
          address?: string | null;
          card_message?: string | null;
          created_at?: string;
          customer_name?: string;
          delivery_fee_cop?: number;
          delivery_method?: Database["public"]["Enums"]["delivery_method"];
          delivery_zone_id?: string | null;
          desired_date?: string | null;
          id?: string;
          order_number?: string;
          payment_status?: Database["public"]["Enums"]["payment_status"];
          phone?: string;
          status?: Database["public"]["Enums"]["order_status"];
          total_cop?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "orders_delivery_zone_id_fkey";
            columns: ["delivery_zone_id"];
            isOneToOne: false;
            referencedRelation: "delivery_zones";
            referencedColumns: ["id"];
          },
        ];
      };
      product_images: {
        Row: {
          alt: string | null;
          id: string;
          position: number;
          product_id: string;
          storage_path: string;
        };
        Insert: {
          alt?: string | null;
          id?: string;
          position?: number;
          product_id: string;
          storage_path: string;
        };
        Update: {
          alt?: string | null;
          id?: string;
          position?: number;
          product_id?: string;
          storage_path?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_occasions: {
        Row: {
          occasion_id: string;
          product_id: string;
        };
        Insert: {
          occasion_id: string;
          product_id: string;
        };
        Update: {
          occasion_id?: string;
          product_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_occasions_occasion_id_fkey";
            columns: ["occasion_id"];
            isOneToOne: false;
            referencedRelation: "occasions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_occasions_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_types: {
        Row: {
          id: string;
          name: string;
          position: number;
          slug: string;
        };
        Insert: {
          id?: string;
          name: string;
          position?: number;
          slug: string;
        };
        Update: {
          id?: string;
          name?: string;
          position?: number;
          slug?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          created_at: string;
          description: string | null;
          featured: boolean;
          id: string;
          is_example: boolean;
          name: string;
          price_cop: number;
          slug: string;
          status: Database["public"]["Enums"]["product_status"];
          type_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          featured?: boolean;
          id?: string;
          is_example?: boolean;
          name: string;
          price_cop: number;
          slug: string;
          status?: Database["public"]["Enums"]["product_status"];
          type_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          featured?: boolean;
          id?: string;
          is_example?: boolean;
          name?: string;
          price_cop?: number;
          slug?: string;
          status?: Database["public"]["Enums"]["product_status"];
          type_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "products_type_id_fkey";
            columns: ["type_id"];
            isOneToOne: false;
            referencedRelation: "product_types";
            referencedColumns: ["id"];
          },
        ];
      };
      quotes: {
        Row: {
          budget_cop: number | null;
          company: string | null;
          created_at: string;
          email: string | null;
          event_date: string | null;
          event_type: string | null;
          guests: number | null;
          id: string;
          line: Database["public"]["Enums"]["quote_line"];
          message: string;
          name: string;
          phone: string;
          quantity: number | null;
          status: Database["public"]["Enums"]["quote_status"];
        };
        Insert: {
          budget_cop?: number | null;
          company?: string | null;
          created_at?: string;
          email?: string | null;
          event_date?: string | null;
          event_type?: string | null;
          guests?: number | null;
          id?: string;
          line: Database["public"]["Enums"]["quote_line"];
          message: string;
          name: string;
          phone: string;
          quantity?: number | null;
          status?: Database["public"]["Enums"]["quote_status"];
        };
        Update: {
          budget_cop?: number | null;
          company?: string | null;
          created_at?: string;
          email?: string | null;
          event_date?: string | null;
          event_type?: string | null;
          guests?: number | null;
          id?: string;
          line?: Database["public"]["Enums"]["quote_line"];
          message?: string;
          name?: string;
          phone?: string;
          quantity?: number | null;
          status?: Database["public"]["Enums"]["quote_status"];
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      delivery_method: "pickup" | "delivery";
      order_status:
        "received" | "preparing" | "ready" | "delivered" | "cancelled";
      payment_status: "pending" | "paid" | "cod";
      product_status: "active" | "sold_out" | "hidden";
      quote_line: "events" | "corporate";
      quote_status: "new" | "contacted" | "closed";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      delivery_method: ["pickup", "delivery"],
      order_status: [
        "received",
        "preparing",
        "ready",
        "delivered",
        "cancelled",
      ],
      payment_status: ["pending", "paid", "cod"],
      product_status: ["active", "sold_out", "hidden"],
      quote_line: ["events", "corporate"],
      quote_status: ["new", "contacted", "closed"],
    },
  },
} as const;
