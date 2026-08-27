export type ItemType = "product" | "digital" | "service" | "booking" | "quote";

export type FeatureId =
  | "busqueda"
  | "categorias"
  | "filtros"
  | "favoritos"
  | "variantes"
  | "carrito"
  | "reservas"
  | "cotizaciones"
  | "pagos"
  | "opiniones";

export interface Variant {
  name: string;
  options: string[];
}

export interface CatalogItem {
  id: string;
  name: string;
  description: string;
  price: number | null; // null = requiere cotización
  type: ItemType;
  category: string;
  rating: number;
  reviews: number;
  tags: string[];
  hue: number;
  variants?: Variant[];
  duration?: string;
  seller?: string;
  featured?: boolean;
}

export interface CustomItemInput {
  name: string;
  price: number | null;
  category: string;
  type: ItemType;
}

export interface AppConfig {
  archetypeId: string;
  businessName: string;
  audience: string;
  categories: string[];
  features: FeatureId[];
  itemIds: string[];
  customItems: CustomItemInput[];
  createdAt: number;
}

export interface CartLine {
  item: CatalogItem;
  qty: number;
  variant?: string;
}

export const TYPE_LABEL: Record<ItemType, string> = {
  product: "Producto",
  digital: "Digital",
  service: "Servicio",
  booking: "Con agenda",
  quote: "A cotizar",
};

export const FEATURE_LABEL: Record<FeatureId, string> = {
  busqueda: "Búsqueda",
  categorias: "Categorías",
  filtros: "Filtros y orden",
  favoritos: "Lista de favoritos",
  variantes: "Variantes",
  carrito: "Carrito de compra",
  reservas: "Reservas y agenda",
  cotizaciones: "Solicitudes de cotización",
  pagos: "Pagos simulados",
  opiniones: "Opiniones y ratings",
};

export function fmtPrice(n: number | null): string {
  if (n === null) return "A cotizar";
  return "$" + n.toLocaleString("es-MX", { maximumFractionDigits: 0 });
}

export function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function orderCode(prefix: string): string {
  const n = Math.floor(1000 + Math.random() * 9000);
  const l = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return `${prefix}-${n}${l}`;
}
