export type Language = 'en' | 'fr' | 'rw';
export type Currency = 'RWF' | 'USD' | 'EUR';

export interface Variation {
  id: string;
  name: string; // e.g., "Size", "Color"
  value: string; // e.g., "XL", "Blue"
  stock: number;
  priceModifier?: number; // Optional price change for this variation
}

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
