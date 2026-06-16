export type Language = 'en' | 'fr' | 'rw';
export type Currency = 'RWF' | 'USD' | 'EUR';

export interface Variation {
  id: string;
  name: string; // e.g., "Size", "Color"
  value: string; // e.g., "XL", "Blue"
  stock: number;
  priceModifier?: number; // Optional price change for this variation
}

export type SalesType = 'online' | 'offline';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  oldPrice?: number;
  category: string;
  images: string[];
  stock: number;
  rating: number;
  isFeatured: boolean;
  specifications?: string[];
  variations?: Variation[];
  // ── Admin-only fields — NEVER returned by public/storefront API responses ──
  cost?: number; // what the admin paid for the item
  salesType?: SalesType; // 'online' (published to website) | 'offline' (sold outside the site, bookkeeping only)
  published?: boolean; // false for offline sales — never shown on the storefront
  salePrice?: number; // offline sale only: the actual price the item sold for
  saleDate?: string; // offline sale only: ISO date the sale happened
  offlineDeliveryFee?: number; // offline sale only: manually entered delivery fee (default 0)
}

export interface CartItem extends Product {
  quantity: number;
  selectedVariation?: Variation; // Single for compatibility
  selectedVariations?: Variation[]; // Support multiple
}

export type PaymentStatus = 'Pending' | 'Paid' | 'Waiting Confirmation' | 'Pending - Cash on Delivery' | 'Waiting for Bank Transfer';
export type PaymentMethod = 'momo' | 'card' | 'cod' | 'bank_transfer' | 'whatsapp';

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  items: CartItem[];
  total: number;
  deliveryFee?: number; // location-based fee computed at checkout, persisted on the order (missing on old orders = treat as 0)
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentMessage?: string;
  transactionId?: string;
  payerPhone?: string;
  receiverPhone?: string;
  paymentDate: string;
  createdAt: string;
}

export interface Translation {
  [key: string]: {
    en: string;
    fr: string;
    rw: string;
  };
}

export interface HeroSlide {
  image: string;
  title: { en: string; fr: string; rw: string };
  subtitle: { en: string; fr: string; rw: string };
  cta: { en: string; fr: string; rw: string };
}

export interface TeamMember {
  name: string;
  role: { en: string; fr: string; rw: string };
  slogan: { en: string; fr: string; rw: string };
  phone: string;
  image: string;
  socials: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
  };
}

export interface Testimonial {
  id: string;
  name: string;
  location?: string;
  message: string;
  rating: number; // 1-5
  image?: string;
}

export interface SiteSettings {
  logoUrl?: string;
  heroSlides: HeroSlide[];
  teamMembers: TeamMember[];
  testimonials: Testimonial[];
}
