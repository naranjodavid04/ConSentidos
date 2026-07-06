// Tipos de la base de datos.
// NOTA: escritos a mano a partir de las migraciones mientras Supabase local
// se instala. Reemplazar con la salida de:
//   npx supabase gen types typescript --local > src/lib/supabase/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ProductStatus = "active" | "sold_out" | "hidden";
export type OrderStatus =
  "received" | "preparing" | "ready" | "delivered" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "cod";
export type DeliveryMethod = "pickup" | "delivery";
export type QuoteLine = "events" | "corporate";
export type QuoteStatus = "new" | "contacted" | "closed";

export interface Database {
  public: {
    Tables: {
      product_types: {
        Row: {
          id: string;
          name: string;
          slug: string;
          position: number;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          position?: number;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          position?: number;
        };
        Relationships: [];
      };
      occasions: {
        Row: {
          id: string;
          name: string;
          slug: string;
          emoji: string | null;
          position: number;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          emoji?: string | null;
          position?: number;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          emoji?: string | null;
          position?: number;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          price_cop: number;
          type_id: string;
          status: ProductStatus;
          featured: boolean;
          is_example: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          price_cop: number;
          type_id: string;
          status?: ProductStatus;
          featured?: boolean;
          is_example?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          price_cop?: number;
          type_id?: string;
          status?: ProductStatus;
          featured?: boolean;
          is_example?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      product_occasions: {
        Row: {
          product_id: string;
          occasion_id: string;
        };
        Insert: {
          product_id: string;
          occasion_id: string;
        };
        Update: {
          product_id?: string;
          occasion_id?: string;
        };
        Relationships: [];
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          storage_path: string;
          alt: string | null;
          position: number;
        };
        Insert: {
          id?: string;
          product_id: string;
          storage_path: string;
          alt?: string | null;
          position?: number;
        };
        Update: {
          id?: string;
          product_id?: string;
          storage_path?: string;
          alt?: string | null;
          position?: number;
        };
        Relationships: [];
      };
      delivery_zones: {
        Row: {
          id: string;
          municipality: string;
          fee_cop: number;
          active: boolean;
        };
        Insert: {
          id?: string;
          municipality: string;
          fee_cop: number;
          active?: boolean;
        };
        Update: {
          id?: string;
          municipality?: string;
          fee_cop?: number;
          active?: boolean;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_name: string;
          phone: string;
          delivery_method: DeliveryMethod;
          delivery_zone_id: string | null;
          address: string | null;
          card_message: string | null;
          desired_date: string | null;
          status: OrderStatus;
          payment_status: PaymentStatus;
          delivery_fee_cop: number;
          total_cop: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number?: string;
          customer_name: string;
          phone: string;
          delivery_method: DeliveryMethod;
          delivery_zone_id?: string | null;
          address?: string | null;
          card_message?: string | null;
          desired_date?: string | null;
          status?: OrderStatus;
          payment_status?: PaymentStatus;
          delivery_fee_cop?: number;
          total_cop: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          customer_name?: string;
          phone?: string;
          delivery_method?: DeliveryMethod;
          delivery_zone_id?: string | null;
          address?: string | null;
          card_message?: string | null;
          desired_date?: string | null;
          status?: OrderStatus;
          payment_status?: PaymentStatus;
          delivery_fee_cop?: number;
          total_cop?: number;
          created_at?: string;
          updated_at?: string;
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
        Relationships: [];
      };
      quotes: {
        Row: {
          id: string;
          line: QuoteLine;
          name: string;
          phone: string;
          email: string | null;
          event_type: string | null;
          event_date: string | null;
          guests: number | null;
          company: string | null;
          quantity: number | null;
          budget_cop: number | null;
          message: string;
          status: QuoteStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          line: QuoteLine;
          name: string;
          phone: string;
          email?: string | null;
          event_type?: string | null;
          event_date?: string | null;
          guests?: number | null;
          company?: string | null;
          quantity?: number | null;
          budget_cop?: number | null;
          message: string;
          status?: QuoteStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          line?: QuoteLine;
          name?: string;
          phone?: string;
          email?: string | null;
          event_type?: string | null;
          event_date?: string | null;
          guests?: number | null;
          company?: string | null;
          quantity?: number | null;
          budget_cop?: number | null;
          message?: string;
          status?: QuoteStatus;
          created_at?: string;
        };
        Relationships: [];
      };
      banners: {
        Row: {
          id: string;
          title: string;
          subtitle: string | null;
          image_path: string | null;
          link: string | null;
          starts_at: string;
          ends_at: string;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          subtitle?: string | null;
          image_path?: string | null;
          link?: string | null;
          starts_at: string;
          ends_at: string;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          subtitle?: string | null;
          image_path?: string | null;
          link?: string | null;
          starts_at?: string;
          ends_at?: string;
          active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      product_status: ProductStatus;
      order_status: OrderStatus;
      payment_status: PaymentStatus;
      delivery_method: DeliveryMethod;
      quote_line: QuoteLine;
      quote_status: QuoteStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}
