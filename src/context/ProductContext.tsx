import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { toast } from 'sonner';
import { Product, Order, CartItem, Variation, SiteSettings, HeroSlide, TeamMember, Testimonial, Employee, SalaryPayment, EmployeePaymentRecord, OtherExpense, LocalizedText } from '../types';
export type { Product, Order, CartItem, Variation, SiteSettings, HeroSlide, TeamMember, Testimonial, Employee, SalaryPayment, EmployeePaymentRecord, OtherExpense };
import { CATEGORIES, HERO_SLIDES, TEAM_MEMBERS, DEMO_TESTIMONIALS } from '../constants';
import { useAuth, getAuthHeader } from './AuthContext';

// API base URL — set VITE_API_URL in .env for production; empty string works with the dev proxy.
const API_BASE = import.meta.env.VITE_API_URL ?? '';

// Normalizes a title/description/message field that may still be a plain string
// (data saved before multi-language support existed) into the {en,fr,rw} shape.
function toLocalizedField(value: any): LocalizedText {
  if (value && typeof value === 'object') return value;
  const s = value ?? '';
  return { en: s, fr: s, rw: s };
}

interface Analytics {
  totalVisitors: number;
  dailyTraffic: { date: string; count: number }[];
  pageViews: { path: string; count: number }[];
  activeUsers: number;
}

export interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  type: 'order' | 'product' | 'user' | 'system';
  adminName?: string;
}

interface ShopContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  categories: string[];
  addCategory: (category: string) => void;
  updateCategory: (oldCategory: string, newCategory: string) => void;
  deleteCategory: (category: string) => void;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (order: Order, status: Order['status'], paymentStatus?: Order['paymentStatus']) => void;
  updateOrder: (order: Order) => void;
  deleteOrder: (id: string) => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, variations?: Variation[]) => void;
  removeFromCart: (productId: string, variationIds?: string[]) => void;
  updateQuantity: (productId: string, quantity: number, variationIds?: string[]) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'createdAt' | 'read'>) => void;
  markMessageAsRead: (message: Message) => void;
  deleteMessage: (id: string) => void;
  replyToMessage: (id: string, reply: string) => void;
  analytics: Analytics;
  activityLog: ActivityLog[];
  trackPageView: (path: string) => void;
  siteSettings: SiteSettings;
  siteSettingsLoaded: boolean;
  updateSiteSettings: (settings: SiteSettings) => void;
  employees: Employee[];
  addEmployee: (employee: Employee) => Promise<void>;
  updateEmployee: (employee: Employee) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  fetchEmployeePayments: (employeeId: string, range?: { from?: string; to?: string }) => Promise<SalaryPayment[]>;
  addEmployeePayment: (employeeId: string, payment: Omit<SalaryPayment, 'id'>) => Promise<SalaryPayment>;
  updateEmployeePayment: (employeeId: string, paymentId: string, updates: Partial<Omit<SalaryPayment, 'id'>>) => Promise<SalaryPayment>;
  deleteEmployeePayment: (employeeId: string, paymentId: string) => Promise<void>;
  fetchPayrollSummary: (range?: { from?: string; to?: string }) => Promise<{ totalPaid: number; count: number }>;
  fetchAllEmployeePayments: (range?: { from?: string; to?: string }) => Promise<EmployeePaymentRecord[]>;
  otherExpenses: OtherExpense[];
  addOtherExpense: (expense: OtherExpense) => Promise<void>;
  updateOtherExpense: (expense: OtherExpense) => Promise<void>;
  deleteOtherExpense: (id: string) => Promise<void>;
  addActivity: (action: string, type: ActivityLog['type'], adminName?: string) => void;
  isLoading: boolean;
  uploadImage: (file: File) => Promise<string>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
  reply?: string;
  repliedAt?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'stock' | 'system';
  createdAt: string;
  read: boolean;
}

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin, isSuperAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(CATEGORIES);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', title: 'Welcome Admin', message: 'Welcome to your new dashboard!', type: 'system', createdAt: new Date().toISOString(), read: false }
  ]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', name: 'John Doe', email: 'john@example.com', subject: 'Product Inquiry', message: 'Is the Smart LED TV still in stock?', createdAt: new Date().toISOString(), read: false }
  ]);
  const [analytics, setAnalytics] = useState<Analytics>({
    totalVisitors: 0,
    dailyTraffic: [],
    pageViews: [],
    activeUsers: 0
  });
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    logoUrl: '/logo.png',
    heroSlides: HERO_SLIDES,
    teamMembers: TEAM_MEMBERS,
    testimonials: DEMO_TESTIMONIALS
  });

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [otherExpenses, setOtherExpenses] = useState<OtherExpense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // True only once a real /api/site-settings response has been applied to `siteSettings`.
  // The admin "Save Changes" button is gated on this — if the initial fetch failed (e.g.
  // a Render cold start), `siteSettings` is still sitting at its hardcoded HERO_SLIDES/
  // TEAM_MEMBERS/DEMO_TESTIMONIALS defaults, and saving in that state would overwrite the
  // real data in the database with those defaults.
  const [siteSettingsLoaded, setSiteSettingsLoaded] = useState(false);

  // Mirrors of `products`/`cart` for use inside cart callbacks. Cart actions need the
  // latest committed stock synchronously (to compute + persist the new value) without
  // going through a setState updater — updater functions run under React StrictMode's
  // double-invoke check and must stay pure (no fetch calls inside them), and their
  // execution isn't guaranteed to happen before the next line of code runs anyway.
  const productsRef = useRef<Product[]>([]);
  const cartRef = useRef<CartItem[]>([]);
  useEffect(() => { productsRef.current = products; }, [products]);
  useEffect(() => { cartRef.current = cart; }, [cart]);

  // ── Initial data load (parallel fetches to each endpoint) ───────────────
  // Products endpoint depends on role: admins get the full list (cost, offline sales
  // included); everyone else gets the public list (cost stripped, online+published only).
  // Re-runs on login/logout so the right dataset loads immediately.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsUrl = isAdmin ? `${API_BASE}/api/products/admin` : `${API_BASE}/api/products`;
        const [
          productsRes, categoriesRes, ordersRes, notificationsRes,
          messagesRes, analyticsRes, activityLogRes, siteSettingsRes, employeesRes, otherExpensesRes,
        ] = await Promise.allSettled([
          fetch(productsUrl).then(r => r.ok ? r.json() : null),
          fetch(`${API_BASE}/api/categories`).then(r => r.ok ? r.json() : null),
          fetch(`${API_BASE}/api/orders`).then(r => r.ok ? r.json() : null),
          fetch(`${API_BASE}/api/notifications`).then(r => r.ok ? r.json() : null),
          fetch(`${API_BASE}/api/messages`).then(r => r.ok ? r.json() : null),
          fetch(`${API_BASE}/api/analytics`).then(r => r.ok ? r.json() : null),
          fetch(`${API_BASE}/api/activity-log`).then(r => r.ok ? r.json() : null),
          fetch(`${API_BASE}/api/site-settings`).then(r => r.ok ? r.json() : null),
          // Super-admin only — regular admins never see Employees/Other Expenses.
          isSuperAdmin
            ? fetch(`${API_BASE}/api/employees`, { headers: getAuthHeader() }).then(r => r.ok ? r.json() : null)
            : Promise.resolve(null),
          isSuperAdmin
            ? fetch(`${API_BASE}/api/other-expenses`, { headers: getAuthHeader() }).then(r => r.ok ? r.json() : null)
            : Promise.resolve(null),
        ]);

        if (productsRes.status === 'fulfilled' && Array.isArray(productsRes.value)) {
          const data: Product[] = productsRes.value;
          setProducts(data.map(p => ({ ...p, title: toLocalizedField(p.title), description: toLocalizedField(p.description) })));
        }

        if (categoriesRes.status === 'fulfilled' && Array.isArray(categoriesRes.value)) {
          setCategories(categoriesRes.value);
        }

        if (ordersRes.status === 'fulfilled' && ordersRes.value?.length) {
          setOrders(ordersRes.value);
        }

        if (notificationsRes.status === 'fulfilled' && notificationsRes.value?.length) {
          setNotifications(notificationsRes.value);
        }

        if (messagesRes.status === 'fulfilled' && messagesRes.value?.length) {
          setMessages(messagesRes.value);
        }

        if (analyticsRes.status === 'fulfilled' && analyticsRes.value) {
          const a = analyticsRes.value;
          setAnalytics({
            totalVisitors: a.totalVisitors || 0,
            dailyTraffic: a.dailyTraffic || [],
            pageViews: a.pageViews || [],
            activeUsers: a.activeUsers || 0,
          });
        }

        if (activityLogRes.status === 'fulfilled' && activityLogRes.value?.length) {
          setActivityLog(activityLogRes.value);
        }

        if (siteSettingsRes.status === 'fulfilled' && siteSettingsRes.value) {
          const ss = siteSettingsRes.value;
          const migratedSettings = {
            ...ss,
            heroSlides: (Array.isArray(ss.heroSlides) ? ss.heroSlides : HERO_SLIDES).map((s: any) => ({
              ...s,
              title: typeof s.title === 'string' ? { en: s.title, fr: s.title, rw: s.title } : s.title,
              subtitle: typeof s.subtitle === 'string' ? { en: s.subtitle, fr: s.subtitle, rw: s.subtitle } : s.subtitle,
              cta: typeof s.cta === 'string' ? { en: s.cta, fr: s.cta, rw: s.cta } : s.cta,
            })),
            teamMembers: (Array.isArray(ss.teamMembers) ? ss.teamMembers : TEAM_MEMBERS).map((m: any) => ({
              ...m,
              role: (m.role && typeof m.role === 'object')
                ? m.role
                : typeof m.role === 'string'
                  ? { en: m.role, fr: m.role, rw: m.role }
                  : { en: '', fr: '', rw: '' },
              slogan: (m.slogan && typeof m.slogan === 'object')
                ? m.slogan
                : typeof m.slogan === 'string'
                  ? { en: m.slogan, fr: m.slogan, rw: m.slogan }
                  : { en: '', fr: '', rw: '' },
              phone: m.phone ?? '',
              socials: m.socials ?? {},
            })),
            testimonials: (Array.isArray(ss.testimonials) ? ss.testimonials : DEMO_TESTIMONIALS).map((tm: any) => ({
              ...tm,
              message: toLocalizedField(tm.message),
            })),
          };
          setSiteSettings(migratedSettings);
          setSiteSettingsLoaded(true);
        }

        if (employeesRes.status === 'fulfilled' && Array.isArray(employeesRes.value)) {
          setEmployees(employeesRes.value);
        }

        if (otherExpensesRes.status === 'fulfilled' && Array.isArray(otherExpensesRes.value)) {
          setOtherExpenses(otherExpensesRes.value);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAdmin, isSuperAdmin]);

  // ── Persistence ───────────────────────────────────────────────────────────
  // There is deliberately no "watch local state, debounce, PUT the whole array/object"
  // effect here anymore. That pattern silently overwrote real DB data whenever local
  // state happened to still be at its hardcoded fallback — e.g. the initial
  // /api/site-settings fetch failing during a Render free-tier cold start left
  // `siteSettings` at the hardcoded HERO_SLIDES/TEAM_MEMBERS/DEMO_TESTIMONIALS defaults,
  // and the old effect then pushed those defaults back over the admin's saved hero
  // slides — no admin action required, just a visitor loading the site at a bad moment.
  // Every mutation below now persists explicitly, at the moment of the real user action,
  // via a targeted POST/PUT/DELETE — never a full-array overwrite built from state that
  // might still be a never-loaded default.

  // ── Image upload ─────────────────────────────────────────────────────────
  const uploadImage = useCallback(async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await fetch(`${API_BASE}/api/upload`, { method: 'POST', body: formData });
    if (!response.ok) throw new Error('Upload failed');
    const data = await response.json();
    return data.url;
  }, []);

  // ── Activity helper ───────────────────────────────────────────────────────
  const addActivity = useCallback((action: string, type: ActivityLog['type'], adminName?: string) => {
    const newLog: ActivityLog = {
      id: Math.random().toString(36).substr(2, 9),
      action,
      timestamp: new Date().toISOString(),
      type,
      adminName: adminName || 'System'
    };
    setActivityLog(prev => [newLog, ...prev.slice(0, 49)]);
    fetch(`${API_BASE}/api/activity-log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLog),
    }).catch(console.error);
  }, []);

  // ── Analytics ─────────────────────────────────────────────────────────────
  // Persisted via a dedicated atomic-increment endpoint (not a full-object PUT) — the
  // server computes the new totals from whatever is already in the DB, so a client whose
  // local `analytics` state never loaded real data (fetch failed, still at the {0,...}
  // default) can never stomp the real counts the way overwriting with local state would.
  const trackPageView = useCallback((path: string) => {
    setAnalytics(prev => {
      const pageViews = prev.pageViews || [];
      const existing = pageViews.find(p => p.path === path);
      const newPageViews = existing
        ? pageViews.map(p => p.path === path ? { ...p, count: (p.count || 0) + 1 } : p)
        : [...pageViews, { path, count: 1 }];
      return {
        ...prev,
        totalVisitors: (prev.totalVisitors || 0) + 1,
        pageViews: newPageViews
      };
    });
    fetch(`${API_BASE}/api/analytics/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path }),
    }).catch(console.error);
  }, []);

  // ── Products ──────────────────────────────────────────────────────────────
  // Both create and update persist explicitly and immediately (POST / PUT :id) instead of
  // relying solely on the debounced bulk PUT below. The bulk PUT upserts every product in
  // local state in one transaction — a bad row anywhere else in that array rolls the whole
  // batch back, which can silently drop a brand-new product's INSERT. A dedicated request
  // guarantees this product's own published/salesType are stored right away.
  const addProduct = useCallback((product: Product) => {
    setProducts(prev => [...prev, product]);
    addActivity(`New product added: ${product.title.en}`, 'product');
    fetch(`${API_BASE}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    })
      .then(r => { if (!r.ok) throw new Error('Failed to save product'); })
      .catch(err => {
        console.error(err);
        toast.error('Failed to save the new product to the server — please retry.');
      });
  }, [addActivity]);

  const updateProduct = useCallback((product: Product) => {
    setProducts(prev => prev.map(p => p.id === product.id ? product : p));
    addActivity(`Product updated: ${product.title.en}`, 'product');
    fetch(`${API_BASE}/api/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    })
      .then(r => { if (!r.ok) throw new Error('Failed to update product'); })
      .catch(err => {
        console.error(err);
        toast.error('Failed to save product changes to the server — please retry.');
      });
  }, [addActivity]);

  const deleteProduct = useCallback((id: string) => {
    // Looked up via the ref (not inside the setProducts updater) — addActivity now
    // fires a network request, and updater functions must stay side-effect-free since
    // React StrictMode double-invokes them in dev to catch exactly this kind of impurity.
    const product = productsRef.current.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    if (product) addActivity(`Product deleted: ${product.title.en}`, 'product');
    fetch(`${API_BASE}/api/products/${id}`, { method: 'DELETE' }).catch(console.error);
  }, [addActivity]);

  // ── Categories ────────────────────────────────────────────────────────────
  // Each mutation persists explicitly and immediately (POST/PUT/DELETE) instead of
  // relying on a debounced bulk sync — the old bulk PUT replaced the whole table
  // (DELETE all + re-INSERT all) from a snapshot that could go stale between renders,
  // silently dropping edits on reload. A dedicated request per mutation guarantees
  // the change is actually in Postgres before we call it done.
  const addCategory = useCallback((category: string) => {
    if (categories.includes(category)) return;
    setCategories(prev => prev.includes(category) ? prev : [...prev, category]);
    addActivity(`New category added: ${category}`, 'system');
    fetch(`${API_BASE}/api/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: category }),
    })
      .then(r => { if (!r.ok) throw new Error('Failed to save category'); })
      .catch(err => {
        console.error(err);
        toast.error('Failed to save the new category to the server — please retry.');
      });
  }, [categories, addActivity]);

  const deleteCategory = useCallback((category: string) => {
    setCategories(prev => {
      const filtered = prev.filter(c => c !== category);
      return filtered.includes('Uncategorized') ? filtered : [...filtered, 'Uncategorized'];
    });
    setProducts(prev => prev.map(p => p.category === category ? { ...p, category: 'Uncategorized' } : p));
    addActivity(`Category deleted: ${category}`, 'system');
    fetch(`${API_BASE}/api/categories/${encodeURIComponent(category)}`, { method: 'DELETE' })
      .then(r => { if (!r.ok) throw new Error('Failed to delete category'); })
      .catch(err => {
        console.error(err);
        toast.error('Failed to delete the category on the server — please retry.');
      });
    fetch(`${API_BASE}/api/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Uncategorized' }),
    }).catch(console.error);
  }, [addActivity]);

  const updateCategory = useCallback((oldCategory: string, newCategory: string) => {
    setCategories(prev => {
      if (prev.includes(newCategory) && oldCategory !== newCategory) {
        return prev.filter(c => c !== oldCategory);
      }
      return prev.map(c => c === oldCategory ? newCategory : c);
    });
    setProducts(prev => prev.map(p => p.category === oldCategory ? { ...p, category: newCategory } : p));
    addActivity(`Category updated: ${oldCategory} to ${newCategory}`, 'system');
    fetch(`${API_BASE}/api/categories/${encodeURIComponent(oldCategory)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCategory }),
    })
      .then(r => { if (!r.ok) throw new Error('Failed to rename category'); })
      .catch(err => {
        console.error(err);
        toast.error('Failed to save the category rename to the server — please retry.');
      });
  }, [addActivity]);

  // ── Notifications ─────────────────────────────────────────────────────────
  const addNotification = useCallback((notif: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotif: Notification = {
      ...notif,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    fetch(`${API_BASE}/api/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNotif),
    }).catch(console.error);
  }, []);

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    // Only flips `read` server-side — safe to send as a partial body (see route).
    fetch(`${API_BASE}/api/notifications/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read: true }),
    }).catch(console.error);
  }, []);

  // ── Messages ──────────────────────────────────────────────────────────────
  const addMessage = useCallback((msg: Omit<Message, 'id' | 'createdAt' | 'read'>) => {
    const newMessage: Message = {
      ...msg,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      read: false
    };
    setMessages(prev => [newMessage, ...prev]);
    addNotification({
      title: 'New Message Received',
      message: `New message from ${msg.name}: ${msg.subject}`,
      type: 'system'
    });
    addActivity(`New message from ${msg.name}`, 'system');
    fetch(`${API_BASE}/api/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMessage),
    }).catch(console.error);
  }, [addNotification, addActivity]);

  // Takes the full message (not just an id) — PUT /api/messages/:id sets read/reply/
  // repliedAt from the body, so sending only {read:true} would null out an existing reply.
  const markMessageAsRead = useCallback((message: Message) => {
    setMessages(prev => prev.map(m => m.id === message.id ? { ...m, read: true } : m));
    fetch(`${API_BASE}/api/messages/${message.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read: true, reply: message.reply ?? null, repliedAt: message.repliedAt ?? null }),
    }).catch(console.error);
  }, []);

  const deleteMessage = useCallback((id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
    addActivity(`Deleted message ${id}`, 'system');
    fetch(`${API_BASE}/api/messages/${id}`, { method: 'DELETE' }).catch(console.error);
  }, [addActivity]);

  const replyToMessage = useCallback((id: string, reply: string) => {
    const repliedAt = new Date().toISOString();
    setMessages(prev => prev.map(m => m.id === id ? {
      ...m,
      reply,
      repliedAt,
      read: true
    } : m));
    addActivity(`Replied to message from ${id}`, 'system');
    fetch(`${API_BASE}/api/messages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read: true, reply, repliedAt }),
    }).catch(console.error);
  }, [addActivity]);

  // ── Cart (stock management — exact same logic as before) ──────────────────
  // Stock is read from `productsRef`/`cartRef` and the resulting product is persisted
  // via a plain top-level fetch (not from inside a setState updater — see the
  // deleteProduct comment above for why: StrictMode double-invokes updater functions,
  // and firing a network request from one would double-send it in dev).
  const addToCart = useCallback((product: Product, quantity: number = 1, variations?: Variation[]) => {
    const currentProduct = productsRef.current.find(p => p.id === product.id);
    // Matches the pre-existing behavior: an insufficient-stock toast doesn't block the
    // item from being added to the cart, it only skips the stock decrement/persist.
    if (currentProduct) {
      let updatedProduct: Product | null = null;
      if (variations && variations.length > 0) {
        const hasStock = variations.every(v => {
          const currentV = currentProduct.variations?.find(cv => cv.id === v.id);
          return currentV && currentV.stock >= quantity;
        });
        if (!hasStock) {
          toast.error('Not enough stock available for some selected variations');
        } else {
          updatedProduct = {
            ...currentProduct,
            variations: currentProduct.variations?.map(v =>
              variations.some(sv => sv.id === v.id) ? { ...v, stock: v.stock - quantity } : v
            )
          };
        }
      } else {
        if (currentProduct.stock < quantity) {
          toast.error('Not enough stock available');
        } else {
          updatedProduct = { ...currentProduct, stock: currentProduct.stock - quantity };
        }
      }

      if (updatedProduct) {
        const toSave = updatedProduct;
        setProducts(prev => prev.map(p => p.id === product.id ? toSave : p));
        fetch(`${API_BASE}/api/products/${toSave.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(toSave),
        }).catch(console.error);
      }
    }

    setCart(prev => {
      const variationIds = (variations || []).map(v => v.id).sort().join(',');
      const existing = prev.find(item => {
        const itemVarIds = (item.selectedVariations || []).map(v => v.id).sort().join(',');
        return item.id === product.id && itemVarIds === variationIds;
      });
      if (existing) {
        return prev.map(item => {
          const itemVarIds = (item.selectedVariations || []).map(v => v.id).sort().join(',');
          return (item.id === product.id && itemVarIds === variationIds)
            ? { ...item, quantity: item.quantity + quantity }
            : item;
        });
      }
      return [...prev, {
        ...product,
        quantity,
        selectedVariations: variations,
        selectedVariation: variations?.[0]
      }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string, variationIds?: string[]) => {
    const vIdString = (variationIds || []).sort().join(',');
    const cartItem = cartRef.current.find(item => {
      const itemVIds = (item.selectedVariations || []).map(v => v.id).sort().join(',');
      return item.id === productId && itemVIds === vIdString;
    });

    if (cartItem) {
      const currentProduct = productsRef.current.find(p => p.id === productId);
      if (currentProduct) {
        const updatedProduct: Product = (variationIds && variationIds.length > 0)
          ? {
              ...currentProduct,
              variations: currentProduct.variations?.map(v =>
                variationIds.includes(v.id) ? { ...v, stock: v.stock + cartItem.quantity } : v
              )
            }
          : { ...currentProduct, stock: currentProduct.stock + cartItem.quantity };
        setProducts(prev => prev.map(p => p.id === productId ? updatedProduct : p));
        fetch(`${API_BASE}/api/products/${updatedProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProduct),
        }).catch(console.error);
      }
    }

    setCart(prevCart => prevCart.filter(item => {
      const itemVIds = (item.selectedVariations || []).map(v => v.id).sort().join(',');
      return !(item.id === productId && itemVIds === vIdString);
    }));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number, variationIds?: string[]) => {
    if (quantity < 1) return;
    const vIdString = (variationIds || []).sort().join(',');
    const cartItem = cartRef.current.find(item => {
      const itemVIds = (item.selectedVariations || []).map(v => v.id).sort().join(',');
      return item.id === productId && itemVIds === vIdString;
    });
    if (!cartItem) return;

    const diff = quantity - cartItem.quantity;
    if (diff === 0) return;

    const product = productsRef.current.find(p => p.id === productId);
    // Same "toast but don't block" behavior as addToCart — the cart quantity always
    // updates below; an insufficient-stock warning only skips the stock persist.
    if (product) {
      let updatedProduct: Product | null = null;
      if (variationIds && variationIds.length > 0) {
        const hasStock = variationIds.every(id => {
          const v = product.variations?.find(v => v.id === id);
          return v && (diff < 0 || v.stock >= diff);
        });
        if (!hasStock) {
          toast.error('Not enough stock available for some selected variations');
        } else {
          updatedProduct = {
            ...product,
            variations: product.variations?.map(v =>
              variationIds.includes(v.id) ? { ...v, stock: v.stock - diff } : v
            )
          };
        }
      } else {
        if (diff > 0 && product.stock < diff) {
          toast.error('Not enough stock available');
        } else {
          updatedProduct = { ...product, stock: product.stock - diff };
        }
      }

      if (updatedProduct) {
        const toSave = updatedProduct;
        setProducts(prev => prev.map(p => p.id === productId ? toSave : p));
        fetch(`${API_BASE}/api/products/${toSave.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(toSave),
        }).catch(console.error);
      }
    }

    setCart(prevCart => prevCart.map(item => {
      const itemVIds = (item.selectedVariations || []).map(v => v.id).sort().join(',');
      return (item.id === productId && itemVIds === vIdString)
        ? { ...item, quantity }
        : item;
    }));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  // ── Orders ────────────────────────────────────────────────────────────────
  const addOrder = useCallback((order: Order) => {
    setOrders(prev => [order, ...prev]);
    addNotification({
      title: 'New Order Received',
      message: `Order ${order.id} has been placed by ${order.customerName}.`,
      type: 'order'
    });
    addActivity(`New order placed: ${order.id}`, 'order');
    fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    })
      .then(r => { if (!r.ok) throw new Error('Failed to save order'); })
      .catch(err => {
        console.error(err);
        toast.error('Your order could not be saved to our system — please contact us with your order ID.');
      });
  }, [addNotification, addActivity]);

  // Takes the full current order (not just an id) — PUT /api/orders/:id replaces every
  // column, so sending only {status} would null out customerName/items/total/etc.
  const updateOrderStatus = useCallback((order: Order, status: Order['status'], paymentStatus?: Order['paymentStatus']) => {
    const updatedOrder: Order = { ...order, status, paymentStatus: paymentStatus || order.paymentStatus };
    setOrders(prev => prev.map(o => o.id === order.id ? updatedOrder : o));
    addActivity(`Order ${order.id} status updated to ${status}`, 'order');
    fetch(`${API_BASE}/api/orders/${order.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedOrder),
    }).catch(console.error);
  }, [addActivity]);

  const updateOrder = useCallback((updatedOrder: Order) => {
    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    addActivity(`Order ${updatedOrder.id} updated`, 'order');
    fetch(`${API_BASE}/api/orders/${updatedOrder.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedOrder),
    }).catch(console.error);
  }, [addActivity]);

  const deleteOrder = useCallback((id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
    addActivity(`Order ${id} deleted`, 'order');
    fetch(`${API_BASE}/api/orders/${id}`, { method: 'DELETE' }).catch(console.error);
  }, [addActivity]);

  // ── Site settings ─────────────────────────────────────────────────────────
  // Persistence itself is handled by SiteContentManager's explicit "Save Changes" PUT
  // (src/pages/AdminDashboard.tsx) — this just updates local state to match after that
  // save succeeds, plus the activity log entry. Nothing here writes to the backend.
  const updateSiteSettings = useCallback((settings: SiteSettings) => {
    setSiteSettings(settings);
    addActivity('Site settings updated', 'system');
  }, [addActivity]);

  // ── Employees ─────────────────────────────────────────────────────────────
  const addEmployee = useCallback(async (employee: Employee) => {
    const res = await fetch(`${API_BASE}/api/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(employee),
    });
    if (!res.ok) throw new Error('Failed to add employee');
    const created: Employee = await res.json();
    setEmployees(prev => [created, ...prev]);
  }, []);

  const updateEmployee = useCallback(async (employee: Employee) => {
    const res = await fetch(`${API_BASE}/api/employees/${employee.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(employee),
    });
    if (!res.ok) throw new Error('Failed to update employee');
    const updated: Employee = await res.json();
    setEmployees(prev => prev.map(e => e.id === updated.id ? updated : e));
  }, []);

  const deleteEmployee = useCallback(async (id: string) => {
    const res = await fetch(`${API_BASE}/api/employees/${id}`, { method: 'DELETE', headers: getAuthHeader() });
    if (!res.ok) throw new Error('Failed to delete employee');
    setEmployees(prev => prev.filter(e => e.id !== id));
  }, []);

  // Latest-payment summaries on `employees` are computed server-side; re-fetch the
  // lean list after any payment mutation instead of duplicating that logic client-side.
  const refreshEmployees = useCallback(async () => {
    const res = await fetch(`${API_BASE}/api/employees`, { headers: getAuthHeader() });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) setEmployees(data);
    }
  }, []);

  const fetchEmployeePayments = useCallback(async (employeeId: string, range?: { from?: string; to?: string }): Promise<SalaryPayment[]> => {
    const params = new URLSearchParams();
    if (range?.from) params.set('from', range.from);
    if (range?.to) params.set('to', range.to);
    const qs = params.toString();
    const res = await fetch(`${API_BASE}/api/employees/${employeeId}/payments${qs ? `?${qs}` : ''}`, { headers: getAuthHeader() });
    if (!res.ok) throw new Error('Failed to fetch payments');
    return res.json();
  }, []);

  const addEmployeePayment = useCallback(async (employeeId: string, payment: Omit<SalaryPayment, 'id'>): Promise<SalaryPayment> => {
    const res = await fetch(`${API_BASE}/api/employees/${employeeId}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(payment),
    });
    if (!res.ok) throw new Error('Failed to add payment');
    const created = await res.json();
    await refreshEmployees();
    return created;
  }, [refreshEmployees]);

  const updateEmployeePayment = useCallback(async (employeeId: string, paymentId: string, updates: Partial<Omit<SalaryPayment, 'id'>>): Promise<SalaryPayment> => {
    const res = await fetch(`${API_BASE}/api/employees/${employeeId}/payments/${paymentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update payment');
    const updated = await res.json();
    await refreshEmployees();
    return updated;
  }, [refreshEmployees]);

  const deleteEmployeePayment = useCallback(async (employeeId: string, paymentId: string) => {
    const res = await fetch(`${API_BASE}/api/employees/${employeeId}/payments/${paymentId}`, { method: 'DELETE', headers: getAuthHeader() });
    if (!res.ok) throw new Error('Failed to delete payment');
    await refreshEmployees();
  }, [refreshEmployees]);

  const fetchPayrollSummary = useCallback(async (range?: { from?: string; to?: string }): Promise<{ totalPaid: number; count: number }> => {
    const params = new URLSearchParams();
    if (range?.from) params.set('from', range.from);
    if (range?.to) params.set('to', range.to);
    const qs = params.toString();
    const res = await fetch(`${API_BASE}/api/employees/payments/summary${qs ? `?${qs}` : ''}`, { headers: getAuthHeader() });
    if (!res.ok) throw new Error('Failed to fetch payroll summary');
    return res.json();
  }, []);

  const fetchAllEmployeePayments = useCallback(async (range?: { from?: string; to?: string }): Promise<EmployeePaymentRecord[]> => {
    const params = new URLSearchParams();
    if (range?.from) params.set('from', range.from);
    if (range?.to) params.set('to', range.to);
    const qs = params.toString();
    const res = await fetch(`${API_BASE}/api/employees/payments${qs ? `?${qs}` : ''}`, { headers: getAuthHeader() });
    if (!res.ok) throw new Error('Failed to fetch payments');
    return res.json();
  }, []);

  // ── Other Expenses ────────────────────────────────────────────────────────
  const addOtherExpense = useCallback(async (expense: OtherExpense) => {
    const res = await fetch(`${API_BASE}/api/other-expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(expense),
    });
    if (!res.ok) throw new Error('Failed to add expense');
    const created: OtherExpense = await res.json();
    setOtherExpenses(prev => [created, ...prev]);
  }, []);

  const updateOtherExpense = useCallback(async (expense: OtherExpense) => {
    const res = await fetch(`${API_BASE}/api/other-expenses/${expense.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(expense),
    });
    if (!res.ok) throw new Error('Failed to update expense');
    const updated: OtherExpense = await res.json();
    setOtherExpenses(prev => prev.map(e => e.id === updated.id ? updated : e));
  }, []);

  const deleteOtherExpense = useCallback(async (id: string) => {
    const res = await fetch(`${API_BASE}/api/other-expenses/${id}`, { method: 'DELETE', headers: getAuthHeader() });
    if (!res.ok) throw new Error('Failed to delete expense');
    setOtherExpenses(prev => prev.filter(e => e.id !== id));
  }, []);

  // ── Derived cart values ───────────────────────────────────────────────────
  const cartTotal = cart.reduce((sum, item) => {
    const price = item.price + (item.selectedVariation?.priceModifier || 0);
    return sum + price * item.quantity;
  }, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const value = useMemo(() => ({
    products, addProduct, updateProduct, deleteProduct,
    categories, addCategory, updateCategory, deleteCategory,
    notifications, addNotification, markNotificationAsRead,
    orders, addOrder, updateOrderStatus, updateOrder, deleteOrder,
    cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount,
    messages, addMessage, markMessageAsRead, deleteMessage, replyToMessage,
    analytics, activityLog, trackPageView,
    siteSettings, siteSettingsLoaded, updateSiteSettings,
    employees, addEmployee, updateEmployee, deleteEmployee,
    fetchEmployeePayments, addEmployeePayment, updateEmployeePayment, deleteEmployeePayment, fetchPayrollSummary, fetchAllEmployeePayments,
    otherExpenses, addOtherExpense, updateOtherExpense, deleteOtherExpense,
    addActivity, isLoading, uploadImage
  }), [
    products, addProduct, updateProduct, deleteProduct,
    categories, addCategory, updateCategory, deleteCategory,
    notifications, addNotification, markNotificationAsRead,
    orders, addOrder, updateOrderStatus, updateOrder, deleteOrder,
    cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount,
    messages, addMessage, markMessageAsRead, deleteMessage, replyToMessage,
    analytics, activityLog, trackPageView,
    siteSettings, siteSettingsLoaded, updateSiteSettings,
    employees, addEmployee, updateEmployee, deleteEmployee,
    fetchEmployeePayments, addEmployeePayment, updateEmployeePayment, deleteEmployeePayment, fetchPayrollSummary, fetchAllEmployeePayments,
    otherExpenses, addOtherExpense, updateOtherExpense, deleteOtherExpense,
    addActivity, isLoading, uploadImage
  ]);

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within ShopProvider');
  return context;
};

export const useProducts = useShop;
export const useCart = useShop;
