import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { Product, Order, CartItem, Variation, SiteSettings, HeroSlide, TeamMember, Testimonial } from '../types';
export type { Product, Order, CartItem, Variation, SiteSettings, HeroSlide, TeamMember, Testimonial };
import { DEMO_PRODUCTS, CATEGORIES, HERO_SLIDES, TEAM_MEMBERS, DEMO_TESTIMONIALS } from '../constants';

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

  const [isLoading, setIsLoading] = useState(true);

  // Initial fetch from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/db');
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        
        // If the database has fewer products than our new expanded demo catalog, 
        // we prioritize the new demo products to ensure part catalog expansion is visible.
        if (data.products?.length >= DEMO_PRODUCTS.length) {
          setProducts(data.products);
        } else {
          setProducts(DEMO_PRODUCTS);
        }
        if (data.categories?.length) setCategories(data.categories);
        if (data.orders?.length) setOrders(data.orders);
        if (data.notifications?.length) setNotifications(data.notifications);
        if (data.messages?.length) setMessages(data.messages);
        if (data.analytics) {
          setAnalytics({
            totalVisitors: data.analytics.totalVisitors || 0,
            dailyTraffic: data.analytics.dailyTraffic || [],
            pageViews: data.analytics.pageViews || [],
            activeUsers: data.analytics.activeUsers || 0
          });
        }
        if (data.activityLog?.length) setActivityLog(data.activityLog);
        if (data.siteSettings) {
           // Migration check for siteSettings as before
           const migratedSettings = {
             ...data.siteSettings,
             heroSlides: ((data.siteSettings.heroSlides && data.siteSettings.heroSlides.length > 0) ? data.siteSettings.heroSlides : HERO_SLIDES).map((s: any) => ({
               ...s,
               title: typeof s.title === 'string' ? { en: s.title, fr: s.title, rw: s.title } : s.title,
               subtitle: typeof s.subtitle === 'string' ? { en: s.subtitle, fr: s.subtitle, rw: s.subtitle } : s.subtitle,
               cta: typeof s.cta === 'string' ? { en: s.cta, fr: s.cta, rw: s.cta } : s.cta
             })),
             teamMembers: ((data.siteSettings.teamMembers && data.siteSettings.teamMembers.length > 0) ? data.siteSettings.teamMembers : TEAM_MEMBERS).map((m: any) => ({
               ...m,
               role: typeof m.role === 'string' ? { en: m.role, fr: m.role, rw: m.role } : m.role,
               slogan: typeof m.slogan === 'string' ? { en: m.slogan, fr: m.slogan, rw: m.slogan } : m.slogan
             })),
             testimonials: (data.siteSettings.testimonials && data.siteSettings.testimonials.length > 0) ? data.siteSettings.testimonials : DEMO_TESTIMONIALS
           };
           setSiteSettings(migratedSettings);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Sync to backend whenever relevant state changes
  useEffect(() => {
    if (isLoading) return;
    
    const syncData = async () => {
      try {
        const response = await fetch('/api/db', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            products,
            categories,
            orders,
            notifications,
            messages,
            analytics,
            activityLog,
            siteSettings
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Sync failed with status:', response.status, errorData);
        }
      } catch (error) {
        console.error('Error syncing data:', error);
      }
    };

    const timeout = setTimeout(syncData, 1000); // Debounce sync
    return () => clearTimeout(timeout);
  }, [products, categories, orders, notifications, messages, analytics, activityLog, siteSettings, isLoading]);

  const uploadImage = useCallback(async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) throw new Error('Upload failed');
    const data = await response.json();
    return data.url;
  }, []);

  const addActivity = useCallback((action: string, type: ActivityLog['type'], adminName?: string) => {
    const newLog: ActivityLog = {
      id: Math.random().toString(36).substr(2, 9),
      action,
      timestamp: new Date().toISOString(),
      type,
      adminName: adminName || 'System'
    };
    setActivityLog(prev => [newLog, ...prev.slice(0, 49)]); // Keep last 50 logs
  }, []);

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
  }, [addActivity]);

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
      // Ensure "Uncategorized" exists if we're moving products to it
      if (!filtered.includes("Uncategorized")) {
        return [...filtered, "Uncategorized"];
      }
      return filtered;
    });
    
    // Reassign products to "Uncategorized"
    setProducts(prev => prev.map(p => 
      p.category === category ? { ...p, category: "Uncategorized" } : p
    ));
    
    addActivity(`Category deleted: ${category}`, 'system');
  }, [addActivity]);

  const updateCategory = useCallback((oldCategory: string, newCategory: string) => {
    setCategories(prev => {
      if (prev.includes(newCategory) && oldCategory !== newCategory) {
        return prev.filter(c => c !== oldCategory);
      }
      return prev.map(c => c === oldCategory ? newCategory : c);
    });
    
    setProducts(prev => prev.map(p => 
      p.category === oldCategory ? { ...p, category: newCategory } : p
    ));
    
    addActivity(`Category updated: ${oldCategory} to ${newCategory}`, 'system');
  }, [addActivity]);

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

  const addToCart = useCallback((product: Product, quantity: number = 1, variations?: Variation[]) => {
    setProducts(prevProducts => {
      const currentProduct = prevProducts.find(p => p.id === product.id);
      if (!currentProduct) return prevProducts;

      if (variations && variations.length > 0) {
        // Check if all variations have enough stock
        const hasStock = variations.every(v => {
          const currentV = currentProduct.variations?.find(cv => cv.id === v.id);
          return currentV && currentV.stock >= quantity;
        });

        if (!hasStock) {
          toast.error("Not enough stock available for some selected variations");
          return prevProducts;
        }

        // Reduce stock in all selected variations
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
          toast.error("Not enough stock available");
          return prevProducts;
        }
        // Reduce main stock
        return prevProducts.map(p => 
          p.id === product.id ? { ...p, stock: p.stock - quantity } : p
        );
      }
    });

    // Add to cart
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
        selectedVariation: variations?.[0] // for compatibility
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
        // Restore stock
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

      // Check stock and update it
      setProducts(prevProducts => {
        const product = prevProducts.find(p => p.id === productId);
        if (!product) return prevProducts;

        if (variationIds && variationIds.length > 0) {
          const hasStock = variationIds.every(id => {
            const v = product.variations?.find(v => v.id === id);
            return v && (diff < 0 || v.stock >= diff);
          });

          if (!hasStock) {
            toast.error("Not enough stock available for some selected variations");
            return prevProducts;
          }
          // Update variation stock
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
            toast.error("Not enough stock available");
            return prevProducts;
          }
          // Update main stock
          return prevProducts.map(p => 
            p.id === productId ? { ...p, stock: p.stock - diff } : p
          );
        }
      });

      // Update cart quantity
      return prevCart.map(item => {
        const itemVIds = (item.selectedVariations || []).map(v => v.id).sort().join(',');
        return (item.id === productId && itemVIds === vIdString) 
          ? { ...item, quantity } 
          : item;
      });
    });
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

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

  const updateSiteSettings = useCallback((settings: SiteSettings) => {
    setSiteSettings(settings);
    addActivity('Site settings updated', 'system');
  }, [addActivity]);

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
    siteSettings, updateSiteSettings, addActivity, isLoading, uploadImage
  }), [
    products, addProduct, updateProduct, deleteProduct, 
    categories, addCategory, updateCategory, deleteCategory,
    notifications, addNotification, markNotificationAsRead,
    orders, addOrder, updateOrderStatus, updateOrder, deleteOrder,
    cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount,
    messages, addMessage, markMessageAsRead, deleteMessage, replyToMessage,
    analytics, activityLog, trackPageView,
    siteSettings, updateSiteSettings, addActivity, isLoading, uploadImage
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

// For backward compatibility during migration
export const useProducts = useShop;
export const useCart = useShop;
