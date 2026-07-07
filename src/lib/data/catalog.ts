import { unstable_cache } from "next/cache";

import { createPublicClient } from "@/lib/supabase/public";

// ---------- Tipos de dominio para la UI ----------

export interface Occasion {
  id: string;
  name: string;
  slug: string;
  emoji: string | null;
  position: number;
}

export interface ProductType {
  id: string;
  name: string;
  slug: string;
  position: number;
}

export interface ProductImage {
  id: string;
  storage_path: string;
  alt: string | null;
  position: number;
}

export interface CatalogProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_cop: number;
  status: "active" | "sold_out" | "hidden";
  featured: boolean;
  type: ProductType | null;
  images: ProductImage[];
  occasions: Occasion[];
}

export type CatalogSort = "recent" | "price_asc" | "price_desc";

export interface CatalogFilters {
  occasion?: string;
  type?: string;
  sort?: CatalogSort;
}

const PRODUCT_SELECT = `
  id, name, slug, description, price_cop, status, featured,
  type:product_types (id, name, slug, position),
  images:product_images (id, storage_path, alt, position),
  occasions:product_occasions (occasion:occasions (id, name, slug, emoji, position))
`;

// La forma cruda que devuelve supabase-js para el select anterior.
interface RawProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_cop: number;
  status: "active" | "sold_out" | "hidden";
  featured: boolean;
  type: ProductType | null;
  images: ProductImage[];
  occasions: { occasion: Occasion | null }[];
}

function shapeProduct(raw: RawProduct): CatalogProduct {
  return {
    ...raw,
    images: [...raw.images].sort((a, b) => a.position - b.position),
    occasions: raw.occasions
      .map((po) => po.occasion)
      .filter((o): o is Occasion => o !== null)
      .sort((a, b) => a.position - b.position),
  };
}

// ---------- Consultas ----------

// Ocasiones que tienen al menos un producto visible (para no pintar
// filtros que lleven a resultados vacíos).
async function getOccasionsWithProductsImpl(): Promise<Occasion[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("occasions")
    .select(
      "id, name, slug, emoji, position, product_occasions!inner (product_id)",
    )
    .order("position");
  if (error) throw error;
  const rows = (data ?? []) as unknown as Occasion[];
  return rows.map((o) => ({
    id: o.id,
    name: o.name,
    slug: o.slug,
    emoji: o.emoji,
    position: o.position,
  }));
}

async function getProductTypesWithProductsImpl(): Promise<ProductType[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("product_types")
    .select("id, name, slug, position, products!inner (id)")
    .order("position");
  if (error) throw error;
  const rows = (data ?? []) as unknown as ProductType[];
  return rows.map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    position: t.position,
  }));
}

async function getProductsImpl(
  filters: CatalogFilters = {},
): Promise<CatalogProduct[]> {
  const supabase = createPublicClient();

  // Los joins de filtro deben ser !inner para que el eq() excluya filas.
  let select = PRODUCT_SELECT;
  if (filters.occasion) {
    select = select.replace(
      "occasions:product_occasions (occasion:occasions (",
      "occasions:product_occasions!inner (occasion:occasions!inner (",
    );
  }
  if (filters.type) {
    select = select.replace(
      "type:product_types (",
      "type:product_types!inner (",
    );
  }

  let query = supabase.from("products").select(select);

  if (filters.occasion) {
    query = query.eq("product_occasions.occasions.slug", filters.occasion);
  }
  if (filters.type) {
    query = query.eq("product_types.slug", filters.type);
  }

  switch (filters.sort) {
    case "price_asc":
      query = query.order("price_cop", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price_cop", { ascending: false });
      break;
    default:
      query = query
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data as unknown as RawProduct[]).map(shapeProduct);
}

async function getFeaturedProductsImpl(limit = 8): Promise<CatalogProduct[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("featured", true)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data as unknown as RawProduct[]).map(shapeProduct);
}

async function getProductBySlugImpl(
  slug: string,
): Promise<CatalogProduct | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? shapeProduct(data as unknown as RawProduct) : null;
}

// Productos de la misma ocasión/tipo para "también te puede gustar".
export async function getRelatedProducts(
  product: CatalogProduct,
  limit = 4,
): Promise<CatalogProduct[]> {
  const occasionSlug = product.occasions[0]?.slug;
  const candidates = await getProducts(
    occasionSlug ? { occasion: occasionSlug } : { type: product.type?.slug },
  );
  return candidates.filter((p) => p.id !== product.id).slice(0, limit);
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image_path: string | null;
  link: string | null;
}

// RLS ya limita a banners activos y vigentes por fecha.
async function getCurrentBannerImpl(): Promise<Banner | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("banners")
    .select("id, title, subtitle, image_path, link")
    .order("starts_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export interface DeliveryZone {
  id: string;
  municipality: string;
  fee_cop: number;
}

async function getActiveZonesImpl(): Promise<DeliveryZone[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("delivery_zones")
    .select("id, municipality, fee_cop")
    .order("fee_cop")
    .order("municipality");
  if (error) throw error;
  return data;
}

// ---------- Cache de servidor ----------
// Los datos públicos cambian solo desde el panel: se cachean 5 minutos y
// las server actions del admin invalidan el tag "public-data" al guardar.
// Los argumentos hacen parte de la llave de cache automáticamente.

const CACHE_OPTS = { revalidate: 300, tags: ["public-data"] };

export const getOccasionsWithProducts = unstable_cache(
  getOccasionsWithProductsImpl,
  ["occasions-with-products"],
  CACHE_OPTS,
);
export const getProductTypesWithProducts = unstable_cache(
  getProductTypesWithProductsImpl,
  ["types-with-products"],
  CACHE_OPTS,
);
export const getProducts = unstable_cache(
  getProductsImpl,
  ["products"],
  CACHE_OPTS,
);
export const getFeaturedProducts = unstable_cache(
  getFeaturedProductsImpl,
  ["featured-products"],
  CACHE_OPTS,
);
export const getProductBySlug = unstable_cache(
  getProductBySlugImpl,
  ["product-by-slug"],
  CACHE_OPTS,
);
export const getCurrentBanner = unstable_cache(
  getCurrentBannerImpl,
  ["current-banner"],
  CACHE_OPTS,
);
export const getActiveZones = unstable_cache(
  getActiveZonesImpl,
  ["active-zones"],
  CACHE_OPTS,
);
