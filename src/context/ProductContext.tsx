import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { Product, Order, CartItem, Variation, SiteSettings, HeroSlide, TeamMember, Testimonial, Employee, SalaryPayment } from '../types';
export type { Product, Order, CartItem, Variation, SiteSettings, HeroSlide, TeamMember, Testimonial, Employee, SalaryPayment };
import { DEMO_PRODUCTS, CATEGORIES, HERO_SLIDES, TEAM_MEMBERS, DEMO_TESTIMONIALS } from '../constants';
import { useAuth } from './AuthContext';

// API base URL — set VITE_API_URL in .env for production; empty string works with the dev proxy.
const API_BASE = import.meta.env.VITE_API_URL ?? '';

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
  updateOrderStatus: (orderId: string, status: Order['status'], paymentStatus?: Order['paymentStatus']) => void;
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
  markMessageAsRead: (id: string) => void;
  deleteMessage: (id: string) => void;
  replyToMessage: (id: string, reply: string) => void;
  analytics: Analytics;
  activityLog: ActivityLog[];
  trackPageView: (path: string) => void;
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: SiteSettings) => void;
  employees: Employee[];
  addEmployee: (employee: Employee) => Promise<void>;
  updateEmployee: (employee: Employee) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
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
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS);
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
  const [isLoading, setIsLoading] = useState(true);

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
          messagesRes, analyticsRes, activityLogRes, siteSettingsRes, employeesRes,
        ] = await Promise.allSettled([
          fetch(productsUrl).then(r => r.ok ? r.json() : null),
          fetch(`${API_BASE}/api/categories`).then(r => r.ok ? r.json() : null),
          fetch(`${API_BASE}/api/orders`).then(r => r.ok ? r.json() : null),
          fetch(`${API_BASE}/api/notifications`).then(r => r.ok ? r.json() : null),
          fetch(`${API_BASE}/api/messages`).then(r => r.ok ? r.json() : null),
          fetch(`${API_BASE}/api/analytics`).then(r => r.ok ? r.json() : null),
          fetch(`${API_BASE}/api/activity-log`).then(r => r.ok ? r.json() : null),
          fetch(`${API_BASE}/api/site-settings`).then(r => r.ok ? r.json() : null),
          fetch(`${API_BASE}/api/employees`).then(r => r.ok ? r.json() : null),
        ]);

        if (productsRes.status === 'fulfilled' && productsRes.value) {
          const data: Product[] = productsRes.value;
          setProducts(data.length >= DEMO_PRODUCTS.length ? data : DEMO_PRODUCTS);
        }

        if (categoriesRes.status === 'fulfilled' && categoriesRes.value?.length) {
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
            heroSlides: ((ss.heroSlides && ss.heroSlides.length > 0) ? ss.heroSlides : HERO_SLIDES).map((s: any) => ({
              ...s,
              title: typeof s.title === 'string' ? { en: s.title, fr: s.title, rw: s.title } : s.title,
              subtitle: typeof s.subtitle === 'string' ? { en: s.subtitle, fr: s.subtitle, rw: s.subtitle } : s.subtitle,
              cta: typeof s.cta === 'string' ? { en: s.cta, fr: s.cta, rw: s.cta } : s.cta,
            })),
            teamMembers: ((ss.teamMembers && ss.teamMembers.length > 0) ? ss.teamMembers : TEAM_MEMBERS).map((m: any) => ({
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
            testimonials: (ss.testimonials && ss.testimonials.length > 0) ? ss.testimonials : DEMO_TESTIMONIALS,
          };
          setSiteSettings(migratedSettings);
        }

        if (employeesRes.status === 'fulfilled' && Array.isArray(employeesRes.value)) {
          setEmployees(employeesRes.value.map((e: any) => ({
            ...e,
            payments: Array.isArray(e.payments) ? e.payments : [],
          })));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAdmin]);

  // ── Debounced per-entity syncs ───────────────────────────────────────────
  // Each entity is saved independently so a cart stock change only touches /api/products,
  // a new order only touches /api/orders, etc.

  useEffect(() => {
    if (isLoading) return;
    const t = setTimeout(() => {
      fetch(`${API_BASE}/api/products`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(products),
      }).catch(console.error);
    }, 1000);
    return () => clearTimeout(t);
  }, [products, isLoading]);

  useEffect(() => {
    if (isLoading) return;
    const t = setTimeout(() => {
      fetch(`${API_BASE}/api/categories`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categories),
      }).catch(console.error);
    }, 1000);
    return () => clearTimeout(t);
  }, [categories, isLoading]);

  useEffect(() => {
    if (isLoading) return;
    const t = setTimeout(() => {
      fetch(`${API_BASE}/api/orders`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orders),
      }).catch(console.error);
    }, 1000);
    return () => clearTimeout(t);
  }, [orders, isLoading]);

  useEffect(() => {
    if (isLoading) return;
    const t = setTimeout(() => {
      fetch(`${API_BASE}/api/messages`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messages),
      }).catch(console.error);
    }, 1000);
    return () => clearTimeout(t);
  }, [messages, isLoading]);

  useEffect(() => {
    if (isLoading) return;
    const t = setTimeout(() => {
      fetch(`${API_BASE}/api/notifications`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notifications),
      }).catch(console.error);
    }, 1000);
    return () => clearTimeout(t);
  }, [notifications, isLoading]);

  useEffect(() => {
    if (isLoading) return;
    const t = setTimeout(() => {
      fetch(`${API_BASE}/api/analytics`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(analytics),
      }).catch(console.error);
    }, 1000);
    return () => clearTimeout(t);
  }, [analytics, isLoading]);

  useEffect(() => {
    if (isLoading) return;
    const t = setTimeout(() => {
      fetch(`${API_BASE}/api/activity-log`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activityLog),
      }).catch(console.error);
    }, 1000);
    return () => clearTimeout(t);
  }, [activityLog, isLoading]);

  useEffect(() => {
    if (isLoading) return;
    const t = setTimeout(() => {
      fetch(`${API_BASE}/api/site-settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteSettings),
      }).catch(console.error);
    }, 1000);
    return () => clearTimeout(t);
  }, [siteSettings, isLoading]);

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
  }, []);

  // ── Analytics ─────────────────────────────────────────────────────────────
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
  }, []);

  // ── Products ──────────────────────────────────────────────────────────────
  const addProduct = useCallback((product: Product) => {
    setProducts(prev => [...prev, product]);
    addActivity(`New product added: ${product.title}`, 'product');
  }, [addActivity]);

  const updateProduct = useCallback((product: Product) => {
    setProducts(prev => prev.map(p => p.id === product.id ? product : p));
    addActivity(`Product updated: ${product.title}`, 'product');
  }, [addActivity]);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => {
      const product = prev.find(p => p.id === id);
      if (product) addActivity(`Product deleted: ${product.title}`, 'product');
      return prev.filter(p => p.id !== id);
    });
    // Explicit delete call — the bulk PUT sync below is upsert-only (it never deletes),
    // so removal must be requested directly.
    fetch(`${API_BASE}/api/products/${id}`, { method: 'DELETE' }).catch(console.error);
  }, [addActivity]);

  // ── Categories ────────────────────────────────────────────────────────────
  const addCategory = useCallback((category: string) => {
    setCategories(prev => {
      if (!prev.includes(category)) {
        addActivity(`New category added: ${category}`, 'system');
        return [...prev, category];
      }
      return prev;
    });
  }, [addActivity]);

  const deleteCategory = useCallback((category: string) => {
    setCategories(prev => {
      const filtered = prev.filter(c => c !== category);
      return filtered.includes('Uncategorized') ? filtered : [...filtered, 'Uncategorized'];
    });
    setProducts(prev => prev.map(p => p.category === category ? { ...p, category: 'Uncategorized' } : p));
    addActivity(`Category deleted: ${category}`, 'system');
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
  }, []);

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
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
  }, [addNotification, addActivity]);

  const markMessageAsRead = useCallback((id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  }, []);

  const deleteMessage = useCallback((id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
    addActivity(`Deleted message ${id}`, 'system');
  }, [addActivity]);

  const replyToMessage = useCallback((id: string, reply: string) => {
    setMessages(prev => prev.map(m => m.id === id ? {
      ...m,
      reply,
      repliedAt: new Date().toISOString(),
      read: true
    } : m));
    addActivity(`Replied to message from ${id}`, 'system');
  }, [addActivity]);

  // ── Cart (stock management — exact same logic as before) ──────────────────
  const addToCart = useCallback((product: Product, quantity: number = 1, variations?: Variation[]) => {
    setProducts(prevProducts => {
      const currentProduct = prevProducts.find(p => p.id === product.id);
      if (!currentProduct) return prevProducts;

      if (variations && variations.length > 0) {
        const hasStock = variations.every(v => {
          const currentV = currentProduct.variations?.find(cv => cv.id === v.id);
          return currentV && currentV.stock >= quantity;
        });
        if (!hasStock) {
          toast.error('Not enough stock available for some selected variations');
          return prevProducts;
        }
        return prevProducts.map(p =>
          p.id === product.id ? {
            ...p,
            variations: p.variations?.map(v =>
              variations.some(sv => sv.id === v.id) ? { ...v, stock: v.stock - quantity } : v
            )
          } : p
        );
      } else {
        if (currentProduct.stock < quantity) {
          toast.error('Not enough stock available');
          return prevProducts;
        }
        return prevProducts.map(p =>
          p.id === product.id ? { ...p, stock: p.stock - quantity } : p
        );
      }
    });

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
    setCart(prevCart => {
      const cartItem = prevCart.find(item => {
        const itemVIds = (item.selectedVariations || []).map(v => v.id).sort().join(',');
        return item.id === productId && itemVIds === vIdString;
      });
      if (cartItem) {
        setProducts(prevProducts => prevProducts.map(p => {
          if (p.id !== productId) return p;
          if (variationIds && variationIds.length > 0) {
            return {
              ...p,
              variations: p.variations?.map(v =>
                variationIds.includes(v.id) ? { ...v, stock: v.stock + cartItem.quantity } : v
              )
            };
          }
          return { ...p, stock: p.stock + cartItem.quantity };
        }));
      }
      return prevCart.filter(item => {
        const itemVIds = (item.selectedVariations || []).map(v => v.id).sort().join(',');
        return !(item.id === productId && itemVIds === vIdString);
      });
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number, variationIds?: string[]) => {
    if (quantity < 1) return;
    const vIdString = (variationIds || []).sort().join(',');
    setCart(prevCart => {
      const cartItem = prevCart.find(item => {
        const itemVIds = (item.selectedVariations || []).map(v => v.id).sort().join(',');
        return item.id === productId && itemVIds === vIdString;
      });
      if (!cartItem) return prevCart;

      const diff = quantity - cartItem.quantity;
      if (diff === 0) return prevCart;

      setProducts(prevProducts => {
        const product = prevProducts.find(p => p.id === productId);
        if (!product) return prevProducts;

        if (variationIds && variationIds.length > 0) {
          const hasStock = variationIds.every(id => {
            const v = product.variations?.find(v => v.id === id);
            return v && (diff < 0 || v.stock >= diff);
          });
          if (!hasStock) {
            toast.error('Not enough stock available for some selected variations');
            return prevProducts;
          }
          return prevProducts.map(p =>
            p.id === productId ? {
              ...p,
              variations: p.variations?.map(v =>
                variationIds.includes(v.id) ? { ...v, stock: v.stock - diff } : v
              )
            } : p
          );
        } else {
          if (diff > 0 && product.stock < diff) {
            toast.error('Not enough stock available');
            return prevProducts;
          }
          return prevProducts.map(p =>
            p.id === productId ? { ...p, stock: p.stock - diff } : p
          );
        }
      });

      return prevCart.map(item => {
        const itemVIds = (item.selectedVariations || []).map(v => v.id).sort().join(',');
        return (item.id === productId && itemVIds === vIdString)
          ? { ...item, quantity }
          : item;
      });
    });
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
  }, [addNotification, addActivity]);

  const updateOrderStatus = useCallback((orderId: string, status: Order['status'], paymentStatus?: Order['paymentStatus']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? {
      ...o,
      status,
      paymentStatus: paymentStatus || o.paymentStatus
    } : o));
    addActivity(`Order ${orderId} status updated to ${status}`, 'order');
  }, [addActivity]);

  const updateOrder = useCallback((updatedOrder: Order) => {
    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    addActivity(`Order ${updatedOrder.id} updated`, 'order');
  }, [addActivity]);

  const deleteOrder = useCallback((id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
    addActivity(`Order ${id} deleted`, 'order');
  }, [addActivity]);

  // ── Site settings ─────────────────────────────────────────────────────────
  const updateSiteSettings = useCallback((settings: SiteSettings) => {
    setSiteSettings(settings);
    addActivity('Site settings updated', 'system');
  }, [addActivity]);

  // ── Employees ─────────────────────────────────────────────────────────────
  const addEmployee = useCallback(async (employee: Employee) => {
    const res = await fetch(`${API_BASE}/api/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employee),
    });
    if (!res.ok) throw new Error('Failed to add employee');
    const created: Employee = await res.json();
    setEmployees(prev => [created, ...prev]);
  }, []);

  const updateEmployee = useCallback(async (employee: Employee) => {
    const res = await fetch(`${API_BASE}/api/employees/${employee.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employee),
    });
    if (!res.ok) throw new Error('Failed to update employee');
    const updated: Employee = await res.json();
    setEmployees(prev => prev.map(e => e.id === updated.id ? updated : e));
  }, []);

  const deleteEmployee = useCallback(async (id: string) => {
    const res = await fetch(`${API_BASE}/api/employees/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete employee');
    setEmployees(prev => prev.filter(e => e.id !== id));
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
    siteSettings, updateSiteSettings,
    employees, addEmployee, updateEmployee, deleteEmployee,
    addActivity, isLoading, uploadImage
  }), [
    products, addProduct, updateProduct, deleteProduct,
    categories, addCategory, updateCategory, deleteCategory,
    notifications, addNotification, markNotificationAsRead,
    orders, addOrder, updateOrderStatus, updateOrder, deleteOrder,
    cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount,
    messages, addMessage, markMessageAsRead, deleteMessage, replyToMessage,
    analytics, activityLog, trackPageView,
    siteSettings, updateSiteSettings,
    employees, addEmployee, updateEmployee, deleteEmployee,
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
