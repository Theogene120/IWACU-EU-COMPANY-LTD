import { Product, Translation, TeamMember, LocalizedText } from './types';

// Wraps a plain string into a {en,fr,rw} object (same value in all three) — used
// only for the built-in demo/seed catalog below, so its literals can stay simple
// strings instead of being rewritten as full translation objects by hand.
function asLocalized(value: string): LocalizedText {
  return { en: value, fr: value, rw: value };
}

export const BUSINESS_NAME = "IWACU EU COMPANY LTD";
export const BUSINESS_PHONE = "+250796606178";
export const BUSINESS_EMAIL = "iwacueucompanyltd@gmail.com";
export const BUSINESS_ADDRESS = "Kigali, Rwanda";

export const CATEGORIES = [
  "Fashion",
  "Shoes",
  "Electronics",
  "Home Items",
  "General Merchandise"
];

type RawDemoProduct = Omit<Product, 'title' | 'description'> & { title: string; description: string };

const RAW_DEMO_PRODUCTS: RawDemoProduct[] = [
  // FASHION (8 PRODUCTS)
  {
    id: "f1",
    title: "Floral Summer Midi Dress",
    description: "Elegant floral print midi dress crafted from breathable linen blend. Features a flattering V-neckline and adjustable waist tie. Perfect for garden parties and brunch.",
    price: 32000,
    oldPrice: 45000,
    category: "Fashion",
    images: [
      "https://plus.unsplash.com/premium_photo-1673481601147-ee95199d3896?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3VtbWVyJTIwZHJlc3N8ZW58MHx8MHx8fDA%3D",
      "https://images.unsplash.com/photo-1604506272685-a999a4d122e7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHN1bW1lciUyMGRyZXNzfGVufDB8fDB8fHww",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 45,
    rating: 4.8,
    isFeatured: true,
    specifications: ["Linen Blend", "Midi Length", "Hand Wash Recommended"],
    variations: [
      { id: "f1-s", name: "Size", value: "S", stock: 15 },
      { id: "f1-m", name: "Size", value: "M", stock: 20 },
      { id: "f1-l", name: "Size", value: "L", stock: 10 },
      { id: "f1-blue", name: "Color", value: "Sky Blue", stock: 25 },
      { id: "f1-pink", name: "Color", value: "Petal Pink", stock: 20 }
    ]
  },
  {
    id: "f2",
    title: "Men's Slim-Fit Tuxedo Suit",
    description: "Premium wool-blend navy tuxedo suit. Includes a single-button jacket with satin lapels and matching tailored trousers. Ideal for weddings and formal events.",
    price: 185000,
    oldPrice: 210000,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1592878897400-43fb1f1cc324?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1622497170185-5d668f816a56?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWVuJTIwc3VpdHxlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1623880840102-7df0a9f3545b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG1lbiUyMHN1aXR8ZW58MHx8MHx8fDA%3D"
    ],
    stock: 12,
    rating: 4.9,
    isFeatured: true,
    specifications: ["80% Wool, 20% Polyester", "Slim Fit", "Dry Clean Only"],
    variations: [
      { id: "f2-48", name: "Size", value: "48", stock: 3 },
      { id: "f2-50", name: "Size", value: "50", stock: 4 },
      { id: "f2-52", name: "Size", value: "52", stock: 5 }
    ]
  },
  {
    id: "f3",
    title: "Oversized Streetwear Hoodie",
    description: "Heavyweight 400GSM cotton fleece hoodie with a relaxed aesthetic. Features dropped shoulders, a spacious kangaroo pocket, and ribbed cuffs. Minimalist streetwear essential.",
    price: 28000,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800",
      "https://plus.unsplash.com/premium_photo-1673827311290-d435f481152e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8T3ZlcnNpemVkJTIwU3RyZWV0d2VhciUyMEhvb2RpZXxlbnwwfHwwfHx8MA%3D%3D",
      "https://media.istockphoto.com/id/2149765119/photo/realistic-hoodie-front-and-back-view.webp?a=1&b=1&s=612x612&w=0&k=20&c=GkR0z-k_hMh84xJUpaYL5c-iuRkwUo4ggrA6SE0h98M=",
      "https://images.unsplash.com/photo-1721111260570-456f3306f8d4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8T3ZlcnNpemVkJTIwU3RyZWV0d2VhciUyMEhvb2RpZXxlbnwwfHwwfHx8MA%3D%3D"
    ],
    stock: 60,
    rating: 4.6,
    isFeatured: false,
    specifications: ["100% Organic Cotton", "Oversized Fit", "Machine Wash Cold"],
    variations: [
      { id: "f3-m", name: "Size", value: "M", stock: 20 },
      { id: "f3-l", name: "Size", value: "L", stock: 20 },
      { id: "f3-xl", name: "Size", value: "XL", stock: 20 },
      { id: "f3-black", name: "Color", value: "Onyx Black", stock: 30 },
      { id: "f3-grey", name: "Color", value: "Heather Grey", stock: 30 }
    ]
  },
  {
    id: "f4",
    title: "Vintage Denim Trucker Jacket",
    description: "Classic 90s inspired denim jacket with a rugged, lived-in feel. Durable brass buttons and reinforced stitching. A timeless layer for any season.",
    price: 45000,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1584844308532-b318efe24f74?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8VmludGFnZSUyMERlbmltJTIwVHJ1Y2tlciUyMEphY2tldHxlbnwwfHwwfHx8MA%3D%3D",
      "https://media.istockphoto.com/id/2267865558/photo/collar-detail-of-a-blue-denim-jacket-from-90s-trucker-jacket-front-view.webp?a=1&b=1&s=612x612&w=0&k=20&c=U-dVGQ-FJgw6UHcLhdnXyN0sRrLlWqdE0FQOjkrDQrA=",
      "https://images.unsplash.com/photo-1665615837850-99bfaf83bab8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8VmludGFnZSUyMERlbmltJTIwVHJ1Y2tlciUyMEphY2tldHxlbnwwfHwwfHx8MA%3D%3D",
      "https://plus.unsplash.com/premium_photo-1707816508645-d229ddd3aa65?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8VmludGFnZSUyMERlbmltJTIwVHJ1Y2tlciUyMEphY2tldHxlbnwwfHwwfHx8MA%3D%3D"
    ],
    stock: 25,
    rating: 4.7,
    isFeatured: false,
    specifications: ["14oz Rigid Denim", "Classic Fit", "Button Closure"],
    variations: [
      { id: "f4-s", name: "Size", value: "S", stock: 5 },
      { id: "f4-m", name: "Size", value: "M", stock: 10 },
      { id: "f4-l", name: "Size", value: "L", stock: 10 }
    ]
  },
  {
    id: "f5",
    title: "Classic White Linen Shirt",
    description: "Crisp white linen shirt designed for ultimate comfort in warm climates. Breathable, sweat-wicking properties and a relaxed button-down collar.",
    price: 35000,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d2hpdGUlMjBzaGlydHxlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1671438118097-479e63198629?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8d2hpdGUlMjBzaGlydHxlbnwwfHwwfHx8MA%3D%3D",
      "https://plus.unsplash.com/premium_photo-1693242804347-38b4382b3c4d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHdoaXRlJTIwc2hpcnR8ZW58MHx8MHx8fDA%3D"
    ],
    stock: 40,
    rating: 4.5,
    isFeatured: false,
    specifications: ["100% Pure Linen", "Standard Fit", "Curved Hem"],
    variations: [
      { id: "f5-m", name: "Size", value: "M", stock: 15 },
      { id: "f5-l", name: "Size", value: "L", stock: 15 },
      { id: "f5-xl", name: "Size", value: "XL", stock: 10 }
    ]
  },
  {
    id: "f6",
    title: "Women's High-Waist Tailored Trousers",
    description: "Chic high-waisted trousers with precise pleats and a wide-leg silhouette. Versatile for office wear or evening outings. Includes belt loops and hidden side pockets.",
    price: 42000,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1673180608353-63292b332e84?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8V29tZW4ncyUyMEhpZ2gtV2Fpc3QlMjBUYWlsb3JlZCUyMFRyb3VzZXJzfGVufDB8fDB8fHww",
      "https://images.unsplash.com/photo-1673180597733-dafaa1e8b08b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fFdvbWVuJ3MlMjBIaWdoLVdhaXN0JTIwVGFpbG9yZWQlMjBUcm91c2Vyc3xlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1751399566167-d0c646af5905?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fFdvbWVuJ3MlMjBIaWdoLVdhaXN0JTIwVGFpbG9yZWQlMjBUcm91c2Vyc3xlbnwwfHwwfHx8MA%3D%3D"
    ],
    stock: 30,
    rating: 4.6,
    isFeatured: false,
    specifications: ["Viscose Blend", "Wide Leg", "High Rise"],
    variations: [
      { id: "f6-28", name: "Size", value: "28", stock: 10 },
      { id: "f6-30", name: "Size", value: "30", stock: 10 },
      { id: "f6-32", name: "Size", value: "32", stock: 10 }
    ]
  },
  {
    id: "f7",
    title: "Heritage Wool Trench Coat",
    description: "Full-length heritage trench coat made from a premium wool-cashmere blend. Features a double-breasted closure, waist belt, and signature epaulettes. Timeless Parisian style.",
    price: 220000,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800",
      "https://media.istockphoto.com/id/144797271/photo/three-woolen-coats-cut-out.webp?a=1&b=1&s=612x612&w=0&k=20&c=BafIH0GwTKP8mfvXmzpi1E_dDLxGq0uNbcxDQad81CI=",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 8,
    rating: 5.0,
    isFeatured: true,
    specifications: ["80% Wool, 20% Cashmere", "Fully Lined", "Tailored Cut"],
    variations: [
      { id: "f7-s", name: "Size", value: "S", stock: 2 },
      { id: "f7-m", name: "Size", value: "M", stock: 4 },
      { id: "f7-l", name: "Size", value: "L", stock: 2 }
    ]
  },
  {
    id: "f8",
    title: "Urban Minimalist Graphic Tee",
    description: "Premium heavyweight tee with a subtle architectural graphic on the back. Boxy fit with a thick ribbed collar. Crafted from pre-shrunk cotton for lasting shape.",
    price: 18000,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 100,
    rating: 4.4,
    isFeatured: false,
    specifications: ["100% Dense Cotton", "Boxy Fit", "Screen Printed"],
    variations: [
      { id: "f8-m", name: "Size", value: "M", stock: 40 },
      { id: "f8-l", name: "Size", value: "L", stock: 40 },
      { id: "f8-xl", name: "Size", value: "XL", stock: 20 }
    ]
  },
  {
    id: "f9",
    title: "Silk Button-Down Blouse",
    description: "Luxurious 100% mulberry silk blouse with a smooth satin finish. Features a classic collar and mother-of-pearl buttons. A sophisticated piece for effortless day-to-night styling.",
    price: 55000,
    oldPrice: 68000,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1675379086716-95bf8a4d22f2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8U2lsayUyMEJ1dHRvbi1Eb3duJTIwQmxvdXNlfGVufDB8fDB8fHww",
      "https://images.unsplash.com/photo-1704775983658-2773a9c0cce2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8U2lsayUyMEJ1dHRvbi1Eb3duJTIwQmxvdXNlfGVufDB8fDB8fHww",
      "https://images.unsplash.com/photo-1704775991545-fc0507822fea?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ],
    stock: 25,
    rating: 4.8,
    isFeatured: false,
    specifications: ["100% Mulberry Silk", "Regular Fit", "Dry Clean Only"],
    variations: [
      { id: "f9-w", name: "Color", value: "Champagne", stock: 10 },
      { id: "f9-b", name: "Color", value: "Emerald", stock: 15 }
    ]
  },
  {
    id: "f10",
    title: "High-Waisted Mom Jeans",
    description: "Classic 90s-inspired mom jeans with a flattering high rise and tapered leg. Made from 100% rigid organic cotton for an authentic vintage feel that breaks in over time.",
    price: 38000,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1475178626620-a4d074967452?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 50,
    rating: 4.5,
    isFeatured: false,
    specifications: ["100% Organic Cotton", "High Rise", "Tapered Leg"],
    variations: [
      { id: "f10-26", name: "Size", value: "26", stock: 10 },
      { id: "f10-28", name: "Size", value: "28", stock: 20 },
      { id: "f10-30", name: "Size", value: "30", stock: 20 }
    ]
  },
  {
    id: "f11",
    title: "Cashmere Turtleneck Sweater",
    description: "Ultra-soft grade-A Mongolian cashmere turtleneck. Lightweight yet incredibly warm, featuring a slightly relaxed fit and ribbed trims. A luxury essential for cold seasons.",
    price: 125000,
    oldPrice: 150000,
    category: "Fashion",
    images: [
    "https://plus.unsplash.com/premium_photo-1698952163279-da370cb759bc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dHVydGxlbmVja3xlbnwwfHwwfHx8MA%3D%3D",
        "https://images.unsplash.com/photo-1608739872119-f78feab7f976?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHVydGxlbmVja3xlbnwwfHwwfHx8MA%3D%3D",
        "https://images.unsplash.com/photo-1608739871816-346c9db7e122?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dHVydGxlbmVja3xlbnwwfHwwfHx8MA%3D%3D",
        "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800"
      ],
    stock: 15,
    rating: 4.9,
    isFeatured: true,
    specifications: ["100% Cashmere", "Relaxed Fit", "Hand Wash Only"],
    variations: [
      { id: "f11-g", name: "Color", value: "Oatmeal", stock: 7 },
      { id: "f11-n", name: "Color", value: "Navy", stock: 8 }
    ]
  },
  {
    id: "f12",
    title: "Bohemian Maxi Skirt",
    description: "Flowing tiered maxi skirt with an intricate paisley print. Crafted from soft rayon for a graceful drape. Features an elasticated drawstring waist for a comfortable fit.",
    price: 26000,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1732167689626-380220c2cfaa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Qm9oZW1pYW4lMjBNYXhpJTIwU2tpcnR8ZW58MHx8MHx8fDA%3D",
      "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 40,
    rating: 4.4,
    isFeatured: false,
    specifications: ["100% Rayon", "Maxi Length", "Elastic Waist"],
    variations: [
      { id: "f12-s", name: "Size", value: "S/M", stock: 20 },
      { id: "f12-l", name: "Size", value: "L/XL", stock: 20 }
    ]
  },
  {
    id: "f13",
    title: "Tailored Slim Blazer",
    description: "Sharp tailored blazer with a modern slim fit. Features notched lapels, two-button closure, and subtle padding at the shoulders for a structured look. Fully lined.",
    price: 85000,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1507679799987-c73774071b9b?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 20,
    rating: 4.7,
    isFeatured: false,
    specifications: ["Polyester/Viscose Blend", "Slim Fit", "Two-Button Closure"],
    variations: [
      { id: "f13-b", name: "Color", value: "Charcoal Black", stock: 10 },
      { id: "f13-g", name: "Color", value: "Light Grey", stock: 10 }
    ]
  },
  {
    id: "f14",
    title: "Polka Dot Wrap Dress",
    description: "Playful polka dot print wrap dress in a breezy chiffon fabric. Features ruffled sleeves and an adjustable waist tie that creates a beautiful feminine silhouette.",
    price: 34000,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 35,
    rating: 4.6,
    isFeatured: false,
    specifications: ["Chiffon", "Wrap Style", "Above Knee Length"],
    variations: [
      { id: "f14-r", name: "Color", value: "Red/White", stock: 15 },
      { id: "f14-b", name: "Color", value: "Black/White", stock: 20 }
    ]
  },
  {
    id: "f15",
    title: "Leather Biker Jacket",
    description: "Rugged yet refined biker jacket made from soft lambskin leather. Features silver-tone hardware, multiple zip pockets, and a classic asymmetric front zip closure.",
    price: 165000,
    oldPrice: 195000,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 10,
    rating: 4.8,
    isFeatured: true,
    specifications: ["100% Lambskin Leather", "Asymmetric Zip", "Polyester Lining"],
    variations: [
      { id: "f15-m", name: "Size", value: "M", stock: 5 },
      { id: "f15-l", name: "Size", value: "L", stock: 5 }
    ]
  },
  {
    id: "f16",
    title: "3-Pack Baby Organic Bodysuits",
    description: "Essential organic cotton bodysuits for babies. Soft, breathable, and features easy-snap closures for quick changing. Gentle on delicate baby skin.",
    price: 18000,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1738023924766-fdf74c30d5c0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8My1QYWNrJTIwQmFieSUyME9yZ2FuaWMlMjBCb2R5c3VpdHN8ZW58MHx8MHx8fDA%3D",
      "https://plus.unsplash.com/premium_photo-1677260349894-649dbd8f3d3c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8My1QYWNrJTIwQmFieSUyME9yZ2FuaWMlMjBCb2R5c3VpdHN8ZW58MHx8MHx8fDA%3D",
      "https://images.unsplash.com/photo-1744424846143-59de0fcd871a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fDMtUGFjayUyMEJhYnklMjBPcmdhbmljJTIwQm9keXN1aXRzfGVufDB8fDB8fHww"
    ],
    stock: 50,
    rating: 4.8,
    isFeatured: true,
    specifications: ["100% Organic Cotton", "Nickel-Free Snaps", "Machine Washable"],
    variations: [
      { id: "f16-nb", name: "Size", value: "Newborn", stock: 20 },
      { id: "f16-3m", name: "Size", value: "3 Months", stock: 30 }
    ]
  },
  {
    id: "f17",
    title: "Toddler Puffer Winter Jacket",
    description: "Warm and cozy puffer jacket for little ones. Insulated with lightweight down alternative and features a fleece-lined hood to keep out the chill.",
    price: 35000,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1640072494352-66220f9ac3b1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8VG9kZGxlciUyMFB1ZmZlciUyMFdpbnRlciUyMEphY2tldHxlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1587432816473-9e3409689f12?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8VG9kZGxlciUyMFB1ZmZlciUyMFdpbnRlciUyMEphY2tldHxlbnwwfHwwfHx8MA%3D%3D",
      "https://plus.unsplash.com/premium_photo-1760179325525-ec3edff26677?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fFRvZGRsZXIlMjBQdWZmZXIlMjBXaW50ZXIlMjBKYWNrZXR8ZW58MHx8MHx8fDA%3D"
    ],
    stock: 25,
    rating: 4.7,
    isFeatured: false,
    specifications: ["Polyester Fill", "Fleece Lined", "Water Resistant"],
    variations: [
      { id: "f17-r", name: "Color", value: "Bright Red", stock: 12 },
      { id: "f17-y", name: "Color", value: "Sunshine Yellow", stock: 13 }
    ]
  },
  {
    id: "f18",
    title: "Classic Men's Baseball Cap",
    description: "Timeless 6-panel baseball cap with an adjustable strap. Crafted from durable cotton twill with an embroidered logo. Perfect for casual weekend wear.",
    price: 12000,
    category: "Fashion",
    images: [
       "https://plus.unsplash.com/premium_photo-1674586422099-f52a936fd7f5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Q2xhc3NpYyUyME1lbidzJTIwQmFzZWJhbGwlMjBDYXB8ZW58MHx8MHx8fDA%3D",
        "https://media.istockphoto.com/id/1044149926/photo/baseball-cap-red-templates-front-views-isolated-on-white-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=2XfcLQxnOkTruNKGU7uPvhVKNuo24141y2O3N4Y07JU=",
        "https://images.unsplash.com/photo-1628925688859-d378985f5206?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fENsYXNzaWMlMjBNZW4ncyUyMEJhc2ViYWxsJTIwQ2FwfGVufDB8fDB8fHww"
      ],
    stock: 100,
    rating: 4.6,
    isFeatured: false,
    specifications: ["100% Cotton Twill", "Adjustable Strap", "Embroidered"],
    variations: [
      { id: "f18-bk", name: "Color", value: "Black", stock: 50 },
      { id: "f18-nv", name: "Color", value: "Navy", stock: 50 }
    ]
  },
  {
    id: "f19",
    title: "Women's Canvas Sun Hat",
    description: "Elegant wide-brimmed sun hat made from natural straw and canvas. Provides excellent UV protection while staying breathable and stylish at the beach.",
    price: 15000,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1692283394836-37822c89576e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8V29tZW4ncyUyMENhbnZhcyUyMFN1biUyMEhhdHxlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1700442548171-5f36c881cc49?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fFdvbWVuJ3MlMjBDYW52YXMlMjBTdW4lMjBIYXR8ZW58MHx8MHx8fDA%3D0",
      "https://media.istockphoto.com/id/1512111987/photo/beautiful-woman.webp?a=1&b=1&s=612x612&w=0&k=20&c=Ra8Dg1PfkoWDKce8ucd50gWrAfmDz4OMn3QXUZ76vsM="
    ],
    stock: 30,
    rating: 4.8,
    isFeatured: false,
    specifications: ["Natural Straw", "Wide Brim", "UPF 50+"],
  },
  {
    id: "f20",
    title: "Baby Winter Beanie & Mittens",
    description: "Sub-zero protection for your little one. Soft knit hat and matching mittens set lined with plush fleece for maximum warmth.",
    price: 10000,
    category: "Fashion",
    images: [
      "https://media.istockphoto.com/id/1298088201/photo/little-girl-in-the-cold-looks-at-the-snow-mittens-and-smiles-winter-walk-the-baby-in-the-open.webp?a=1&b=1&s=612x612&w=0&k=20&c=SUTE3fzI3a1qpG9pwq-vVdIINWnhCJbX8zPFInlPwfs=",
        "https://media.istockphoto.com/id/2245441426/photo/cute-funny-infant-baby-3-5-months-old-lying-in-bed-wearing-knitted-hat-close-up-winter.webp?a=1&b=1&s=612x612&w=0&k=20&c=iMG9wClHxGGgQQ1Z0qfHbPtPNkl__iviTTv_ollGWmg="
      ],
    stock: 40,
    rating: 4.9,
    isFeatured: true,
    specifications: ["Acrylic Knit", "Fleece Lining", "Stretchy Fit"],
  },

  {
    id: "f21",
    title: "Newborn Velvet Romper",
    description: "Ultra-soft luxury velvet romper for newborns and little babies. Features delicate lace detailing and a button-up front. Perfect for special occasions or cozy naps.",
    price: 25000,
    category: "Fashion",
    images: [
       "https://plus.unsplash.com/premium_photo-1675183690347-662b2f9f3cf7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8TmV3Ym9ybiUyMFZlbHZldCUyMFJvbXBlcnxlbnwwfHwwfHx8MA%3D%3D",
        "https://images.unsplash.com/photo-1670529401267-f27a1f9cdb21?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8TmV3Ym9ybiUyMFZlbHZldCUyMFJvbXBlcnxlbnwwfHwwfHx8MA%3D%3D",
        "https://media.istockphoto.com/id/1444106108/photo/portrait-of-cute-little-baby-boy-laying-in-the-baby-crib.webp?a=1&b=1&s=612x612&w=0&k=20&c=Mqwwb-lRlmTRNkcn_ejv5h5v9azyB7RB9FtFqvWgDRE="
      ],
    stock: 20,
    rating: 5.0,
    isFeatured: true,
    specifications: ["Micro-Velvet", "Nickel-Free Buttons", "Hypoallergenic"],
  },

  // SHOES (8 PRODUCTS)
  {
    id: "s1",
    title: "Pro-Performance Running Shoes",
    description: "Elite running footwear featuring responsive nitrogen-infused foam cushioning. Breathable engineered mesh upper and carbon fiber plate for maximum energy return.",
    price: 125000,
    oldPrice: 150000,
    category: "Shoes",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 20,
    rating: 4.8,
    isFeatured: true,
    specifications: ["Foam Midsole", "Carbon Plate", "6mm Drop"],
    variations: [
      { id: "s1-40", name: "Size", value: "40", stock: 5 },
      { id: "s1-42", name: "Size", value: "42", stock: 8 },
      { id: "s1-44", name: "Size", value: "44", stock: 7 }
    ]
  },
  {
    id: "s2",
    title: "Hand-Burnished Leather Loafers",
    description: "Classic penny loafers crafted from hand-selected calfskin leather. Features a cushioned cork footbed that molds to your feet over time. Goodyear welted for longevity.",
    price: 95000,
    category: "Shoes",
    images: [
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 15,
    rating: 4.9,
    isFeatured: true,
    specifications: ["Calfskin Leather", "Goodyear Welted", "Leather Sole"],
    variations: [
      { id: "s2-br", name: "Color", value: "Tobacco Brown", stock: 8 },
      { id: "s2-bl", name: "Color", value: "Midnight Black", stock: 7 }
    ]
  },
  {
    id: "s3",
    title: "All-Star Pro Basketball Sneakers",
    description: "High-performance basketball shoes with multi-directional traction patterns and lockdown fit. Internal shank for stability and Zoom air units for explosive jumps.",
    price: 135000,
    category: "Shoes",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 25,
    rating: 4.7,
    isFeatured: false,
    specifications: ["Synthetic Overlay", "Herringbone Traction", "Internal Shank"],
    variations: [
      { id: "s3-42", name: "Size", value: "42", stock: 10 },
      { id: "s3-44", name: "Size", value: "44", stock: 10 },
      { id: "s3-46", name: "Size", value: "46", stock: 5 }
    ]
  },
  {
    id: "s4",
    title: "Waterproof Suede Chelsea Boots",
    description: "Iconic Chelsea silhouette with a modern waterproof treatment. Elastic side panels for easy entry and a rugged Vibram outsole for grip on uneven terrain.",
    price: 110000,
    category: "Shoes",
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 18,
    rating: 4.6,
    isFeatured: false,
    specifications: ["Italian Suede", "Vibram Sole", "Water Resistant"],
    variations: [
      { id: "s4-40", name: "Size", value: "40", stock: 6 },
      { id: "s4-42", name: "Size", value: "42", stock: 6 },
      { id: "s4-44", name: "Size", value: "44", stock: 6 }
    ]
  },
  {
    id: "s5",
    title: "Luxury Satin Stiletto Pumps",
    description: "Exquisite satin-covered stilettos with a sleek pointed toe. Features a memory foam cushioned insole for surprising comfort. The ultimate statement piece for black-tie events.",
    price: 85000,
    category: "Shoes",
    images: [
      "https://images.unsplash.com/photo-1698265026614-a49b250850bf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8THV4dXJ5JTIwU2F0aW4lMjBTdGlsZXR0byUyMFB1bXBzfGVufDB8fDB8fHww",
      "https://plus.unsplash.com/premium_photo-1674068280536-ca18252cfa8c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8THV4dXJ5JTIwU2F0aW4lMjBTdGlsZXR0byUyMFB1bXBzfGVufDB8fDB8fHww",
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 10,
    rating: 4.8,
    isFeatured: true,
    specifications: ["Silk Satin", "100mm Heel", "Pointed Toe"],
    variations: [
      { id: "s5-37", name: "Size", value: "37", stock: 3 },
      { id: "s5-38", name: "Size", value: "38", stock: 4 },
      { id: "s5-39", name: "Size", value: "39", stock: 3 }
    ]
  },
  {
    id: "s6",
    title: "Eco-Friendly Canvas Slip-Ons",
    description: "Lightweight slip-on sneakers made from recycled organic canvas. Natural rubber outsole and hemp laces. Perfect for casual summer strolls and effortless style.",
    price: 38000,
    category: "Shoes",
    images: [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1611312449412-6cefac5c684f?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1626497746270-394c507c9735?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 50,
    rating: 4.5,
    isFeatured: false,
    specifications: ["Organic Canvas", "Recycled Rubber", "Vegan Friendly"],
    variations: [
      { id: "s6-nv", name: "Color", value: "Navy Blue", stock: 25 },
      { id: "s6-gr", name: "Color", value: "Forest Green", stock: 25 }
    ]
  },
  {
    id: "s7",
    title: "TerrainMaster Pro Hiking Boots",
    description: "Rugged mid-cut hiking boots designed for serious adventures. Gore-Tex lining for complete waterproofing and a protective toe cap. Deep lugged outsole for mud and rock grip.",
    price: 155000,
    category: "Shoes",
    images: [
      "https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 12,
    rating: 4.7,
    isFeatured: false,
    specifications: ["Gore-Tex Lining", "Suede Overlay", "Impact-Shield Toe"],
    variations: [
      { id: "s7-42", name: "Size", value: "42", stock: 4 },
      { id: "s7-44", name: "Size", value: "44", stock: 4 },
      { id: "s7-45", name: "Size", value: "45", stock: 4 }
    ]
  },
  {
    id: "s8",
    title: "Hand-Crafted Full-Grain Sandals",
    description: "Premium sandals with thick full-grain leather straps and a contoured anatomical footbed. Sole features a non-slip pattern. Built to last for multiple summers.",
    price: 45000,
    category: "Shoes",
    images: [
      "https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 30,
    rating: 4.4,
    isFeatured: false,
    specifications: ["Full-Grain Leather", "Contoured Footbed", "Rubber Grip"],
    variations: [
      { id: "s8-br", name: "Color", value: "Bark Brown", stock: 15 },
      { id: "s8-bl", name: "Color", value: "Coal Black", stock: 15 }
    ]
  },
  {
    id: "s9",
    title: "Classic Leather Brogues",
    description: "Exquisitely detailed wingtip brogues crafted from premium tan leather. Features traditional perforated detailing and a durable rubber sole for grip. The perfect balance of style and comfort.",
    price: 78000,
    category: "Shoes",
    images: [
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 20,
    rating: 4.7,
    isFeatured: false,
    specifications: ["Genuine Leather", "Wingtip Design", "Anti-Slip Sole"],
    variations: [
      { id: "s9-42", name: "Size", value: "42", stock: 10 },
      { id: "s9-44", name: "Size", value: "44", stock: 10 }
    ]
  },
  {
    id: "s10",
    title: "Platform Ankle Boots",
    description: "Trendy platform ankle boots with a chunky heel and side zip. Made from high-quality faux leather with a comfortable padded footbed. Elevate your urban look.",
    price: 52000,
    category: "Shoes",
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 25,
    rating: 4.6,
    isFeatured: false,
    specifications: ["Synthetic Leather", "Platform Sole", "8cm Heel"],
    variations: [
      { id: "s10-38", name: "Size", value: "38", stock: 12 },
      { id: "s10-40", name: "Size", value: "40", stock: 13 }
    ]
  },
  {
    id: "s11",
    title: "Lightweight Mesh Trainers",
    description: "Breathable and ultra-lightweight trainers designed for casual wear and light exercise. Features a flexible grooved sole that moves naturally with your foot.",
    price: 45000,
    category: "Shoes",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 60,
    rating: 4.5,
    isFeatured: false,
    specifications: ["Engineered Mesh", "Phylon Midsole", "Lace-up Closure"],
    variations: [
      { id: "s11-42", name: "Size", value: "42", stock: 30 },
      { id: "s11-44", name: "Size", value: "44", stock: 30 }
    ]
  },
  {
    id: "s12",
    title: "Strappy Block Heels",
    description: "Elegant strappy block heels featuring a slender ankle strap and stable block heel. Ideal for long hours at weddings or parties. Versatile nude shade.",
    price: 48000,
    category: "Shoes",
    images: [
      "https://plus.unsplash.com/premium_photo-1676234844384-82e1830af724?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8U3RyYXBweSUyMEJsb2NrJTIwSGVlbHN8ZW58MHx8MHx8fDA%3D",
      "https://images.unsplash.com/photo-1776266100221-d11f77db0e0a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8U3RyYXBweSUyMEJsb2NrJTIwSGVlbHN8ZW58MHx8MHx8fDA%3D"
    ],
    stock: 18,
    rating: 4.8,
    isFeatured: false,
    specifications: ["Suedette Material", "6cm Block Heel", "Adjustable Ankle Strap"],
    variations: [
      { id: "s12-37", name: "Size", value: "37", stock: 9 },
      { id: "s12-39", name: "Size", value: "39", stock: 9 }
    ]
  },
  {
    id: "s13",
    title: "Suede Desert Boots",
    description: "Casual and timeless mid-cut desert boots in soft genuine suede. Features a classic two-eyelet lace design and a shock-absorbing crepe-style sole.",
    price: 72000,
    category: "Shoes",
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 22,
    rating: 4.6,
    isFeatured: false,
    specifications: ["Genuine Suede", "Crepe Sole", "Mid-Cut Design"],
    variations: [
      { id: "s13-42", name: "Size", value: "42", stock: 11 },
      { id: "s13-44", name: "Size", value: "44", stock: 11 }
    ]
  },
  {
    id: "s14",
    title: "Pointed-Toe Ballet Flats",
    description: "Sophisticated ballet flats with a chic pointed toe and minimal bow detail. Perfect for professional office wear or dressing up a casual outfit.",
    price: 32000,
    category: "Shoes",
    images: [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1611312449412-6cefac5c684f?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 30,
    rating: 4.4,
    isFeatured: false,
    specifications: ["Synthetic Material", "Cushioned Insole", "Flat Sole"],
    variations: [
      { id: "s14-bk", name: "Color", value: "Classic Black", stock: 15 },
      { id: "s14-nd", name: "Color", value: "Soft Nude", stock: 15 }
    ]
  },
  {
    id: "s15",
    title: "All-Weather Rain Boots",
    description: "Durable and 100% waterproof rubber rain boots. Features a high-traction outsole and a soft fabric lining to keep feet warm and dry in heavy downpours.",
    price: 34000,
    category: "Shoes",
    images: [
      "https://images.unsplash.com/photo-1582845512747-e42001c95638?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 40,
    rating: 4.7,
    isFeatured: false,
    specifications: ["Vulcanized Rubber", "High-Grip Tread", "Waterproof"],
    variations: [
      { id: "s15-y", name: "Color", value: "Sunny Yellow", stock: 20 },
      { id: "s15-r", name: "Color", value: "Classic Red", stock: 20 }
    ]
  },
  {
    id: "s16",
    title: "Soft-Sole Baby Walkers",
    description: "Ultra-soft genuine leather shoes for babies starting to crawl or walk. Flexible soles mimic barefoot movement for healthy foot development. Non-slip grip.",
    price: 15000,
    category: "Shoes",
    images: [
      "https://media.istockphoto.com/id/1440750926/photo/image-of-shoes-white-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=U7oAktzBLHDeC1te2lPrLbruDq1GD56qlhWWVLILbV4=",
      "https://media.istockphoto.com/id/1370796013/photo/baby-shoes.webp?a=1&b=1&s=612x612&w=0&k=20&c=rwwnztvUwM0d2y66MnV5VHtAfBMYT-4EpawN5plHUB0="
    ],
    stock: 40,
    rating: 4.9,
    isFeatured: true,
    specifications: ["100% Soft Leather", "Anti-Slip Sole", "Breathable"],
    variations: [
      { id: "s16-6", name: "Size", value: "6-12 Months", stock: 20 },
      { id: "s16-12", name: "Size", value: "12-18 Months", stock: 20 }
    ]
  },
  {
    id: "s17",
    title: "Toddler Light-Up Sneakers",
    description: "Fun and vibrant sneakers for toddlers with motion-activated LED lights in the sole. Easy hook-and-loop straps for independent dressing. Durable and easy to clean.",
    price: 22000,
    category: "Shoes",
    images: [
      "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1512374382149-433a72b9a5a5?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 35,
    rating: 4.8,
    isFeatured: true,
    specifications: ["LED Lights", "Easy-Strap", "Synthetic Upper"],
    variations: [
      { id: "s17-b", name: "Color", value: "Blue Rocket", stock: 15 },
      { id: "s17-p", name: "Color", value: "Pink Sparkle", stock: 20 }
    ]
  },
  {
    id: "s18",
    title: "Newborn Crochet Booties",
    description: "Hand-knit soft cotton booties for little babies. Gentle on sensitive skin and keeps tiny feet warm and cozy. Elasticated ankle for a secure yet comfortable fit.",
    price: 8000,
    category: "Shoes",
    images: [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 50,
    rating: 4.9,
    isFeatured: true,
    specifications: ["Hand-Knit Cotton", "Newborn Size", "Hypoallergenic"],
  },

  // ELECTRONICS (8 PRODUCTS)
  {
    id: "e1",
    title: "X-Phone Pro 256GB Platinum",
    description: "Industry-leading smartphone with a 6.7-inch OLED ProMotion display and triple-lens cinema-grade camera system. Features satellite connectivity and 48-hour battery life.",
    price: 1350000,
    oldPrice: 1420000,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1592890678914-710185730612?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1556656793-062ff987b50d?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 15,
    rating: 4.9,
    isFeatured: true,
    specifications: ["A17 Bionic Chip", "256GB Storage", "5G Ready", "IP68 Waterproof"],
    variations: [
      { id: "e1-pl", name: "Color", value: "Platinum Silver", stock: 5 },
      { id: "e1-go", name: "Color", value: "Radiant Gold", stock: 5 },
      { id: "e1-bl", name: "Color", value: "Abyss Black", stock: 5 }
    ]
  },
  {
    id: "e9",
    title: "4K UHD Action Camera",
    description: "Rugged 4K action camera with advanced image stabilization and waterproof casing up to 30m. Features a wide-angle lens and touch screen for easy framing. Capture every adventure.",
    price: 145000,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1502933691298-84fc14542831?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1552120449-3e0e7a561140?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1550439062-609e154f2723?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 15,
    rating: 4.8,
    isFeatured: true,
    specifications: ["4K 60fps", "20MP Photos", "Waterproof 30m"],
  },
  {
    id: "e10",
    title: "Wireless Mechanical Keyboard",
    description: "Premium mechanical keyboard with customizable RGB lighting and tactile brown switches. Features high-speed wireless connectivity and a long-lasting rechargeable battery.",
    price: 110000,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 25,
    rating: 4.9,
    isFeatured: false,
    specifications: ["RGB Backlit", "Brown Switches", "Bluetooth/2.4G"],
  },
  {
    id: "e11",
    title: "10.5-inch Ultra Tablet",
    description: "Powerful 10.5-inch tablet with a stunning AMOLED display and octa-core processor. Perfect for productivity, creative work, and immersive entertainment on the go.",
    price: 385000,
    category: "Electronics",
    images: [
     "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8MTAuNS1pbmNoJTIwVWx0cmElMjBUYWJsZXR8ZW58MHx8MHx8fDA%3D",
        "https://images.unsplash.com/photo-1628866971124-5d506bf12915?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8MTAuNS1pbmNoJTIwVWx0cmElMjBUYWJsZXR8ZW58MHx8MHx8fDA%3D"
      ],
    stock: 12,
    rating: 4.7,
    isFeatured: false,
    specifications: ["AMOLED Display", "128GB Storage", "Stylus Support"],
  },
  {
    id: "e12",
    title: "Over-Ear Noise Canceling Headphones",
    description: "Premium over-ear headphones with superior active noise cancellation. Delivers high-fidelity audio with deep bass and clear highs. Cushioned ear cups for all-day comfort.",
    price: 245000,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1583394838336-acd977730f90?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 20,
    rating: 4.9,
    isFeatured: true,
    specifications: ["Active Noise Canceling", "40h Battery", "Bluetooth 5.3"],
  },
  {
    id: "e13",
    title: "Smart Fitness Watch",
    description: "Comprehensive fitness tracker with heart rate monitoring, sleep tracking, and GPS. Water-resistant design with a vibrant color touch screen. Stay healthy and connected.",
    price: 85000,
    category: "Electronics",
    images: [
       "https://images.unsplash.com/photo-1745256375848-1d599594635d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fFNtYXJ0JTIwRml0bmVzcyUyMFdhdGNofGVufDB8fDB8fHww",
        "https://images.unsplash.com/photo-1767903622388-4949aad2bd93?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fFNtYXJ0JTIwRml0bmVzcyUyMFdhdGNofGVufDB8fDB8fHww"
      ],
    stock: 45,
    rating: 4.6,
    isFeatured: false,
    specifications: ["Heart Rate Monitor", "GPS Track", "Water Resistant"],
  },
  {
    id: "e14",
    title: "1TB Portable SSD",
    description: "Ultra-fast and compact portable SSD for high-speed data transfer. Durable shock-resistant design with a USB-C interface. Perfect for photographers and power users.",
    price: 125000,
    category: "Electronics",
    images: [
     "https://media.istockphoto.com/id/186360824/photo/1tb-ssd-drive.webp?a=1&b=1&s=612x612&w=0&k=20&c=MaVVFFuLSCNqS2_jPjKlkmV0m8R4yl9Fp6chtsiVkvo=",
        "https://plus.unsplash.com/premium_photo-1723651280322-513220315969?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8MVRCJTIwUG9ydGFibGUlMjBTU0R8ZW58MHx8MHx8fDA%3D"
      ],
    stock: 30,
    rating: 4.8,
    isFeatured: false,
    specifications: ["1TB Capacity", "1050MB/s Speed", "USB 3.2 Gen 2"],
  },
  {
    id: "e15",
    title: "Studio Condenser Mic Kit",
    description: "Professional-grade condenser microphone kit for streaming, podcasting, and studio recording. Includes adjustable boom arm, shock mount, and pop filter.",
    price: 95000,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 18,
    rating: 4.7,
    isFeatured: false,
    specifications: ["Cardioid Pattern", "XLR Connectivity", "Pop Filter Included"],
  },
  {
    id: "e16",
    title: "iPhone 15 Pro Max 512GB",
    description: "The peak of mobile technology. Titanium design, A17 Pro chip, and the most advanced camera system on an iPhone. Experience unprecedented power and elegance.",
    price: 1850000,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1696446702181-4eb15830f69f?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1695048133142-1a20484d25fa?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 12,
    rating: 5.0,
    isFeatured: true,
    specifications: ["Titanium Body", "A17 Pro Chip", "512GB Storage", "Action Button"],
    variations: [
      { id: "e16-nt", name: "Color", value: "Natural Titanium", stock: 6 },
      { id: "e16-bt", name: "Color", value: "Blue Titanium", stock: 6 }
    ]
  },
  {
    id: "e17",
    title: "Vanguard Gaming Desktop RT",
    description: "Extreme performance desktop for gaming and professional rendering. Liquid-cooled system with the latest RTX 4090 GPU and i9 processor. No compromises.",
    price: 4500000,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 5,
    rating: 4.9,
    isFeatured: true,
    specifications: ["RTX 4090 24GB", "Intel i9-14900K", "64GB DDR5 RAM", "2TB NVMe SSD"],
  },
  {
    id: "e18",
    title: "Heritage Wood FM/AM Radio",
    description: "Vintage-inspired analog radio with modern internals. High-fidelity speakers housed in a handcrafted walnut wood cabinet. Features Bluetooth connectivity and analog tuning.",
    price: 85000,
    category: "Electronics",
    images: [
      "https://media.istockphoto.com/id/2265426886/photo/vintage-retro-style-radio-with-wooden-case-on-bedding-with-soft-morning-light.webp?a=1&b=1&s=612x612&w=0&k=20&c=Hv8Z_-NKOGI7nAmHZRuNbb7VQLDQaoQmNb3KTW4iCM0=",
      "https://media.istockphoto.com/id/1401352528/photo/a-radio-receiver-and-a-cup-of-coffee-on-a-wooden-nightstand-in-the-morning-sun.webp?a=1&b=1&s=612x612&w=0&k=20&c=LFtk3imnxICK0S4v9PNM4pvqoUY7dGHGq0PYQVf68O8="
    ],
    stock: 20,
    rating: 4.7,
    isFeatured: true,
    specifications: ["Walnut Wood", "Bluetooth 5.0", "FM/AM/Shortwave", "Built-in Battery"],
  },
  {
    id: "e19",
    title: "UltraSlim 85\" 4K Smart TV",
    description: "Turn your living room into a cinema. Massive 85-inch display with mini-LED technology for HDR contrast. Built-in smart platform with all your favorite apps.",
    price: 3200000,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1461151304267-38535e770d79?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 8,
    rating: 4.9,
    isFeatured: true,
    specifications: ["85-inch Screen", "Mini-LED 4K", "120Hz Refresh", "Smart OS"],
  },
  {
    id: "e2",
    title: "Pro-Cam Mirrorless Full-Frame",
    description: "Professional mirrorless camera with a 45MP full-frame sensor and 8K video recording capabilities. Features hybrid autofocus and in-body image stabilization.",
    price: 3200000,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1526170315873-3a98ce50d7d6?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 5,
    rating: 5.0,
    isFeatured: true,
    specifications: ["45MP Sensor", "8K 60fps Video", "32000 Max ISO"],
  },
  {
    id: "e3",
    title: "SonicFlow Noise-Canceling Buds",
    description: "Premium true wireless earbuds with adaptive noise cancellation and spatial audio. Includes a wireless charging case with up to 30 hours of total playback time.",
    price: 185000,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1588423637152-44f2cdb51820?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1606220588913-b3aac24d8f41?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 40,
    rating: 4.7,
    isFeatured: false,
    specifications: ["ANC Technology", "USB-C Fast Charge", "Touch Controls"],
    variations: [
      { id: "e3-wh", name: "Color", value: "Arctic White", stock: 20 },
      { id: "e3-bg", name: "Color", value: "Graphite Grey", stock: 20 }
    ]
  },
  {
    id: "e4",
    title: "Book-Pro 15 Ultra Laptop",
    description: "The ultimate productivity laptop featuring a Liquid Retina display and the M3 Pro chip. Includes four Thunderbolt ports and a high-fidelity six-speaker system.",
    price: 2450000,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1525547718571-03943d29a1bd?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 8,
    rating: 4.9,
    isFeatured: true,
    specifications: ["16GB Unified Memory", "1TB SSD", "20-hour Battery"],
  },
  {
    id: "e5",
    title: "SmartHome Hub Display 10\"",
    description: "Centralize your smart home with this 10-inch interactive touch display. Features built-in voice assistant, security camera previews, and music streaming controls.",
    price: 195000,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1518997554304-484f3674345c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1558002038-103792e37984?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 20,
    rating: 4.5,
    isFeatured: false,
    specifications: ["10\" HD Screen", "Far-Field Mics", "Bluetooth 5.2"],
  },
  {
    id: "e6",
    title: "Rugged Peak Bluetooth Speaker",
    description: "Fully waterproof and dustproof portable speaker designed for the outdoors. Delivers deep bass and 360-degree sound with a rugged shockproof silicone exterior.",
    price: 65000,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 35,
    rating: 4.6,
    isFeatured: false,
    specifications: ["IPX7 Waterproof", "15-hour Runtime", "Daisy Chain Link"],
  },
  {
    id: "e7",
    title: "Cinema-Series 65\" OLED TV",
    description: "Experience infinite contrast and perfect black levels with our latest 65-inch OLED display. AI-powered upscaling and high-refresh-rate gaming mode built-in.",
    price: 2850000,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1558885544-2defc62e2e2b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1593784991095-a205029471b6?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 6,
    rating: 4.9,
    isFeatured: true,
    specifications: ["4K OLED Panel", "120Hz Native", "Dolby Atmos Audio"],
  },
  {
    id: "e8",
    title: "FlashCharge 20000mAh Power Bank",
    description: "Ultra-high capacity portable charger with 45W PD fast charging. Can charge a smartphone up to 5 times. Features simultaneous dual-device charging and safety guards.",
    price: 48000,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 100,
    rating: 4.5,
    isFeatured: false,
    specifications: ["45W PD Out", "LCD Battery Display", "Dual Port Output"],
  },

  // HOME ITEMS (8 PRODUCTS)
  {
    id: "h1",
    title: "Scandi Velvet Accent Chair",
    description: "Soft velvet upholstery paired with natural oak legs. This Scandinavian-inspired accent chair provides both exceptional comfort and a touch of modern sophistication.",
    price: 145000,
    oldPrice: 175000,
    category: "Home Items",
    images: [
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 10,
    rating: 4.8,
    isFeatured: true,
    specifications: ["Italian Velvet", "Solid Oak Legs", "Easy Assembly"],
    variations: [
      { id: "h1-em", name: "Color", value: "Emerald Green", stock: 4 },
      { id: "h1-nv", name: "Color", value: "Navy Blue", stock: 3 },
      { id: "h1-ms", name: "Color", value: "Sunset Mustard", stock: 3 }
    ]
  },
  {
    id: "h9",
    title: "Ceramic Essential Oil Diffuser",
    description: "Elegant ceramic ultrasonic diffuser that disperses essential oils into a fine cool mist. Features multiple timer settings and a soft ambient glow light. Perfect for aromatherapy.",
    price: 34000,
    category: "Home Items",
    images: [
      "https://images.unsplash.com/photo-1602928290749-b3a032ef9689?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1595187425624-9b0d23807fb5?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 25,
    rating: 4.7,
    isFeatured: false,
    specifications: ["Ceramic Cover", "100ml Capacity", "BPA-Free Plastics"],
  },
  {
    id: "h10",
    title: "Geometric Wool Rug",
    description: "Hand-tufted wool rug featuring a bold geometric pattern in neutral tones. Soft underfoot and durable enough for high-traffic areas. Adds a touch of modern art to your floor.",
    price: 185000,
    category: "Home Items",
    images: [
      "https://images.unsplash.com/photo-153168525005d-1bd9e205788e?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1575414003591-ece8d0416c7a?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 10,
    rating: 4.8,
    isFeatured: false,
    specifications: ["100% Wool", "5' x 8' Size", "Hand-Tufted"],
  },
  {
    id: "h11",
    title: "Bamboo Bathtub Caddy",
    description: "Luxurious expandable bamboo caddy for the ultimate bath experience. Features a built-in wine glass holder, book/tablet stand, and space for candles and soap.",
    price: 42000,
    category: "Home Items",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6199f7a096?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1584622781480-55866164283b?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 15,
    rating: 4.9,
    isFeatured: true,
    specifications: ["100% Natural Bamboo", "Waterproof Coating", "Expandable Sides"],
  },
  {
    id: "h12",
    title: "Blackout Curtains Set",
    description: "Premium double-layered blackout curtains that block 100% of sunlight and harmful UV rays. Helps insulate against heat and cold while reducing outside noise.",
    price: 48000,
    category: "Home Items",
    images: [
      "https://images.unsplash.com/photo-1513519245088-0e12902e15da?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 30,
    rating: 4.6,
    isFeatured: false,
    specifications: ["Polyester Fabric", "Room Darkening", "Thermal Insulated"],
  },
  {
    id: "h13",
    title: "Stainless Steel Knife Block",
    description: "Elegant 7-piece kitchen knife set forged from high-carbon stainless steel. Features ergonomic handles and a sleek matching storage block. Essential for every home chef.",
    price: 125000,
    category: "Home Items",
    images: [
      "https://images.unsplash.com/photo-1580915411954-282cb1b0d780?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 12,
    rating: 4.8,
    isFeatured: false,
    specifications: ["Forged Stainless Steel", "Full Tang Construction", "Ergonomic Handles"],
  },
  {
    id: "h14",
    title: "Wall-Mounted Spice Rack",
    description: "Minimalist two-tier spice rack crafted from matte black iron. Includes 12 glass jars with airtight lids and customizable labels. Keeps your pantry organized and stylish.",
    price: 28000,
    category: "Home Items",
    images: [
      "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1506484334402-40ff22693541?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 40,
    rating: 4.5,
    isFeatured: false,
    specifications: ["Powder-Coated Iron", "12 Glass Jars", "Wall Mountable"],
  },
  {
    id: "h15",
    title: "Orthopedic Office Chair",
    description: "High-performance office chair designed for maximum comfort and spinal support. Features breathable mesh back, adjustable lumbar support, and 4D armrests. Ideal for long work sessions.",
    price: 220000,
    category: "Home Items",
    images: [
      "https://images.unsplash.com/photo-1505797149-35ebcb05a6fd?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1580482104618-97217316338c?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 8,
    rating: 5.0,
    isFeatured: true,
    specifications: ["Ergonomic Design", "Breathable Mesh", "Heavy-Duty Base"],
  },
  {
    id: "h2",
    title: "Minimalist Arc Floor Lamp",
    description: "Sleek and tall arc floor lamp with a matte black finish and a weighted marble base. Provides warm, targeted lighting for reading nooks and living spaces.",
    price: 58000,
    category: "Home Items",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed657f6970?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1507473885765-e6ed657f6970?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 25,
    rating: 4.6,
    isFeatured: false,
    specifications: ["Matte Black Metal", "Marble Base", "Adjustable Neck"],
  },
  {
    id: "h3",
    title: "DreamCloud Memory Foam Mattress",
    description: "Multi-layered orthopedic memory foam mattress designed for temperature regulation and spinal alignment. Breathable bamboo cover included for extra softness.",
    price: 450000,
    category: "Home Items",
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1595830302920-ca6dd4f8ddb0?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 15,
    rating: 4.9,
    isFeatured: true,
    specifications: ["7-Zone Foam", "Bamboo Cover", "Motion Isolation"],
    variations: [
      { id: "h3-qn", name: "Size", value: "Queen", stock: 10 },
      { id: "h3-kg", name: "Size", value: "King", stock: 5 }
    ]
  },
  {
    id: "h4",
    title: "Reactive Glaze Dinnerware Set",
    description: "12-piece ceramic dinnerware set with a unique reactive glaze finish. Each piece has its own distinctive character. Microwave and dishwasher safe.",
    price: 75000,
    category: "Home Items",
    images: [
      "https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1580913428733-53164bb8272a?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 20,
    rating: 4.7,
    isFeatured: false,
    specifications: ["Hand-Finished Ceramic", "12-Piece Set", "Dishwasher Safe"],
  },
  {
    id: "h5",
    title: "Artisan Soy Candle Bundle",
    description: "Set of three hand-poured soy wax candles with premium essential oil infusions. Includes scents of Lavender Fields, Cedarwood, and Eucalyptus Mint.",
    price: 24000,
    category: "Home Items",
    images: [
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1554181053-ec56d98d2874?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1602143328230-724bbba0a058?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 50,
    rating: 4.5,
    isFeatured: false,
    specifications: ["Natural Soy Wax", "40-hr Burn Time", "Essential Oils"],
  },
  {
    id: "h6",
    title: "Egyptian Cotton Linen Set",
    description: "Superior 600 thread-count Egyptian cotton bed linens. Experience the hotel-quality softness every night. Includes one fitted sheet and four pillowcases.",
    price: 62000,
    category: "Home Items",
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 30,
    rating: 4.8,
    isFeatured: false,
    specifications: ["100% Egyptian Cotton", "600 TC", "Sateen Weave"],
    variations: [
      { id: "h6-wh", name: "Color", value: "Pure White", stock: 15 },
      { id: "h6-gr", name: "Color", value: "Cloud Grey", stock: 15 }
    ]
  },
  {
    id: "h7",
    title: "PureAir Smart Air Purifier",
    description: "A dual-HEPA air purifier that captures 99.9% of airborne particles. Features smart sensor technology that automatically adjusts fan speed based on air quality.",
    price: 185000,
    category: "Home Items",
    images: [
      "https://images.unsplash.com/photo-1585771724684-2428f9360c4e?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1518997554304-484f3674345c?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 12,
    rating: 4.7,
    isFeatured: true,
    specifications: ["Dual HEPA Filter", "App Control", "Silent Sleep Mode"],
  },
  {
    id: "h8",
    title: "Abstract 'Echo' Wall Art",
    description: "Commissioned abstract wall art printed on high-quality gallery-wrapped canvas. Adds a modern, artistic focal point to any room. UV-resistant inks for lasting color.",
    price: 38000,
    category: "Home Items",
    images: [
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1580136579312-94651dfd596d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 15,
    rating: 4.4,
    isFeatured: false,
    specifications: ["Gallery-Wrap Canvas", "UV-Resistant Ink", "Large 60x90cm"],
  },

  // GENERAL MERCHANDISE (8 PRODUCTS)
  {
    id: "g1",
    title: "Heritage Leather Messenger",
    description: "Handcrafted messenger bag made from vegetable-tanned full-grain leather. Thick padded section for a 14-inch laptop and multiple internal organizers.",
    price: 135000,
    oldPrice: 165000,
    category: "General Merchandise",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 10,
    rating: 4.9,
    isFeatured: true,
    specifications: ["Full-Grain Leather", "Laptop Section", "Brass Hardware"],
  },
  {
    id: "g2",
    title: "Stainless Steel Insulated Bottle",
    description: "Double-walled vacuum-insulated water bottle. Keeps drinks cold for 24 hours or hot for 12. Durable powder-coated finish for a non-slip grip.",
    price: 18000,
    category: "General Merchandise",
    images: [
      "https://images.unsplash.com/photo-1602143328230-724bbba0a058?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1523362628744-0c100150b497?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1574634534894-89d7576c8259?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 150,
    rating: 4.6,
    isFeatured: false,
    specifications: ["750ml Capacity", "BPA Free", "Powder-Coated"],
    variations: [
      { id: "g2-st", name: "Color", value: "Satin Steel", stock: 50 },
      { id: "g2-bl", name: "Color", value: "Matte Black", stock: 50 },
      { id: "g2-rg", name: "Color", value: "Rose Gold", stock: 50 }
    ]
  },
  {
    id: "g9",
    title: "UV-C Sterilizer Box",
    description: "Multi-purpose UV-C sterilizer box that kills 99.9% of bacteria and viruses on phones, keys, and accessories in just 5 minutes. Includes an integrated wireless charger.",
    price: 45000,
    category: "General Merchandise",
    images: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1591197172021-015bc4ef7e32?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 25,
    rating: 4.7,
    isFeatured: false,
    specifications: ["UV-C Light", "5-Min Cycle", "Wireless Charging Top"],
  },
  {
    id: "g10",
    title: "15-in-1 Multi-Tool",
    description: "Compact and durable stainless steel multi-tool for everyday carry. Includes pliers, knife, screwdrivers, bottle opener, and more. Comes with a nylon belt sheath.",
    price: 32000,
    category: "General Merchandise",
    images: [
      "https://images.unsplash.com/photo-1593036666687-f8cc0e62c823?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1580913428706-c311e69da51c?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 50,
    rating: 4.8,
    isFeatured: false,
    specifications: ["Stainless Steel", "15 Functions", "Nylon Sheath"],
  },
  {
    id: "g11",
    title: "Eco-Friendly Bento Box",
    description: "Leak-proof bento lunch box made from sustainable wheat straw fiber. Features three compartments to keep food separate and includes reusable utensils. Microwave and freezer safe.",
    price: 18000,
    category: "General Merchandise",
    images: [
      "https://images.unsplash.com/photo-1584346133934-a3afd2a33c4c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1512423175373-398af6a8933b?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 100,
    rating: 4.6,
    isFeatured: false,
    specifications: ["Wheat Straw Material", "1100ml Capacity", "BPA-Free"],
  },
  {
    id: "g12",
    title: "Backlit Travel Luggage Scale",
    description: "Precision digital luggage scale with a clear backlit LCD screen. Features a high-capacity sensor up to 50kg and a durable nylon strap. Never pay overweight fees again.",
    price: 15000,
    category: "General Merchandise",
    images: [
      "https://images.unsplash.com/photo-1592500305630-419da01a7c33?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 80,
    rating: 4.7,
    isFeatured: false,
    specifications: ["50kg Capacity", "g/kg/lb/oz Units", "LCD Backlight"],
  },
  {
    id: "g13",
    title: "Large Travel Duffel Bag",
    description: "Versatile and spacious travel duffel made from water-resistant canvas. Features a separate ventilated shoe compartment and multiple internal pockets for organization.",
    price: 55000,
    category: "General Merchandise",
    images: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1542272454371-331006935fcc?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 35,
    rating: 4.8,
    isFeatured: true,
    specifications: ["Water-Resistant Canvas", "55L Capacity", "Shoe Compartment"],
  },
  {
    id: "g14",
    title: "Minimalist Bifold Wallet",
    description: "Slim bifold wallet crafted from premium top-grain leather. Features RFID-blocking technology to protect your cards and a streamlined design that fits comfortably in any pocket.",
    price: 24000,
    category: "General Merchandise",
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1506484334402-40ff22693541?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 60,
    rating: 4.9,
    isFeatured: false,
    specifications: ["Top-Grain Leather", "RFID Blocking", "Slim Profile"],
  },
  {
    id: "g15",
    title: "Windproof Folding Umbrella",
    description: "Automatic open/close folding umbrella with a reinforced 10-rib windproof frame. Features a large canopy with high-density water-repellent coating. Built to withstand strong gusts.",
    price: 18000,
    category: "General Merchandise",
    images: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5c?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 70,
    rating: 4.5,
    isFeatured: false,
    specifications: ["Auto Open/Close", "10-Rib Construction", "Teflon Coating"],
  },
  {
    id: "g3",
    title: "Pro-Grip Alignment Yoga Mat",
    description: "Superior grip yoga mat with instructional alignment lines etched into the surface. 6mm cushioning provides joint protection for intense sessions.",
    price: 45000,
    category: "General Merchandise",
    images: [
      "https://images.unsplash.com/photo-1592432678894-061005a74ef4?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1518611012118-29a8ad52d4bc?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 40,
    rating: 4.8,
    isFeatured: false,
    specifications: ["6mm Thick TPE", "Alignment Lines", "Non-Toxic TPE"],
  },
  {
    id: "g4",
    title: "Minimalist Silver Mesh Watch",
    description: "Elegant and slim analog watch with a highly durable surgical-grade stainless steel mesh strap. Swiss-quartz movement and scratch-resistant sapphire glass.",
    price: 85000,
    category: "General Merchandise",
    images: [
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1508685096489-77a4bb76cca0?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 20,
    rating: 4.7,
    isFeatured: true,
    specifications: ["Swiss Quartz", "Sapphire Glass", "5 ATM Waterproof"],
    variations: [
      { id: "g4-si", name: "Color", value: "Silver", stock: 10 },
      { id: "g4-gd", name: "Color", value: "Rose Gold", stock: 10 }
    ]
  },
  {
    id: "g5",
    title: "Defender Anti-Theft Backpack",
    description: "Maximum security travel backpack with hidden zippers, slash-proof fabric and integrated USB charging port. Spacious interior with multiple hidden compartments.",
    price: 58000,
    category: "General Merchandise",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1546750248-a135a583307b?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 45,
    rating: 4.6,
    isFeatured: false,
    specifications: ["Slash-Proof Mesh", "Hidden Zippers", "USB Port"],
  },
  {
    id: "g6",
    title: "Classic Silver Aviators",
    description: "Timeless aviator sunglasses featuring polarized G-15 lenses for superior clarity and glare reduction. Lightweight silver-tone titanium frame.",
    price: 42000,
    category: "General Merchandise",
    images: [
      "https://images.unsplash.com/photo-1511499767390-a51167169647?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 60,
    rating: 4.5,
    isFeatured: false,
    specifications: ["Titanium Frame", "Polarized Lenses", "UV400 Protection"],
  },
  {
    id: "g7",
    title: "Total Care Grooming & Skincare Kit",
    description: "Complete organic grooming set containing cedarwood beard oil, charcoal face wash, and hydrating moisturizer. All-natural ingredients for a premium feel.",
    price: 35000,
    category: "General Merchandise",
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1594433830870-ab4a93014cae?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 30,
    rating: 4.8,
    isFeatured: false,
    specifications: ["100% Organic", "Cedarwood Scent", "Paraben-Free"],
  },
  {
    id: "g8",
    title: "Executive Black Stationery Set",
    description: "Elevate your workspace with this executive stationery set. Includes a heavyweight brass fountain pen, large journal, and a minimalist card holder.",
    price: 52000,
    category: "General Merchandise",
    images: [
      "https://images.unsplash.com/photo-1603484477819-3bc6e6f66300?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 20,
    rating: 4.6,
    isFeatured: false,
    specifications: ["Brass & Leather", "Acid-Free Paper", "Black Matte Finish"],
  }
];

export const DEMO_PRODUCTS: Product[] = RAW_DEMO_PRODUCTS.map((p) => ({
  ...p,
  title: asLocalized(p.title),
  description: asLocalized(p.description),
}));

export const RWANDA_LOCATIONS = {
  "Kigali City": ["Nyarugenge", "Gasabo", "Kicukiro"],
  "Northern Province": ["Musanze", "Burera", "Gicumbi", "Gakenke", "Rulindo"],
  "Southern Province": ["Huye", "Nyanza", "Muhanga", "Kamonyi", "Ruhango", "Nyamagabe", "Nyaruguru", "Gisagara"],
  "Eastern Province": ["Rwamagana", "Kayonza", "Bugesera", "Gatsibo", "Kirehe", "Ngoma", "Nyagatare"],
  "Western Province": ["Rubavu", "Karongi", "Rusizi", "Ngororero", "Nyabihu", "Nyamasheke", "Rutsiro"]
};

// Approximate road distances from Kigali City centre (km). Freely editable to tune fees.
export const DISTRICT_DISTANCES_KM: Record<string, number> = {
  // Kigali City — 0 km (free delivery)
  "Nyarugenge": 0,
  "Gasabo":     0,
  "Kicukiro":   0,
  // Southern Province
  "Kamonyi":    40,
  "Muhanga":    55,
  "Ruhango":    80,
  "Nyanza":     95,
  "Huye":      130,
  "Gisagara":  150,
  "Nyamagabe": 155,
  "Nyaruguru": 175,
  // Northern Province
  "Rulindo":    45,
  "Gakenke":   100,
  "Musanze":    95,
  "Burera":    140,
  "Gicumbi":    70,
  // Eastern Province
  "Bugesera":   55,
  "Rwamagana":  50,
  "Kayonza":   100,
  "Ngoma":     115,
  "Kirehe":    150,
  "Gatsibo":   130,
  "Nyagatare": 150,
  // Western Province
  "Nyabihu":   130,
  "Rubavu":    155,
  "Ngororero":  90,
  "Karongi":   115,
  "Rutsiro":   130,
  "Nyamasheke":175,
  "Rusizi":    220,
};

const _KIGALI_DISTRICTS = new Set(["Nyarugenge", "Gasabo", "Kicukiro"]);

/**
 * Returns domestic delivery fee in Rwf.
 * Kigali districts → 0. Others: 60 Rwf/km (≤3 items) or 40 Rwf/km (>3 items), capped at 2000 Rwf.
 */
export function calcDeliveryFee(district: string, totalQuantity: number): number {
  if (!district || _KIGALI_DISTRICTS.has(district)) return 0;
  const distKm = DISTRICT_DISTANCES_KM[district] ?? 0;
  if (distKm === 0) return 0;
  const ratePerKm = totalQuantity > 3 ? 40 : 60;
  return Math.min(distKm * ratePerKm, 2000);
}

export const DISTRICT_DELIVERY_FEES: Record<string, { price: number; time: string }> = {
  // Kigali City (All districts 0 Frw)
  "Nyarugenge": { price: 0, time: "2-4 Hours" },
  "Gasabo": { price: 0, time: "2-4 Hours" },
  "Kicukiro": { price: 0, time: "2-4 Hours" },

  // Southern Province
  "Kamonyi": { price: 0, time: "24 Hours" },
  "Muhanga": { price: 0, time: "24 Hours" },
  "Ruhango": { price: 0, time: "24-48 Hours" },
  "Nyanza": { price: 0, time: "24-48 Hours" },
  "Huye": { price: 0, time: "24-48 Hours" },
  "Gisagara": { price: 0, time: "48 Hours" },
  "Nyamagabe": { price: 0, time: "48 Hours" },
  "Nyaruguru": { price: 0, time: "48-72 Hours" },

  // Northern Province
  "Rulindo": { price: 0, time: "24 Hours" },
  "Gakenke": { price: 0, time: "24-48 Hours" },
  "Musanze": { price: 0, time: "24-48 Hours" },
  "Burera": { price: 0, time: "48 Hours" },
  "Gicumbi": { price: 0, time: "24-48 Hours" },

  // Eastern Province
  "Bugesera": { price: 0, time: "24 Hours" },
  "Rwamagana": { price: 0, time: "24 Hours" },
  "Kayonza": { price: 0, time: "24-48 Hours" },
  "Ngoma": { price: 0, time: "48 Hours" },
  "Kirehe": { price: 0, time: "48-72 Hours" },
  "Gatsibo": { price: 0, time: "48 Hours" },
  "Nyagatare": { price: 0, time: "48-72 Hours" },

  // Western Province
  "Nyabihu": { price: 0, time: "48 Hours" },
  "Rubavu": { price: 0, time: "48 Hours" },
  "Ngororero": { price: 0, time: "48 Hours" },
  "Karongi": { price: 0, time: "48 Hours" },
  "Rutsiro": { price: 0, time: "48-72 Hours" },
  "Nyamasheke": { price: 0, time: "48-72 Hours" },
  "Rusizi": { price: 0, time: "72 Hours" }
};

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "MANIRAKIZA Emmanuel",
    role: { en: "CHief Executive Officer (CEO)", fr: "PDG", rw: "Umuyobozi Mukuru" },
    slogan: { en: "Drive innovation and lead all operations to deliver a better shopping experience, ensuring customer needs are met and satisfaction is achieved.", fr: "Stimuler l'innovation et piloter l'ensemble des opérations afin d'offrir une expérience d'achat optimale, en veillant à ce que les besoins des clients soient satisfaits et que leur satisfaction soit atteinte.", rw: "Guteza imbere udushya no kuyobora ibikorwa byose kugira ngo utange uburambe bwiza bwo guhaha, urebe neza ko ibyo abakiriya bakeneye byujujwe kandi ko banyuzwe." },
    phone: "+250780707472",
    image: "/Emmanuel.jpeg",
    socials: { 
      facebook: "https://web.facebook.com/profile.php?id=61582762229491", 
      instagram: "https://www.instagram.com/iwacu_eu_company_ltd?igsh=MXY5dzA1MGU0bm54Nw==",
      tiktok: "https://tiktok.com/@iwacu_eu_company_ltd"
    }
  },
  {
    name: "UJENEZA Annonciata",
    role: { en: "Operations Manager", fr: "Responsable des Opérations", rw: "Umuyobozi w'Imirimo" },
    slogan: { en: "Ensuring that all company operations run smoothly on a daily basis.", fr: "Veiller au bon déroulement de toutes les opérations de l'entreprise au quotidien.", rw: "Gukora ku buryo ibikorwa byose by'ikigo bigenda neza buri munsi." },
    phone: "+250791318444",
    image: "/Annonciata.jpeg",
    socials: { 
      facebook: "https://web.facebook.com/profile.php?id=61582762229491", 
      instagram: "https://www.instagram.com/iwacu_eu_company_ltd?igsh=MXY5dzA1MGU0bm54Nw==",
      tiktok: "https://tiktok.com/@iwacu_eu_company_ltd"
    }
  }
];

const RAW_DEMO_TESTIMONIALS = [
  {
    id: "1",
    name: "Diane Mukeshimana",
    location: "Kigali, Rwanda",
    message: "I am absolutely thrilled with the quality of the premium denim jacket I bought. The delivery was incredibly fast—arrived in under 3 hours! Highly recommend for anyone looking for authentic brands.",
    rating: 5,
    image: "https://static.vecteezy.com/system/resources/previews/002/002/257/non_2x/beautiful-woman-avatar-character-icon-free-vector.jpg"
  },
  {
    id: "2",
    name: "Jean-Paul Tuyisenge",
    location: "Rubavu, Rwanda",
    message: "Smart Market has the best electronics prices in the country. My new Pro-Cam arrived well-packaged and works perfectly. The customer support guided me through the setup.",
    rating: 5,
    image: "https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001877.png"
  },
  {
    id: "3",
    name: "Sarah Umutoni",
    location: "Huye, Rwanda",
    message: "The home decor collection is stunning. I bought the Scandi accent chair and it transformed my living room. Excellent quality and very professional staff.",
    rating: 4,
    image: "https://static.vecteezy.com/system/resources/previews/001/993/889/non_2x/beautiful-latin-woman-avatar-character-icon-free-vector.jpg"
  }
];

export const DEMO_TESTIMONIALS = RAW_DEMO_TESTIMONIALS.map((t) => ({
  ...t,
  message: asLocalized(t.message),
}));

export const BANK_DETAILS = {
  bank: "Equity Bank",
  accountNumber: "4002100654650",
  accountName: "NIYIGENA Eric"
};

export const MOMO_DETAILS = {
  name: "MANIRAKIZA Emmanuel",
  number: "0780707472",
  merchantCode: "123456" // Optional, if they have one
};

export const AIRTEL_DETAILS = {
  name: "MANIRAKIZA Emmanuel",
  number: "0780707472"
};

export const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1692865217408-5e09d8958be2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8RWxpdGUlMjBGYXNoaW9uJTIwJTI2JTIwU3VpdHN8ZW58MHx8MHx8fDA%3D",
    title: { en: "Elite Fashion & Suits", fr: "Mode et Costumes d'Élite", rw: "Imyenda n'Amakositime" },
    subtitle: { en: "Premium Tuxedos, Baby Designer Wear & More", fr: "Tuxedos Premium, Vêtements Bébé & Plus", rw: "Amakositime n'Imyenda y'abana" },
    cta: { en: "Shop Fashion", fr: "Acheter la Mode", rw: "Gura Imyenda" },
    productId: "f2"
  },
  {
    image: "https://images.unsplash.com/photo-1695822822491-d92cee704368?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aVBob25lJTIwMTUlMjBQcm8lMjBNYXh8ZW58MHx8MHx8fDA%3D",
    title: { en: "iPhone 15 Pro Max", fr: "iPhone 15 Pro Max", rw: "iPhone 15 Pro Max" },
    subtitle: { en: "Experience the Peak of Mobile Intelligence", fr: "Le Sommet de l'Intelligence Mobile", rw: "Telefone nshya ya iPhone 15" },
    cta: { en: "Get Yours", fr: "Obtenir le Vôtre", rw: "Yigure ubu" },
    productId: "e16"
  },
  {
    image: "https://images.unsplash.com/photo-1643753072729-d54252008db0?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: { en: "Grand Cinema Experience", fr: "Expérience Grand Cinéma", rw: "Sinema mu rugo iwawe" },
    subtitle: { en: "Massive 85\" 4K Smart TVs and Luxury Audio", fr: "TV 85\" 4K Géantes & Audio de Luxe", rw: "TV nini n'ibyuma bisohora amajwi" },
    cta: { en: "Browse Home Tech", fr: "Voir la Tech Maison", rw: "Reba ibikoresho" },
    productId: "e19"
  }
];

export const TRANSLATIONS: Record<string, any> = {
  home: { en: "Home", fr: "Accueil", rw: "Ahabanza" },
  shop: { en: "Shop", fr: "Boutique", rw: "Iduka" },
  about: { en: "About Us", fr: "À Propos", rw: "Turi Bande" },
  contact: { en: "Contact Us", fr: "Contactez-nous", rw: "Twandikire" },
  delivery: { en: "Delivery Info", fr: "Infos Livraison", rw: "Amakuru y'Itonji" },
  cart: { en: "Cart", fr: "Panier", rw: "Ikarita" },
  checkout: { en: "Checkout", fr: "Payer", rw: "Kwishura" },
  admin: { en: "Admin", fr: "Admin", rw: "Admin" },
  search: { en: "Search products...", fr: "Rechercher...", rw: "Shaka ibicuruzwa..." },
  categories: { en: "Categories", fr: "Catégories", rw: "Ibyiciro" },
  featured: { en: "Featured Products", fr: "Produits Vedettes", rw: "Ibicuruzwa Byatoranyijwe" },
  addToCart: { en: "Add to Cart", fr: "Ajouter au Panier", rw: "Shyira mu Ikarita" },
  orderWhatsApp: { en: "Order via WhatsApp", fr: "Commander via WhatsApp", rw: "Tegeka kuri WhatsApp" },
  askProduct: { en: "Ask about this product", fr: "Demander sur ce produit", rw: "Baza kuri iki gicuruzwa" },
  whyChooseUs: { en: "Why Choose Us", fr: "Pourquoi Nous Choisir", rw: "Kuki Twahitamo" },
  testimonials: { en: "Customer Testimonials", fr: "Témoignages Clients", rw: "Ubuhamya bw'Abakiriya" },
  newsletter: { en: "Join Our Newsletter", fr: "Rejoignez Notre Newsletter", rw: "Iyandikishe ku Makuru" },
  securePayment: { en: "Secure Payment", fr: "Paiement Sécurisé", rw: "Kwishura neza" },
  fastDelivery: { en: "Fast Delivery", fr: "Livraison Rapide", rw: "Kugezwaho vuba" },
  qualityProducts: { en: "Quality Products", fr: "Produits de Qualité", rw: "Ibicuruzwa byiza" },
  support247: { en: "24/7 Support", fr: "Support 24/7", rw: "Ubufasha 24/7" },
  stock: { en: "In Stock", fr: "En Stock", rw: "Birahari" },
  outOfStock: { en: "Out of Stock", fr: "Rupture de Stock", rw: "Byashize" },
  price: { en: "Price", fr: "Prix", rw: "Igiciro" },
  total: { en: "Total", fr: "Total", rw: "Yose hamwe" },
  fullName: { en: "Full Name", fr: "Nom Complet", rw: "Amazina Yose" },
  phoneNumber: { en: "Phone Number", fr: "Numéro de Téléphone", rw: "Nimero ya Telefone" },
  address: { en: "Delivery Address", fr: "Adresse de Livraison", rw: "Aho uherereye" },
  paymentMethod: { en: "Payment Method", fr: "Mode de Paiement", rw: "Uburyo bwo Kwishura" },
  placeOrder: { en: "Place Order", fr: "Passer la Commande", rw: "Tegeka" },
  orderConfirmed: { en: "Order Confirmed!", fr: "Commande Confirmée!", rw: "Byemejwe!" },
  orderId: { en: "Order ID", fr: "ID de Commande", rw: "Nimero y'Itegeka" },
  trackOrder: { en: "Track Order", fr: "Suivre la Commande", rw: "Kurikirana Itegeka" },
  status: { en: "Status", fr: "Statut", rw: "Imiterere" },
  pending: { en: "Pending", fr: "En attente", rw: "Birategereje" },
  confirmed: { en: "Confirmed", fr: "Confirmée", rw: "Byemejwe" },
  shipped: { en: "Shipped", fr: "Expédiée", rw: "Byoherejwe" },
  delivered: { en: "Delivered", fr: "Livrée", rw: "Byageze" },
  momo: { en: "Mobile Money", fr: "Mobile Money", rw: "Momo" },
  card: { en: "Debit/Credit Card", fr: "Carte Bancaire", rw: "Ikarita ya Banki" },
  cod: { en: "Cash on Delivery", fr: "Paiement à la Livraison", rw: "Kwishura uhawe" },

  // ── Shared / generic ─────────────────────────────────────────────────────
  subscribe: { en: "Subscribe", fr: "S'abonner", rw: "Iyandikishe" },
  subscribing: { en: "Subscribing...", fr: "Inscription...", rw: "Kwiyandikisha..." },
  cancel: { en: "Cancel", fr: "Annuler", rw: "Hagarika" },
  viewAll: { en: "View All", fr: "Voir tout", rw: "Reba Byose" },
  callLabel: { en: "Call:", fr: "Appeler :", rw: "Hamagara:" },
  qtyLabel: { en: "Qty:", fr: "Qté :", rw: "Umubare:" },
  dateLabel: { en: "Date:", fr: "Date :", rw: "Itariki:" },
  backBtn: { en: "Back", fr: "Retour", rw: "Subira inyuma" },
  selectLabel: { en: "Select", fr: "Sélectionner", rw: "Hitamo" },
  selectedLabel: { en: "Selected:", fr: "Sélectionné :", rw: "Byahiswemo:" },
  countryLabel: { en: "Country", fr: "Pays", rw: "Igihugu" },
  countryRwanda: { en: "Rwanda", fr: "Rwanda", rw: "u Rwanda" },
  countryUganda: { en: "Uganda", fr: "Ouganda", rw: "Uganda" },
  countryKenya: { en: "Kenya", fr: "Kenya", rw: "Kenya" },
  countryTanzania: { en: "Tanzania", fr: "Tanzanie", rw: "Tanzaniya" },
  countryBurundi: { en: "Burundi", fr: "Burundi", rw: "Uburundi" },
  countryDRC: { en: "DRC", fr: "RDC", rw: "DRC" },
  provinceLabel: { en: "Province", fr: "Province", rw: "Intara" },
  districtLabel: { en: "District", fr: "District", rw: "Akarere" },
  selectProvince: { en: "Select Province", fr: "Sélectionner la Province", rw: "Hitamo Intara" },
  selectDistrict: { en: "Select District", fr: "Sélectionner le District", rw: "Hitamo Akarere" },
  deliveryLabel: { en: "Delivery", fr: "Livraison", rw: "Itonji" },
  subtotalLabel: { en: "Subtotal", fr: "Sous-total", rw: "Igiteranyo cy'ibanze" },
  deliveryFeeLabel: { en: "Delivery Fee", fr: "Frais de Livraison", rw: "Amafaranga y'Itonji" },
  freeLabel: { en: "FREE", fr: "GRATUIT", rw: "KU BUNTU" },
  workingHoursLabel: { en: "Working Hours:", fr: "Heures d'Ouverture :", rw: "Amasaha y'Akazi:" },
  monSat: { en: "Mon - Sat:", fr: "Lun - Sam :", rw: "Kuwa Mbere - Kuwa Gatandatu:" },
  sundayLabel: { en: "Sunday:", fr: "Dimanche :", rw: "Ku Cyumweru:" },
  allCategoriesLabel: { en: "All", fr: "Tous", rw: "Byose" },
  startShoppingBtn: { en: "Start Shopping", fr: "Commencer vos achats", rw: "Tangira Kuguraho" },
  continueShoppingBtn: { en: "Continue Shopping", fr: "Continuer mes achats", rw: "Komeza Kuguraho" },
  orderSummaryTitle: { en: "Order Summary", fr: "Résumé de la Commande", rw: "Incamake y'Itegeko" },
  orderTotalTitle: { en: "Order Total", fr: "Total de la Commande", rw: "Igiteranyo cy'Itegeko" },
  printInvoiceBtn: { en: "Print Invoice", fr: "Imprimer la Facture", rw: "Sohora Fagitire" },
  backToHomeBtn: { en: "Back to Home", fr: "Retour à l'Accueil", rw: "Subira Ahabanza" },

  // ── Home page ────────────────────────────────────────────────────────────
  exploreCategoriesDesc: { en: "Explore our wide range of products", fr: "Découvrez notre large gamme de produits", rw: "Reba ibicuruzwa byacu byinshi" },
  marqueeWelcome: { en: "WELCOME TO IWACU EU COMPANY LTD", fr: "BIENVENUE CHEZ IWACU EU COMPANY LTD", rw: "MURAKAZE KURI IWACU EU COMPANY LTD" },
  marqueeTagline: { en: "Shop Smart. Live Better.", fr: "Achetez Intelligemment. Vivez Mieux.", rw: "Gura mu Buryo Bwiza. Ubeho Neza." },
  marqueeValues: { en: "Trust, excellence, integrity, and service", fr: "Confiance, excellence, intégrité et service", rw: "Icyizere, Ubunyangamugayo, n'Umurimo Mwiza" },
  marqueeVerse: { en: "Commit to the Lord whatever you do, and He will establish your plans. (Proverbs 16:3)", fr: "Recommande à l'Éternel tes œuvres, et tes projets réussiront. (Proverbes 16:3)", rw: "Habwaho Uwiteka ibyo ukora, kandi imigambi yawe izagenda neza. (Imigani 16:3)" },
  featureSecureDesc: { en: "MTN MoMo, Airtel Money & Cards", fr: "MTN MoMo, Airtel Money et Cartes", rw: "MTN MoMo, Airtel Money n'Amakarita" },
  featureDeliveryDesc: { en: "Delivery within 24 hours in Kigali", fr: "Livraison en 24 heures à Kigali", rw: "Kugeza mu masaha 24 muri Kigali" },
  featureQualityDesc: { en: "100% genuine and tested items", fr: "Articles 100% authentiques et testés", rw: "Ibintu 100% by'ukuri kandi byagenzuwe" },
  featureSupportDesc: { en: "We are always here to help you", fr: "Nous sommes toujours là pour vous aider", rw: "Turi hano igihe cyose kugira ngo tubafashe" },
  whyTrustedTitle: { en: "Trusted by Thousands", fr: "Approuvé par des Milliers de Clients", rw: "Twizerwa n'Ibihumbi by'Abantu" },
  whyTrustedDesc: { en: "We have served over 10,000 happy customers across Rwanda.", fr: "Nous avons servi plus de 10 000 clients satisfaits à travers le Rwanda.", rw: "Twamaze gufasha abakiriya barenga 10,000 banyuranye mu Rwanda hose." },
  securePaymentsTitle: { en: "Secure Payments", fr: "Paiements Sécurisés", rw: "Kwishura mu Mutekano" },
  whySecureDesc: { en: "Your financial information is always protected with our secure systems.", fr: "Vos informations financières sont toujours protégées par nos systèmes sécurisés.", rw: "Amakuru yawe y'imari arindwa buri gihe n'uburyo bwacu bw'umutekano." },
  whyDeliveryDesc: { en: "We understand your urgency. Most orders are delivered same-day.", fr: "Nous comprenons votre urgence. La plupart des commandes sont livrées le jour même.", rw: "Twumva ko bikwiye kwihutishwa. Ibyinshi mu bitegeko bigezwa ku munsi umwe." },
  newsletterDesc: { en: "Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.", fr: "Abonnez-vous pour recevoir des offres spéciales, des cadeaux gratuits et des promotions exceptionnelles.", rw: "Iyandikishe kugira ngo ubone ibiciro byihariye, ibihembo ku buntu, n'amasoko adasanzwe." },
  emailPlaceholder: { en: "Your email address", fr: "Votre adresse e-mail", rw: "Aderesi yawe ya imeri" },
  subscribeModalTitle: { en: "What are you interested in?", fr: "Qu'est-ce qui vous intéresse ?", rw: "Ni iki gishimishije?" },
  subscribeModalDesc: { en: "Tell us why you're subscribing so we can follow up.", fr: "Dites-nous pourquoi vous vous abonnez afin que nous puissions vous recontacter.", rw: "Tubwire impamvu wiyandikishije kugira ngo tuguhamagare." },
  subscribeAdvertise: { en: "Advertise with us", fr: "Faire de la publicité avec nous", rw: "Kwamamaza kuri twe" },
  subscribePartner: { en: "Become a partner", fr: "Devenir partenaire", rw: "Kuba umufatanyabikorwa" },
  subscribeAgent: { en: "Become an agent", fr: "Devenir agent", rw: "Kuba umuhagarariye" },
  subscribeSuccess: { en: "Thanks for subscribing! We will be in touch soon.", fr: "Merci de vous être abonné ! Nous vous contacterons bientôt.", rw: "Murakoze kwiyandikisha! Tuzabahamagara vuba." },
  subscribeError: { en: "Failed to subscribe. Please try again.", fr: "Échec de l'inscription. Veuillez réessayer.", rw: "Kwiyandikisha byanze. Ongera ugerageze." },

  // ── About page ───────────────────────────────────────────────────────────
  aboutWelcomePrefix: { en: "Welcome to", fr: "Bienvenue chez", rw: "Murakaze kuri" },
  aboutIntro: {
    en: "IWACU EU COMPANY LTD is a dynamic and customer-focused enterprise based in Kigali, Rwanda, dedicated to providing high-quality products and services that meet modern lifestyle and business needs. The company operates across multiple sectors, with a strong emphasis on retail, general supply, and distribution of essential goods including home appliances, kitchen equipment, and lifestyle products. Driven by a commitment to quality, affordability, and customer satisfaction, IWACU EU COMPANY LTD sources reliable products—often inspired by international standards—to ensure durability, efficiency, and value for money. The company aims to simplify everyday living by offering practical solutions that enhance comfort and convenience for households and businesses alike. With a growing reputation in the market.",
    fr: "IWACU EU COMPANY LTD est une entreprise dynamique et centrée sur le client, basée à Kigali, au Rwanda, dédiée à fournir des produits et services de haute qualité répondant aux besoins modernes de la vie quotidienne et des affaires. L'entreprise opère dans plusieurs secteurs, avec un accent particulier sur le commerce de détail, l'approvisionnement général et la distribution de biens essentiels tels que les appareils électroménagers, les équipements de cuisine et les produits de style de vie. Animée par un engagement envers la qualité, l'accessibilité financière et la satisfaction client, IWACU EU COMPANY LTD s'approvisionne en produits fiables — souvent inspirés des normes internationales — afin de garantir durabilité, efficacité et bon rapport qualité-prix. L'entreprise vise à simplifier la vie quotidienne en offrant des solutions pratiques qui améliorent le confort et la commodité des ménages et des entreprises. Avec une réputation grandissante sur le marché.",
    rw: "IWACU EU COMPANY LTD ni isosiyete ikora ku muvuduko yita cyane ku bakiriya, ifite icyicaro i Kigali mu Rwanda, yiyemeje gutanga ibicuruzwa n'imirimo by'ubwiza buhambaye bihuye n'ubuzima bugezweho n'ibikenewe mu bucuruzi. Iyi sosiyete ikorera mu byiciro byinshi, yibanda cyane cyane ku bucuruzi busanzwe, itangwa ry'ibintu bikenewe harimo ibikoresho byo mu rugo, ibikoresho byo mu gikoni, n'ibindi bicuruzwa by'ubuzima bwa buri munsi. Iyobowe n'ubushake bwo gutanga ubwiza, ibiciro bigerwaho, n'ukunyurwa kw'abakiriya, IWACU EU COMPANY LTD itoranya ibicuruzwa byizewe—akenshi bishingiye ku bipimo mpuzamahanga—kugira ngo hemezwe imbaraga, ubunyangamugayo, n'agaciro k'amafaranga yatanzwe. Iyi sosiyete igamije koroshya ubuzima bwa buri munsi itanga ibisubizo byifashishwa bituma imiryango n'ubucuruzi byishimira ubworoherane. Ifite icyubahiro kigenda kiyongera ku isoko.",
  },
  aboutBullet1: { en: "Strong customer relationships and responsive service", fr: "Des relations clients solides et un service réactif", rw: "Umubano mwiza n'abakiriya n'umurimo wihuse" },
  aboutBullet2: { en: "Focus on modern, energy-efficient, and innovative products", fr: "Un accent sur des produits modernes, économes en énergie et innovants", rw: "Kwibanda ku bicuruzwa bigezweho, bikoresha ingufu neza, kandi bishya" },
  aboutBullet3: { en: "Reliable delivery and accessible pricing", fr: "Une livraison fiable et des prix accessibles", rw: "Itonji ryizewe n'ibiciro bigerwaho" },
  aboutBullet4: { en: "Commitment to integrity and professionalism in all operations", fr: "Un engagement envers l'intégrité et le professionnalisme dans toutes les opérations", rw: "Kwiyemeza ubunyangamugayo n'ubuhanga mu mirimo yose" },
  yearsExperience: { en: "Years Experience", fr: "Années d'Expérience", rw: "Imyaka y'Uburambe" },
  missionTitle: { en: "Our Mission", fr: "Notre Mission", rw: "Intego Yacu" },
  missionDesc: { en: "To provide accessible, high-quality products that enhance the lives of our customers.", fr: "Fournir des produits accessibles et de haute qualité qui améliorent la vie de nos clients.", rw: "Gutanga ibicuruzwa bigerwaho kandi by'ubwiza buhambaye bituma ubuzima bw'abakiriya bacu bunoga." },
  visionTitle: { en: "Our Vision", fr: "Notre Vision", rw: "Icyerekezo Cyacu" },
  visionDesc: { en: "The company's vision is to become a trusted leading supplier in Rwanda and beyond, known for delivering quality products and excellent service, while continuously adapting to the evolving needs of its customers.", fr: "La vision de l'entreprise est de devenir un fournisseur de premier plan et de confiance au Rwanda et au-delà, reconnu pour la qualité de ses produits et l'excellence de son service, tout en s'adaptant continuellement aux besoins évolutifs de ses clients.", rw: "Icyerekezo cy'iyi sosiyete ni ukuba umutanga w'ibicuruzwa uzewe kandi uyoboye mu Rwanda no hanze yarwo, uzwiho gutanga ibicuruzwa by'ubwiza n'umurimo mwiza, mu gihe ihindagurika buri gihe hakurikijwe ibikenewe by'abakiriya." },
  valuesTitle: { en: "Our Values", fr: "Nos Valeurs", rw: "Indangagaciro Zacu" },
  valuesDesc: { en: "Excellence, customer satisfaction, and community growth are at the heart of everything we do.", fr: "L'excellence, la satisfaction client et le développement communautaire sont au cœur de tout ce que nous faisons.", rw: "Ubwiza, ukunyurwa kw'abakiriya, n'iterambere ry'umuryango ni byo shingiro ry'ibyo dukora byose." },
  meetTeamTitle: { en: "Meet Our Team", fr: "Rencontrez Notre Équipe", rw: "Menyana n'Itsinda Ryacu" },
  meetTeamDescPrefix: { en: "The dedicated professionals driving", fr: "Les professionnels dévoués qui font avancer", rw: "Abanyamwuga biyemeje batera imbere" },
  meetTeamDescSuffix: { en: "towards excellence.", fr: "vers l'excellence.", rw: "berekeza ku bwiza buhambaye." },
  ctaTitle: { en: "Ready to start shopping?", fr: "Prêt à commencer vos achats ?", rw: "Witeguye gutangira kuguraho?" },
  ctaDescPrefix: { en: "Join thousands of satisfied customers who trust", fr: "Rejoignez des milliers de clients satisfaits qui font confiance à", rw: "Ifatanye n'ibihumbi by'abakiriya banyuzwe bizeye" },
  ctaDescSuffix: { en: "for their daily needs.", fr: "pour leurs besoins quotidiens.", rw: "ku bikenewe byabo bya buri munsi." },
  exploreShopBtn: { en: "Explore Our Shop", fr: "Découvrir Notre Boutique", rw: "Reba Iduka Ryacu" },

  // ── Account page ─────────────────────────────────────────────────────────
  customerAccountTitle: { en: "Customer Account", fr: "Compte Client", rw: "Konti y'Umukiriya" },
  customerAccountDesc: { en: "Enter your phone number to view your order history", fr: "Entrez votre numéro de téléphone pour voir votre historique de commandes", rw: "Andika numero ya telefoni yawe kugira ngo urebe amateka y'ibyo watumije" },
  phonePlaceholderExample: { en: "e.g. 0782021871", fr: "ex. 0782021871", rw: "urugero 0782021871" },
  viewMyOrdersBtn: { en: "View My Orders", fr: "Voir Mes Commandes", rw: "Reba Ibyo Natumije" },
  customerLabel: { en: "Customer", fr: "Client", rw: "Umukiriya" },
  logoutBtn: { en: "Logout", fr: "Déconnexion", rw: "Sohoka" },
  needHelpTitle: { en: "Need help?", fr: "Besoin d'aide ?", rw: "Ukeneye ubufasha?" },
  needHelpDesc: { en: "If you have any questions about your orders, contact our support.", fr: "Si vous avez des questions sur vos commandes, contactez notre support.", rw: "Niba ufite ikibazo ku byerekeye ibyo watumije, hamagara ubufasha bwacu." },
  callSupportBtn: { en: "Call Support", fr: "Appeler le Support", rw: "Hamagara Ubufasha" },
  orderHistoryTitle: { en: "Order History", fr: "Historique des Commandes", rw: "Amateka y'Ibyatumijwe" },
  ordersCountSuffix: { en: "Orders", fr: "Commandes", rw: "Ibyatumijwe" },
  noOrdersTitle: { en: "No orders found", fr: "Aucune commande trouvée", rw: "Nta cyatumijwe cyabonetse" },
  noOrdersDesc: { en: "You haven't placed any orders with this phone number yet.", fr: "Vous n'avez encore passé aucune commande avec ce numéro de téléphone.", rw: "Ntabwo waratumiza ikintu ukoresheje iyi numero ya telefoni." },
  orderHashPrefix: { en: "Order #", fr: "Commande n° ", rw: "Itegeko #" },
  orderDetailsTitle: { en: "Order Details", fr: "Détails de la Commande", rw: "Amakuru y'Itegeko" },
  itemsOrderedTitle: { en: "Items Ordered", fr: "Articles Commandés", rw: "Ibintu Byatumijwe" },

  // ── Cart page ────────────────────────────────────────────────────────────
  cartEmptyTitle: { en: "Your cart is empty", fr: "Votre panier est vide", rw: "Ikarita yawe ni ubusa" },
  cartEmptyDesc: { en: "Looks like you haven't added anything to your cart yet. Start shopping to find the best deals!", fr: "Il semble que vous n'ayez encore rien ajouté à votre panier. Commencez vos achats pour trouver les meilleures offres !", rw: "Bisa n'aho utarashyira ikintu mu ikarita yawe. Tangira kuguraho ubone amasoko meza!" },
  calculatedAtCheckout: { en: "Calculated at checkout", fr: "Calculé lors du paiement", rw: "Igenwa igihe cyo kwishyura" },
  proceedToPrefix: { en: "Proceed to", fr: "Passer à", rw: "Komeza kuri" },

  // ── Checkout page ────────────────────────────────────────────────────────
  shippingInfoTitle: { en: "Shipping Information", fr: "Informations de Livraison", rw: "Amakuru y'Itonji" },
  fullNamePlaceholder: { en: "Enter your full name", fr: "Entrez votre nom complet", rw: "Andika amazina yawe yose" },
  phonePlaceholderPattern: { en: "078xxxxxxx", fr: "078xxxxxxx", rw: "078xxxxxxx" },
  emailOptionalLabel: { en: "Email Address (Optional)", fr: "Adresse e-mail (Facultatif)", rw: "Aderesi ya imeri (Si itegeko)" },
  streetAddressLabel: { en: "Street Address / Landmark (Optional)", fr: "Adresse / Point de repère (Facultatif)", rw: "Aho utuye / Ikimenyetso (Si itegeko)" },
  streetAddressPlaceholder: { en: "e.g. KN 2 Rd, Downtown Building", rw: "urugero: KN 2 Rd, Downtown Building", fr: "ex. KN 2 Rd, Downtown Building" },
  bankTransferLabel: { en: "Bank Transfer", fr: "Virement Bancaire", rw: "Kohereza kuri Banki" },
  momoInstructionAlert: { en: "Enter your Mobile Money number. You will receive a prompt on your phone to confirm the payment.", fr: "Entrez votre numéro Mobile Money. Vous recevrez une invite sur votre téléphone pour confirmer le paiement.", rw: "Andika numero yawe ya Mobile Money. Uzabona ubutumwa kuri telefoni yawe bwo kwemeza kwishyura." },
  momoNumberLabel: { en: "MoMo Number", fr: "Numéro MoMo", rw: "Numero ya MoMo" },
  cardNumberLabel: { en: "Card Number", fr: "Numéro de Carte", rw: "Numero y'Ikarita" },
  expiryDateLabel: { en: "Expiry Date", fr: "Date d'Expiration", rw: "Itariki Irangira" },
  cvvLabel: { en: "CVV", fr: "CVV", rw: "CVV" },
  bankDetailsTitle: { en: "Bank Details", fr: "Coordonnées Bancaires", rw: "Amakuru ya Banki" },
  bankLabel: { en: "Bank:", fr: "Banque :", rw: "Banki:" },
  accountNameLabel: { en: "Account Name:", fr: "Nom du Compte :", rw: "Amazina ya Konti:" },
  accountNumberLabel: { en: "Account Number:", fr: "Numéro de Compte :", rw: "Numero ya Konti:" },
  bankTransferNote: { en: "* Please use your Name or Phone Number as the transfer reference.", fr: "* Veuillez utiliser votre nom ou votre numéro de téléphone comme référence de virement.", rw: "* Koresha amazina yawe cyangwa numero ya telefoni nk'inyandiko y'ubwoherezi." },
  codNote: { en: "You will pay for your order in cash or via MoMo when it is delivered to your doorstep.", fr: "Vous paierez votre commande en espèces ou via MoMo à la livraison à votre domicile.", rw: "Uzishyura ibyo watumije mu mafaranga y'ipapuro cyangwa kuri MoMo igihe bigejejwe iwawe." },
  restrictedServiceTitle: { en: "Restricted Service", fr: "Service Restreint", rw: "Umurimo Ugarukira" },
  restrictedServiceDesc: { en: "Only Kigali is allowed to pay for this service, and then your order will arrive.", fr: "Seule Kigali est autorisée à payer pour ce service, votre commande arrivera ensuite.", rw: "Ni Kigali gusa yemerewe kwishyura uyu murimo, hanyuma ikintu wasabye kikaza kigera." },
  needHelpWriteToUsPrefix: { en: "If you need help,", fr: "Si vous avez besoin d'aide,", rw: "Niba ukeneye ubufasha," },
  writeToUsLink: { en: "write to us", fr: "écrivez-nous", rw: "twandikire" },
  selectLocationLabel: { en: "Select location", fr: "Sélectionnez un lieu", rw: "Hitamo aho uri" },
  payNowBtn: { en: "Pay Now", fr: "Payer Maintenant", rw: "Ishyura Nonaha" },
  processingBtn: { en: "Processing...", fr: "Traitement en cours...", rw: "Birimo gutunganywa..." },
  payAmountPrefix: { en: "Pay", fr: "Payer", rw: "Ishyura" },
  initiatingLabel: { en: "Initiating...", fr: "Initialisation...", rw: "Biratangira..." },
  pleaseDontRefresh: { en: "Please do not refresh this page", fr: "Veuillez ne pas actualiser cette page", rw: "Ntukongere gufungura iyi paji" },
  secureSSL: { en: "Secure SSL Encrypted Payment", fr: "Paiement Sécurisé et Crypté SSL", rw: "Kwishura mu Mutekano wa SSL" },
  errFillShipping: { en: "Please fill in all required shipping details.", fr: "Veuillez remplir tous les détails de livraison requis.", rw: "Uzuza amakuru yose y'itonji akenewe." },
  errSelectProvinceDistrict: { en: "Please select your Province and District.", fr: "Veuillez sélectionner votre Province et District.", rw: "Hitamo Intara yawe n'Akarere kawe." },
  errKigaliOnlyCod: { en: "Only Kigali is allowed to pay for this service, and then your order will arrive. If you need help, write to us.", fr: "Seule Kigali est autorisée à payer pour ce service, votre commande arrivera ensuite. Si vous avez besoin d'aide, écrivez-nous.", rw: "Ni Kigali gusa yemerewe kwishyura uyu murimo, hanyuma ikintu wasabye kikaza kigera. Niba ukeneye ubufasha, twandikire." },
  errInvalidMomo: { en: "Please enter a valid Rwanda Mobile Money number (e.g., 078xxxxxxx).", fr: "Veuillez entrer un numéro Mobile Money rwandais valide (ex. 078xxxxxxx).", rw: "Andika numero nyayo ya Mobile Money yo mu Rwanda (urugero: 078xxxxxxx)." },
  errItemsUnavailable: { en: "Some items in your cart are no longer available. Please review your cart.", fr: "Certains articles de votre panier ne sont plus disponibles. Veuillez vérifier votre panier.", rw: "Ibintu bimwe biri mu ikarita yawe ntibikiboneka. Ongera urebe ikarita yawe." },
  orderReceivedTitle: { en: "Order Received!", fr: "Commande Reçue !", rw: "Itegeko Ryakiriwe!" },
  orderReceivedDesc: { en: "Please complete your payment to finalize your order.", fr: "Veuillez finaliser votre paiement pour valider votre commande.", rw: "Uzuza kwishyura kugira ngo urangize itegeko ryawe." },
  howToPayTitle: { en: "How to Pay", fr: "Comment Payer", rw: "Uko Wishyura" },
  totalAmountLabel: { en: "Total Amount:", fr: "Montant Total :", rw: "Amafaranga Yose:" },
  mtnMomoTitle: { en: "MTN Mobile Money", fr: "MTN Mobile Money", rw: "MTN Mobile Money" },
  dialLabel: { en: "Dial", fr: "Composez", rw: "Kanda" },
  enterNumberLabel: { en: "Enter Number:", fr: "Entrez le Numéro :", rw: "Andika Numero:" },
  enterAmountLabel: { en: "Enter Amount:", fr: "Entrez le Montant :", rw: "Andika Amafaranga:" },
  verifyNameLabel: { en: "Verify Name:", fr: "Vérifiez le Nom :", rw: "Genzura Izina:" },
  useOrderCodeLabel: { en: "Use Order Code", fr: "Utilisez le Code de Commande", rw: "Koresha Kode y'Itegeko" },
  asReferenceLabel: { en: "as Reference", fr: "comme référence", rw: "nk'inyandiko" },
  airtelMoneyTitle: { en: "Airtel Money", fr: "Airtel Money", rw: "Airtel Money" },
  dialThenChooseAirtel: { en: "then choose Airtel", fr: "puis choisissez Airtel", rw: "hanyuma uhitemo Airtel" },
  transferToLabel: { en: "Transfer to:", fr: "Transférer à :", rw: "Ohereza kuri:" },
  equityBankRwanda: { en: "Equity Bank Rwanda", fr: "Equity Bank Rwanda", rw: "Equity Bank Rwanda" },
  accountHolderLabel: { en: "Account Holder", fr: "Titulaire du Compte", rw: "Nyir'Ikonti" },
  bankTransferHelperPrefix: { en: "Please ensure you include the order code", fr: "Veuillez inclure le code de commande", rw: "Menya neza ko washyizemo kode y'itegeko" },
  bankTransferHelperSuffix: { en: "in the bank transfer description to help us process your order faster.", fr: "dans la description du virement pour nous aider à traiter votre commande plus rapidement.", rw: "mu nyandiko y'ubwoherezi kugira ngo dutunganye itegeko ryawe vuba." },
  codDeliveryDescPrefix: { en: "Our delivery team will contact you once they are near your location. Please have the exact amount of", fr: "Notre équipe de livraison vous contactera lorsqu'elle sera près de chez vous. Veuillez préparer le montant exact de", rw: "Itsinda ryacu ry'itonji rizabahamagara igihe rigeze hafi yawe. Tegura amafaranga ahwanye na" },
  codDeliveryDescSuffix: { en: "ready in cash or available on your Mobile Money phone.", fr: "en espèces ou disponible sur votre téléphone Mobile Money.", rw: "mu mafaranga y'ipapuro cyangwa kuri telefoni yawe ya Mobile Money." },
  needHelpLabel: { en: "Need Help?", fr: "Besoin d'Aide ?", rw: "Ukeneye Ubufasha?" },
  whatsappUsLabel: { en: "WhatsApp us:", fr: "WhatsApp :", rw: "Twandikire kuri WhatsApp:" },

  // ── Delivery page ────────────────────────────────────────────────────────
  freeNewsPrefix: { en: "Great News! We now offer", fr: "Bonne Nouvelle ! Nous offrons désormais", rw: "Amakuru Meza! Ubu dutanga" },
  freeDeliveryHighlight: { en: "FREE DELIVERY", fr: "LIVRAISON GRATUITE", rw: "ITONJI KU BUNTU" },
  freeNewsSuffix: { en: "on all orders inside Kigali!", fr: "sur toutes les commandes à Kigali !", rw: "ku bitegeko byose biri muri Kigali!" },
  deliveryCalcTitle: { en: "Delivery Fee Calculator", fr: "Calculateur de Frais de Livraison", rw: "Igenzura ry'Amafaranga y'Itonji" },
  estimatedDeliveryLabel: { en: "Estimated Delivery", fr: "Livraison Estimée", rw: "Igihe cy'Itonji" },
  shippingCostLabel: { en: "Shipping Cost", fr: "Frais de Livraison", rw: "Amafaranga y'Itonji" },
  deliveryToPrefix: { en: "Delivery to", fr: "Livraison à", rw: "Itonji rigana" },
  deliveryToSuffix: { en: "Rates are subject to change based on order size.", fr: "Les tarifs peuvent varier selon la taille de la commande.", rw: "Ibiciro bishobora guhindagurika bitewe n'ubunini bw'ibisabwa." },
  selectLocationPrompt: { en: "Please select your location to see shipping details", fr: "Veuillez sélectionner votre emplacement pour voir les détails de livraison", rw: "Hitamo aho uri kugira ngo urebe amakuru y'itonji" },
  expressDeliveryTitle: { en: "Express Delivery", fr: "Livraison Express", rw: "Itonji Ryihuse" },
  expressDeliveryDesc: { en: "Need it faster? Contact us for express delivery options within Kigali for urgent orders.", fr: "Besoin d'être livré plus vite ? Contactez-nous pour des options de livraison express à Kigali pour les commandes urgentes.", rw: "Ukeneye vuba? Duhamagare kugira ngo tuguhe uburyo bw'itonji ryihuse muri Kigali ku bisabwa byihutirwa." },
  safeHandlingTitle: { en: "Safe Handling", fr: "Manipulation Sécurisée", rw: "Gufata mu Mutekano" },
  safeHandlingDesc: { en: "All items are carefully packed and handled to ensure they reach you in perfect condition.", fr: "Tous les articles sont soigneusement emballés et manipulés pour garantir qu'ils vous parviennent en parfait état.", rw: "Ibintu byose bipakirwa kandi bikitagwaho neza kugira ngo bigere iwawe bimeze neza." },
  logisticsSupportTitle: { en: "Logistics Support", fr: "Support Logistique", rw: "Ubufasha bw'Ubwikorezi" },
  callForDeliveryInfo: { en: "Call for Delivery Info", fr: "Appelez pour Infos Livraison", rw: "Hamagara ku Makuru y'Itonji" },
  whatsappLogistics: { en: "WhatsApp Logistics", fr: "WhatsApp Logistique", rw: "WhatsApp y'Ubwikorezi" },
  freeDeliveryKigaliTitle: { en: "Free Delivery in Kigali", fr: "Livraison Gratuite à Kigali", rw: "Itonji ku Buntu muri Kigali" },
  freeDeliveryKigaliDesc: { en: "To celebrate our community, we have removed shipping fees for all orders delivered within Kigali City. Orders outside Kigali are charged a distance-based delivery fee.", fr: "Pour célébrer notre communauté, nous avons supprimé les frais de livraison pour toutes les commandes livrées dans la ville de Kigali. Les commandes en dehors de Kigali sont facturées selon la distance.", rw: "Kugira ngo twishimire umuryango wacu, twavanyeho amafaranga y'itonji ku bisabwa byose bigezwa muri Umujyi wa Kigali. Ibisabwa biri hanze ya Kigali bishyurwa hakurikijwe intera." },

  // ── Order Tracking page ──────────────────────────────────────────────────
  trackOrderDesc: { en: "Enter your Order ID to see the current status of your delivery.", fr: "Entrez votre identifiant de commande pour voir le statut actuel de votre livraison.", rw: "Andika nimero y'itegeko ryawe kugira ngo urebe uko rigeze." },
  orderIdPlaceholderSuffix: { en: "(e.g. ORD-XXXXXX)", fr: "(ex. ORD-XXXXXX)", rw: "(urugero ORD-XXXXXX)" },
  orderInfoTitle: { en: "Order Info", fr: "Infos Commande", rw: "Amakuru y'Itegeko" },
  deliveryToTitle: { en: "Delivery To", fr: "Livraison à", rw: "Itonji rigenewe" },
  orderNotFoundTitle: { en: "Order not found", fr: "Commande introuvable", rw: "Itegeko ntiryabonetse" },
  orderNotFoundDesc: { en: "Please check your Order ID and try again.", fr: "Veuillez vérifier votre identifiant de commande et réessayer.", rw: "Genzura nimero y'itegeko ryawe hanyuma ongere ugerageze." },

  // ── Product detail / Shop / Product card ────────────────────────────────
  productNotFoundTitle: { en: "Product not found", fr: "Produit introuvable", rw: "Igicuruzwa ntikibonetse" },
  backToShopBtn: { en: "Back to Shop", fr: "Retour à la Boutique", rw: "Subira ku Iduka" },
  saleLabel: { en: "Sale", fr: "Solde", rw: "Igurishwa" },
  reviewsCount: { en: "(12+ reviews)", fr: "(12+ avis)", rw: "(ibitekerezo 12+)" },
  descriptionTitle: { en: "Description", fr: "Description", rw: "Ibisobanuro" },
  specificationsTitle: { en: "Specifications", fr: "Spécifications", rw: "Ibiranga Igicuruzwa" },
  fastDelivery24h: { en: "24h in Kigali", fr: "24h à Kigali", rw: "Amasaha 24 muri Kigali" },
  securePaymentProtected: { en: "100% Protected", fr: "100% Protégé", rw: "100% Birinzwe" },
  easyReturnsTitle: { en: "Easy Returns", fr: "Retours Faciles", rw: "Gusubiza Byoroshye" },
  easyReturns7Days: { en: "7 Days Policy", fr: "Politique de 7 Jours", rw: "Iminsi 7 y'Igihe" },
  pleaseSelectPrefix: { en: "Please select", fr: "Veuillez sélectionner", rw: "Hitamo" },
  addedToCartSuffix: { en: "added to cart!", fr: "ajouté au panier !", rw: "byashyizwe mu ikarita!" },
  showingProductsPrefix: { en: "Showing", fr: "Affichage de", rw: "Byerekana" },
  showingProductsSuffix: { en: "products", fr: "produits", rw: "ibicuruzwa" },
  filtersBtn: { en: "Filters", fr: "Filtres", rw: "Guhitamo" },
  priceRangeTitle: { en: "Price Range", fr: "Gamme de Prix", rw: "Urwego rw'Igiciro" },
  sortByTitle: { en: "Sort By", fr: "Trier Par", rw: "Ryungurura Ukurikije" },
  sortNewest: { en: "Newest First", fr: "Plus Récents", rw: "Ibishya Mbere" },
  sortPriceLow: { en: "Price: Low to High", fr: "Prix : Croissant", rw: "Igiciro: Gito kuri Kinini" },
  sortPriceHigh: { en: "Price: High to Low", fr: "Prix : Décroissant", rw: "Igiciro: Kinini kuri Gito" },
  sortTopRated: { en: "Top Rated", fr: "Mieux Notés", rw: "Byatoranyijwe Neza" },
  noProductsFoundTitle: { en: "No products found", fr: "Aucun produit trouvé", rw: "Nta gicuruzwa cyabonetse" },
  noProductsFoundDesc: { en: "Try adjusting your filters or search query", fr: "Essayez d'ajuster vos filtres ou votre recherche", rw: "Gerageza guhindura guhitamo cyangwa ijambo wifashishije" },
  clearFiltersBtn: { en: "Clear all filters", fr: "Effacer tous les filtres", rw: "Siba guhitamo byose" },
  newArrivalBadge: { en: "New Arrival", fr: "Nouveauté", rw: "Ibishya Bigeze" },
  viewProductBtn: { en: "View Product", fr: "Voir le Produit", rw: "Reba Igicuruzwa" },
  lowStockBadge: { en: "LOW STOCK", fr: "STOCK FAIBLE", rw: "BISIGAYE BIKE" },
  inStockLabel: { en: "IN STOCK", fr: "EN STOCK", rw: "BIRAHARI" },

  // ── Footer / Navbar ──────────────────────────────────────────────────────
  footerAbout: { en: "IWACU EU COMPANY ltd, We know the value of your money. Your trusted partner for quality fashion, electronics, and home essentials in Rwanda.", fr: "IWACU EU COMPANY ltd, nous connaissons la valeur de votre argent. Votre partenaire de confiance pour la mode, l'électronique et les articles essentiels de qualité au Rwanda.", rw: "IWACU EU COMPANY ltd, tuzi agaciro k'amafaranga yawe. Umufatanyabikorwa wizewe mu byambaro, ibikoresho bya elegitoroniki, n'ibikenewe mu rugo by'ubwiza mu Rwanda." },
  informationTitle: { en: "Information", fr: "Informations", rw: "Amakuru" },
  catFashion: { en: "Fashion", fr: "Mode", rw: "Imyambaro" },
  catShoes: { en: "Shoes", fr: "Chaussures", rw: "Inkweto" },
  catElectronics: { en: "Electronics", fr: "Électronique", rw: "Ibikoresho bya Elegitoroniki" },
  catHomeItems: { en: "Home Items", fr: "Articles Ménagers", rw: "Ibikoresho byo mu Rugo" },
  shoppingAlt: { en: "Shopping", fr: "Achats", rw: "Kuguraho" },
  googleMapTitle: { en: "Google Map", fr: "Carte Google", rw: "Ikarita ya Google" },
  aboutUsAlt: { en: "About Us", fr: "À Propos de Nous", rw: "Turi Bande" },
  privacyPolicyLink: { en: "Privacy Policy", fr: "Politique de Confidentialité", rw: "Politiki y'Ibanga" },
  termsLink: { en: "Terms & Conditions", fr: "Conditions Générales", rw: "Amabwiriza n'Amategeko" },
  loginAsAdmin: { en: "Login as Admin", fr: "Connexion Admin", rw: "Kwinjira nk'Umuyobozi" },
  allRightsReserved: { en: "All rights reserved.", fr: "Tous droits réservés.", rw: "Uburenganzira bwose burarindwa." },
  dashboardLabel: { en: "Dashboard", fr: "Tableau de Bord", rw: "Imbonerahamwe" },
  adminDashboardLabel: { en: "Admin Dashboard", fr: "Tableau de Bord Admin", rw: "Imbonerahamwe y'Umuyobozi" },
  languageLabel: { en: "Language", fr: "Langue", rw: "Ururimi" },
  currencyLabel: { en: "Currency", fr: "Devise", rw: "Ifaranga" },
  viewAllResultsPrefix: { en: "View all results for", fr: "Voir tous les résultats pour", rw: "Reba ibisubizo byose bya" },

  // ── Legal pages ──────────────────────────────────────────────────────────
  privacyTitle: { en: "Privacy Policy", fr: "Politique de Confidentialité", rw: "Politiki y'Ibanga" },
  privacyLastUpdated: { en: "Last updated: April 29, 2026", fr: "Dernière mise à jour : 29 avril 2026", rw: "Yavuguruwe bwa nyuma: Mata 29, 2026" },
  privacyIntro: { en: "we take your privacy seriously. This policy describes how we collect, use, and protect your personal information.", fr: "nous prenons votre confidentialité au sérieux. Cette politique décrit comment nous collectons, utilisons et protégeons vos informations personnelles.", rw: "twita ku ibanga ryawe. Iyi politiki isobanura uko dukusanya, dukoresha, kandi turinda amakuru yawe bwite." },
  privacyIntroPrefix: { en: "At", fr: "Chez", rw: "Kuri" },
  privacySection1Title: { en: "1. Information We Collect", fr: "1. Informations que Nous Collectons", rw: "1. Amakuru Dukusanya" },
  privacySection1Desc: { en: "We collect information you provide directly to us when you place an order, create an account, or contact us. This includes your name, email address, phone number, and delivery address.", fr: "Nous collectons les informations que vous nous fournissez directement lorsque vous passez une commande, créez un compte ou nous contactez. Cela inclut votre nom, adresse e-mail, numéro de téléphone et adresse de livraison.", rw: "Dukusanya amakuru utanga ubwawe igihe utumiza, ukora konti, cyangwa udutumiye ubutumwa. Harimo amazina yawe, aderesi ya imeri, numero ya telefoni, n'aho ubarizwa." },
  privacySection2Title: { en: "2. How We Use Your Information", fr: "2. Comment Nous Utilisons Vos Informations", rw: "2. Uko Dukoresha Amakuru Yawe" },
  privacySection2Desc: { en: "We use your information to process orders, communicate with you about your delivery, and provide customer support. We may also send you promotional offers if you subscribe to our newsletter.", fr: "Nous utilisons vos informations pour traiter les commandes, communiquer avec vous sur votre livraison et fournir un support client. Nous pouvons également vous envoyer des offres promotionnelles si vous vous abonnez à notre newsletter.", rw: "Dukoresha amakuru yawe mu gutunganya ibisabwa, kuvugana nawe ku byerekeye itonji ryawe, no gutanga ubufasha ku bakiriya. Dushobora no kukoherereza ibiciro byihariye niba wiyandikishije ku makuru yacu." },
  privacySection3Title: { en: "3. Data Security", fr: "3. Sécurité des Données", rw: "3. Umutekano w'Amakuru" },
  privacySection3Desc: { en: "We implement industry-standard security measures to protect your data. Your payment information is processed through secure third-party payment gateways.", fr: "Nous mettons en œuvre des mesures de sécurité conformes aux normes du secteur pour protéger vos données. Vos informations de paiement sont traitées via des passerelles de paiement tierces sécurisées.", rw: "Dukoresha uburyo bw'umutekano bukwiye kugira ngo turinde amakuru yawe. Amakuru y'ukwishyura atunganywa binyuze mu bufatanyacyubahiro bw'ukwishyura bwizewe." },
  privacySection4Title: { en: "4. Contact Us", fr: "4. Contactez-nous", rw: "4. Twandikire" },
  privacySection4Desc: { en: "If you have any questions about our privacy policy, please contact us at", fr: "Si vous avez des questions sur notre politique de confidentialité, veuillez nous contacter à", rw: "Niba ufite ikibazo ku byerekeye politiki yacu y'ibanga, twandikire kuri" },

  termsTitle: { en: "Terms & Conditions", fr: "Conditions Générales", rw: "Amabwiriza n'Amategeko" },
  termsLastUpdated: { en: "Last updated: March 28, 2026", fr: "Dernière mise à jour : 28 mars 2026", rw: "Yavuguruwe bwa nyuma: Werurwe 28, 2026" },
  termsSection1Title: { en: "1. Acceptance of Terms", fr: "1. Acceptation des Conditions", rw: "1. Kwemera Amabwiriza" },
  termsSection1Desc: { en: "By using our website, you agree to be bound by these terms and conditions. If you do not agree, please do not use our services.", fr: "En utilisant notre site web, vous acceptez d'être lié par ces conditions générales. Si vous n'êtes pas d'accord, veuillez ne pas utiliser nos services.", rw: "Mu gukoresha urubuga rwacu, wemeye kubahiriza aya mabwiriza n'amategeko. Niba utabyemera, ntukoreshe imirimo yacu." },
  termsSection2Title: { en: "2. Product Availability", fr: "2. Disponibilité des Produits", rw: "2. Kuboneka kw'Ibicuruzwa" },
  termsSection2Desc: { en: "All products are subject to availability. We reserve the right to limit the quantity of products we supply or to refuse any order.", fr: "Tous les produits sont soumis à disponibilité. Nous nous réservons le droit de limiter la quantité de produits fournis ou de refuser toute commande.", rw: "Ibicuruzwa byose bitangwa hakurikijwe uko bihari. Dufite uburenganzira bwo kugabanya umubare w'ibicuruzwa dutanga cyangwa kwanga ikintu cyasabwe." },
  termsSection3Title: { en: "3. Pricing and Payment", fr: "3. Tarification et Paiement", rw: "3. Ibiciro n'Ukwishyura" },
  termsSection3Desc: { en: "Prices are listed in Rwandan Francs (RWF). We accept Mobile Money, debit/credit cards, and cash on delivery in selected areas.", fr: "Les prix sont indiqués en Francs Rwandais (RWF). Nous acceptons Mobile Money, les cartes de débit/crédit et le paiement à la livraison dans certaines zones.", rw: "Ibiciro byanditse mu mafaranga y'u Rwanda (RWF). Twemera Mobile Money, amakarita y'ukwishyura, n'ukwishyura igihe ikintu kigejejwe ahantu hamwe na hamwe." },
  termsSection4Title: { en: "4. Delivery", fr: "4. Livraison", rw: "4. Itonji" },
  termsSection4Desc: { en: "We aim to deliver within the estimated timeframes, but we are not responsible for delays beyond our control.", fr: "Nous visons à livrer dans les délais estimés, mais nous ne sommes pas responsables des retards indépendants de notre volonté.", rw: "Dugerageza kugeza ibintu mu gihe cyagenwe, ariko ntidufite inshingano ku bitinze bidaturutse kuri twe." },
  termsSection5Title: { en: "5. Returns and Refunds", fr: "5. Retours et Remboursements", rw: "5. Gusubiza n'Kwishyurwa" },
  termsSection5Desc: { en: "Please refer to our Return Policy for details on how to return items and request refunds.", fr: "Veuillez consulter notre Politique de Retour pour plus de détails sur la façon de retourner des articles et de demander un remboursement.", rw: "Reba Politiki yacu yo Gusubiza kugira ngo umenye uko wasubiza ibintu no gusaba kwishyurwa." },

  // ── Contact page ─────────────────────────────────────────────────────────
  contactIntro: { en: "Have questions or need assistance? Our team is here to help you. Reach out to us through any of the following channels.", fr: "Vous avez des questions ou besoin d'aide ? Notre équipe est là pour vous aider. Contactez-nous par l'un des moyens suivants.", rw: "Ufite ibibazo cyangwa ukeneye ubufasha? Itsinda ryacu riri hano kugira ngo ribafashe. Twandikire binyuze mu buryo bukurikira." },
  sendMessageTitle: { en: "Send us a message", fr: "Envoyez-nous un message", rw: "Twoherereze ubutumwa" },
  nameLabel: { en: "Name", fr: "Nom", rw: "Amazina" },
  namePlaceholder: { en: "Your name", fr: "Votre nom", rw: "Amazina yawe" },
  emailLabel: { en: "Email", fr: "E-mail", rw: "Imeri" },
  emailPlaceholderShort: { en: "Your email", fr: "Votre e-mail", rw: "Imeri yawe" },
  subjectLabel: { en: "Subject", fr: "Sujet", rw: "Ikivugwaho" },
  subjectPlaceholder: { en: "How can we help?", fr: "Comment pouvons-nous vous aider ?", rw: "Twakugira iki?" },
  messageLabel: { en: "Message", fr: "Message", rw: "Ubutumwa" },
  messagePlaceholder: { en: "Your message...", fr: "Votre message...", rw: "Ubutumwa bwawe..." },
  sendingBtn: { en: "Sending...", fr: "Envoi en cours...", rw: "Kohereza..." },
  sendMessageBtn: { en: "Send Message", fr: "Envoyer le Message", rw: "Ohereza Ubutumwa" },
  contactSendSuccess: { en: "Message sent successfully! We will get back to you soon.", fr: "Message envoyé avec succès ! Nous vous répondrons bientôt.", rw: "Ubutumwa bwoherejwe neza! Tuzabasubiza vuba." },
  contactSendError: { en: "Failed to send message. Please try again.", fr: "Échec de l'envoi du message. Veuillez réessayer.", rw: "Kohereza ubutumwa byanze. Ongera ugerageze." },
  phoneWhatsappLabel: { en: "Phone & WhatsApp", fr: "Téléphone et WhatsApp", rw: "Telefoni na WhatsApp" },
  emailAddressLabel: { en: "Email Address", fr: "Adresse E-mail", rw: "Aderesi ya Imeri" },
  ourLocationLabel: { en: "Our Location", fr: "Notre Emplacement", rw: "Aho Turi" },
  workingHoursTitle: { en: "Working Hours", fr: "Heures d'Ouverture", rw: "Amasaha y'Akazi" },
  monSatHours: { en: "Mon - Sat: 8AM - 8PM", fr: "Lun - Sam : 8h - 20h", rw: "Kuwa Mbere - Gatandatu: 8AM - 8PM" },
  sunHours: { en: "Sun: 10AM - 4PM", fr: "Dim : 10h - 16h", rw: "Ku Cyumweru: 10AM - 4PM" },
};
