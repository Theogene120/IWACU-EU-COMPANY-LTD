import React, { useState, useEffect, useRef } from 'react';
import { useShop, ActivityLog } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingBag, Users, BarChart3, Plus,
  Search, Edit, Trash2, CheckCircle, Clock, Truck, PackageCheck,
  TrendingUp, DollarSign, ArrowUpRight,
  Bell, X as LucideX, Tag, Shield, Settings, Mail, Activity,
  Lock, Key, ShieldCheck, History, Terminal, Database, RefreshCw,
  User, LayoutGrid, History as HistoryIcon, Edit2, AlertCircle, Download, Upload, Globe, Send, LogOut,
  ChevronDown, ChevronRight
} from 'lucide-react';
import AdminNavbar, { AdminTab } from '../components/AdminNavbar';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Product, Variation, Order, Testimonial, Employee, SalaryPayment } from '../types';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const AdminDashboard = () => {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const {
    products, orders, updateOrderStatus, updateOrder, deleteOrder, deleteProduct, addProduct, updateProduct,
    categories, addCategory, updateCategory, deleteCategory, notifications, markNotificationAsRead,
    messages, markMessageAsRead, deleteMessage, replyToMessage, analytics, activityLog, trackPageView,
    siteSettings, updateSiteSettings, addActivity,
    employees, addEmployee, updateEmployee, deleteEmployee,
  } = useShop();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [profitTypeFilter, setProfitTypeFilter] = useState<'all' | 'online' | 'offline'>('all');
  const [profitDateFrom, setProfitDateFrom] = useState('');
  const [profitDateTo, setProfitDateTo] = useState('');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{ oldName: string, newName: string } | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<string | null>(null);
  const [deletingMessage, setDeletingMessage] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingOrder, setEditingOrder] = useState<any | null>(null);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isAuditLogOpen, setIsAuditLogOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [maintenanceProgress, setMaintenanceProgress] = useState(0);
  const [isMaintenanceRunning, setIsMaintenanceRunning] = useState(false);
  const [isAddingLog, setIsAddingLog] = useState(false);
  const [newLogAction, setNewLogAction] = useState('');
  const [newLogType, setNewLogType] = useState<ActivityLog['type']>('system');
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [productSalesTypeFilter, setProductSalesTypeFilter] = useState<'all' | 'online' | 'offline'>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | Order['status']>('all');
  const [deletingProduct, setDeletingProduct] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const [adminPhoto, setAdminPhoto] = useState(() => localStorage.getItem('adminPhoto') || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400");
  const [adminName, setAdminName] = useState(() => localStorage.getItem('adminName') || "MANIRAKIZA Emmanuel");

  // PDF Export Helpers
  const exportInventoryPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Inventory Report - Remaining Products", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    
    const tableRows = filteredProducts.map(p => [
      p.id,
      p.title,
      p.category,
      formatPrice(p.price),
      p.stock,
      p.stock > 0 ? 'In Stock' : 'Out of Stock'
    ]);

    autoTable(doc, {
      startY: 40,
      head: [['ID', 'Product Name', 'Category', 'Price', 'Stock', 'Status']],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] },
      styles: { fontSize: 9 }
    });

    doc.save(`Inventory_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("Inventory PDF exported successfully");
  };

  const exportSalesReportPDF = () => {
    const doc = new jsPDF();
    const releasedOrders = orders.filter(o => o.status !== 'pending');
    
    doc.setFontSize(20);
    doc.text("Sales Report - Released Products", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    const tableRows = releasedOrders.map(o => [
      o.id,
      o.customerName,
      new Date(o.createdAt).toLocaleDateString(),
      o.status.toUpperCase(),
      formatPrice(o.total)
    ]);

    autoTable(doc, {
      startY: 40,
      head: [['Order ID', 'Customer', 'Date', 'Status', 'Amount']],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [22, 163, 74] },
      styles: { fontSize: 9 }
    });

    const totalSalesAmount = releasedOrders.reduce((sum, o) => sum + o.total, 0);
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Total Released Sales: ${formatPrice(totalSalesAmount)}`, 14, finalY);

    doc.save(`Sales_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("Sales PDF exported successfully");
  };

  const exportPaymentReportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Payment & Transaction Report", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    const tableRows = orders.map(o => [
      o.id,
      o.customerName,
      o.paymentMethod.replace('_', ' ').toUpperCase(),
      o.paymentStatus,
      o.transactionId || 'N/A',
      formatPrice(o.total)
    ]);

    autoTable(doc, {
      startY: 40,
      head: [['Order ID', 'Customer', 'Method', 'Status', 'Transaction ID', 'Amount']],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] },
      styles: { fontSize: 8 }
    });

    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Total Revenue: ${formatPrice(totalRevenue)}`, 14, finalY);

    doc.save(`Payment_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("Payment Report PDF exported successfully");
  };

  const exportProfitReportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Profit Report", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    const tableRows = profitRows.map((row, i) => [
      i + 1,
      row.itemName,
      row.date ? new Date(row.date).toLocaleDateString() : '—',
      formatPrice(row.cost),
      formatPrice(row.deliveryFee),
      formatPrice(row.revenue),
      formatPrice(row.profit)
    ]);

    autoTable(doc, {
      startY: 40,
      head: [['#', 'Item Name', 'Date', 'Cost', 'Delivery Fee', 'Revenue', 'Profit']],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [22, 163, 74] },
      styles: { fontSize: 9 }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Total Revenue: ${formatPrice(profitTotals.revenue)}`, 14, finalY);
    doc.text(`Total Cost: ${formatPrice(profitTotals.cost)}`, 14, finalY + 8);
    doc.text(`Total Delivery Fees: ${formatPrice(profitTotals.deliveryFee)}`, 14, finalY + 16);
    doc.text(`Total Profit: ${formatPrice(profitTotals.profit)}`, 14, finalY + 24);

    doc.save(`Profit_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("Profit PDF exported successfully");
  };

  useEffect(() => {
    localStorage.setItem('adminPhoto', adminPhoto);
  }, [adminPhoto]);

  useEffect(() => {
    localStorage.setItem('adminName', adminName);
  }, [adminName]);

  // Use effect so navigate('/') in logout fires first and unmounts this
  // component before the redirect here can override it.
  useEffect(() => {
    if (!isAdmin) navigate('/', { replace: true });
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  // Stats
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalSales = orders.length;
  const totalProducts = products.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  const filteredProducts = products.filter(p =>
    (p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.id.toLowerCase().includes(productSearch.toLowerCase())) &&
    (productCategoryFilter === 'all' || p.category === productCategoryFilter) &&
    (productSalesTypeFilter === 'all' || (p.salesType || 'online') === productSalesTypeFilter)
  );

  const filteredOrders = orders.filter(o =>
    (o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.phone.includes(orderSearch)) &&
    (orderStatusFilter === 'all' || o.status === orderStatusFilter)
  );

  // ── Unified Profit table ────────────────────────────────────────────────
  // One row per item sold, combining website order line items with offline sales.
  // Website rows: revenue/cost cover the full line item (unit price/cost × quantity).
  // An order's delivery fee is attributed to ONLY the first line item of that order so
  // the totals footer never double-counts it across multiple items in the same order.
  type ProfitRow = {
    key: string;
    itemName: string;
    date: string;
    cost: number;
    deliveryFee: number;
    revenue: number;
    profit: number;
    type: 'online' | 'offline';
  };

  const allProfitRows: ProfitRow[] = [];

  // Only confirmed website orders count toward profit — pending orders aren't sold yet.
  orders.filter(order => order.status !== 'pending').forEach(order => {
    const orderDeliveryFee = order.deliveryFee || 0;
    order.items.forEach((item, idx) => {
      const product = products.find(p => p.id === item.id);
      const unitCost = product?.cost || 0;
      const unitRevenue = item.price + (item.selectedVariation?.priceModifier || 0);
      const revenue = unitRevenue * item.quantity;
      const cost = unitCost * item.quantity;
      const deliveryFee = idx === 0 ? orderDeliveryFee : 0;
      allProfitRows.push({
        key: `online-${order.id}-${idx}`,
        itemName: item.title,
        date: order.createdAt,
        cost,
        deliveryFee,
        revenue,
        profit: revenue - cost - deliveryFee,
        type: 'online',
      });
    });
  });

  products.filter(p => p.salesType === 'offline').forEach(p => {
    const revenue = p.salePrice || 0;
    const cost = p.cost || 0;
    const deliveryFee = p.offlineDeliveryFee || 0;
    allProfitRows.push({
      key: `offline-${p.id}`,
      itemName: p.title,
      date: p.saleDate || '',
      cost,
      deliveryFee,
      revenue,
      profit: revenue - cost - deliveryFee,
      type: 'offline',
    });
  });

  const profitRows = allProfitRows
    .filter(r => profitTypeFilter === 'all' || r.type === profitTypeFilter)
    .filter(r => !profitDateFrom || (r.date && r.date.slice(0, 10) >= profitDateFrom))
    .filter(r => !profitDateTo || (r.date && r.date.slice(0, 10) <= profitDateTo))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const profitTotals = profitRows.reduce((acc, r) => ({
    revenue: acc.revenue + r.revenue,
    cost: acc.cost + r.cost,
    deliveryFee: acc.deliveryFee + r.deliveryFee,
    profit: acc.profit + r.profit,
  }), { revenue: 0, cost: 0, deliveryFee: 0, profit: 0 });

  const chartData = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 2000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
  ];

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      <AdminNavbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex flex-1 min-h-0">
      {/* Sidebar — fixed, does not scroll with content */}
      <aside className="w-64 bg-blue-900 text-white hidden lg:flex flex-col flex-shrink-0 overflow-y-auto">
        <div className="p-8">
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-orange-400" />
            <span className="text-xl font-bold tracking-tight">SMART ADMIN</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {[
            { id: 'overview', icon: <LayoutDashboard className="h-5 w-5" />, label: 'Overview' },
            { id: 'products', icon: <Package className="h-5 w-5" />, label: 'Products' },
            { id: 'orders', icon: <ShoppingBag className="h-5 w-5" />, label: 'Orders' },
            { id: 'profit', icon: <DollarSign className="h-5 w-5" />, label: 'Profit' },
            { id: 'employees', icon: <Users className="h-5 w-5" />, label: 'Employees' },
            { id: 'analytics', icon: <BarChart3 className="h-5 w-5" />, label: 'Analytics' },
            { id: 'site-content', icon: <Globe className="h-5 w-5" />, label: 'Site Content' },
            { id: 'messages', icon: <Mail className="h-5 w-5" />, label: 'Messages' },
            { id: 'settings', icon: <Settings className="h-5 w-5" />, label: 'Settings' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all",
                activeTab === item.id ? "bg-blue-800 text-white font-bold" : "text-blue-100 hover:bg-blue-800/50"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-blue-800">
          <div className="bg-blue-800/50 p-4 rounded-xl flex items-center space-x-3">
            <img src={adminPhoto} alt="Admin" className="w-10 h-10 rounded-full border-2 border-blue-400 object-cover" />
            <div>
              <p className="text-xs text-blue-300 uppercase font-bold mb-0.5">Logged in as</p>
              <p className="text-sm font-bold truncate max-w-[120px]">{adminName}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content — only this area scrolls */}
      <main className="flex-1 min-h-0 p-8 lg:p-12 overflow-y-auto">
        {/* Contextual sub-header: title + notifications + tab-specific actions */}
        <div className="flex justify-between items-center mb-12 gap-4">
          <div className="min-w-0">
            <h1 className="text-3xl font-bold text-gray-900 capitalize truncate">
              {activeTab === 'site-content' ? 'Site Content' : activeTab}
            </h1>
            <p className="text-gray-500 whitespace-nowrap">Manage your business operations</p>
          </div>
          <div className="flex items-center space-x-3 flex-shrink-0">
            {/* Bell notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-600 hover:text-blue-600 transition-all relative"
              >
                <Bell className="h-6 w-6" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 border-2 border-white rounded-full" />
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden"
                    >
                      <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900">Notifications</h3>
                        <span className="text-xs text-blue-600 font-bold">{notifications.filter(n => !n.read).length} New</span>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map(notif => (
                            <div
                              key={notif.id}
                              onClick={() => markNotificationAsRead(notif.id)}
                              className={cn(
                                "p-4 border-b last:border-0 cursor-pointer hover:bg-gray-50 transition-colors",
                                !notif.read ? "bg-blue-50/30" : ""
                              )}
                            >
                              <div className="flex justify-between items-start mb-1">
                                <p className="text-sm font-bold text-gray-900">{notif.title}</p>
                                <span className="text-[10px] text-gray-400">{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                              <p className="text-xs text-gray-600 line-clamp-2">{notif.message}</p>
                            </div>
                          ))
                        ) : (
                          <div className="p-8 text-center text-gray-400 text-sm">No notifications</div>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Products-tab action buttons */}
            {activeTab === 'products' && (
              <div className="flex items-center space-x-2 flex-shrink-0">
                <button
                  onClick={() => setIsAddingCategory(true)}
                  className="bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold flex items-center space-x-2 hover:bg-gray-50 transition-all whitespace-nowrap"
                >
                  <Tag className="h-5 w-5 flex-shrink-0" />
                  <span>Categories</span>
                </button>
                <button
                  onClick={() => setIsAddingProduct(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2 transition-all shadow-lg shadow-blue-200 whitespace-nowrap"
                >
                  <Plus className="h-5 w-5 flex-shrink-0" />
                  <span>Add Product</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tabs Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              {/* Analytics Widgets */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { label: 'Total Visitors', value: (analytics.totalVisitors || 0).toLocaleString(), icon: <Users className="h-6 w-6" />, color: 'bg-indigo-500' },
                  { label: 'Active Users', value: analytics.activeUsers || 0, icon: <Activity className="h-6 w-6" />, color: 'bg-green-500' },
                  { label: 'Daily Traffic', value: (analytics.dailyTraffic && analytics.dailyTraffic.length > 0) ? analytics.dailyTraffic[analytics.dailyTraffic.length - 1].count : 0, icon: <TrendingUp className="h-6 w-6" />, color: 'bg-orange-500' },
                  { label: 'Total Page Views', value: (analytics.pageViews || []).reduce((sum, p) => sum + (p.count || 0), 0).toLocaleString(), icon: <BarChart3 className="h-6 w-6" />, color: 'bg-purple-500' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-6">
                      <div className={cn("p-3 rounded-2xl text-white shadow-lg", stat.color)}>
                        {stat.icon}
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                    <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Traffic Chart */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-8">Traffic Analytics</h3>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analytics.dailyTraffic}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                        <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5' }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Most Visited Pages */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-8">Most Visited Pages</h3>
                  <div className="space-y-4">
                    {(analytics.pageViews || []).slice().sort((a, b) => (b.count || 0) - (a.count || 0)).map((page, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                        <span className="text-sm font-medium text-gray-700">{page.path}</span>
                        <span className="text-sm font-bold text-blue-600">{(page.count || 0).toLocaleString()} views</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'site-content' && (
            <motion.div
              key="site-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <SiteContentManager />
            </motion.div>
          )}

          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Dashboard Statistics</h2>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={exportPaymentReportPDF}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold flex items-center space-x-2 hover:bg-indigo-700 transition-all shadow-sm"
                  >
                    <Download className="h-4 w-4" />
                    <span>Payment Report</span>
                  </button>
                  <button 
                    onClick={() => toast.info("Generating detailed statistics report...")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold flex items-center space-x-2 hover:bg-blue-700 transition-all shadow-sm"
                  >
                    <Activity className="h-4 w-4" />
                    <span>Statistic</span>
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { label: 'Total Revenue', value: formatPrice(orders.reduce((sum, o) => sum + o.total, 0)), icon: <TrendingUp className="h-6 w-6" />, color: 'bg-blue-500', trend: '+12%' },
                  { label: 'Total Sales', value: orders.length, icon: <ShoppingBag className="h-6 w-6" />, color: 'bg-green-500', trend: '+5%' },
                  { label: 'Total Products', value: products.length, icon: <Package className="h-6 w-6" />, color: 'bg-purple-500', trend: '+2' },
                  { label: 'Pending Orders', value: orders.filter(o => o.status === 'pending').length, icon: <Clock className="h-6 w-6" />, color: 'bg-orange-500', trend: '-1' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-6">
                      <div className={cn("p-3 rounded-2xl text-white shadow-lg", stat.color)}>
                        {stat.icon}
                      </div>
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {stat.trend}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                    <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Chart */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="font-bold text-gray-900">Revenue Analytics</h3>
                    <button className="text-blue-600 text-sm font-bold flex items-center">
                      View Report <ArrowUpRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: 'Mon', sales: 4000 },
                        { name: 'Tue', sales: 3000 },
                        { name: 'Wed', sales: 2000 },
                        { name: 'Thu', sales: 2780 },
                        { name: 'Fri', sales: 1890 },
                        { name: 'Sat', sales: 2390 },
                        { name: 'Sun', sales: 3490 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="sales" fill="#2563eb" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-8">Recent Orders</h3>
                  <div className="space-y-6">
                    {orders.slice(0, 5).map(order => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                        <div className="flex items-center space-x-4">
                          <div className="bg-white p-2 rounded-xl shadow-sm">
                            <ShoppingBag className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-gray-900">{order.customerName}</p>
                            <p className="text-xs text-gray-500">{order.id}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm text-blue-900">{formatPrice(order.total)}</p>
                          <span className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                            order.status === 'pending' ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-600"
                          )}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                    {orders.length === 0 && <p className="text-center text-gray-400 py-10">No recent orders</p>}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity Log */}
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      <History className="h-5 w-5 text-blue-600" />
                      Admin Activity Log
                    </h3>
                  </div>
                  <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {activityLog.length > 0 ? (
                      activityLog.map((log) => (
                        <div key={log.id} className="flex gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
                          <div className="flex-shrink-0 mt-1">
                            <div className="p-2 bg-white rounded-xl shadow-sm">
                              <User className="h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-bold text-gray-900">{log.adminName}</p>
                              <span className="text-[10px] font-medium text-gray-400">{new Date(log.timestamp).toLocaleString()}</span>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">{log.action}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10">
                        <p className="text-sm text-gray-400">No recent activity recorded.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-8">Quick Actions</h3>
                  <div className="space-y-4">
                    <button 
                      onClick={() => setIsAddingProduct(true)}
                      className="w-full p-4 rounded-2xl bg-blue-50 text-blue-600 font-bold text-sm flex items-center gap-3 hover:bg-blue-100 transition-all"
                    >
                      <Plus className="h-5 w-5" />
                      Add New Product
                    </button>
                    <button 
                      onClick={() => setIsAddingCategory(true)}
                      className="w-full p-4 rounded-2xl bg-purple-50 text-purple-600 font-bold text-sm flex items-center gap-3 hover:bg-purple-100 transition-all"
                    >
                      <LayoutGrid className="h-5 w-5" />
                      Manage Categories
                    </button>
                    <button 
                      onClick={() => setActiveTab('orders')}
                      className="w-full p-4 rounded-2xl bg-green-50 text-green-600 font-bold text-sm flex items-center gap-3 hover:bg-green-100 transition-all"
                    >
                      <ShoppingBag className="h-5 w-5" />
                      Process Orders
                    </button>
                    <button 
                      onClick={() => setActiveTab('analytics')}
                      className="w-full p-4 rounded-2xl bg-indigo-50 text-indigo-600 font-bold text-sm flex items-center gap-3 hover:bg-indigo-100 transition-all"
                    >
                      <BarChart3 className="h-5 w-5" />
                      View Analytics
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:w-96">
                  <Search className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text"
                    placeholder="Search products by name or ID..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-2xl border border-gray-100 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="flex-1 sm:flex-none px-4 py-3 bg-gray-50 rounded-2xl border border-gray-100 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  <select
                    value={productSalesTypeFilter}
                    onChange={(e) => setProductSalesTypeFilter(e.target.value as any)}
                    className="flex-1 sm:flex-none px-4 py-3 bg-gray-50 rounded-2xl border border-gray-100 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="all">All Sales Types</option>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select>
                  <button
                    onClick={exportInventoryPDF}
                    className="flex-1 sm:flex-none px-4 py-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 text-sm font-bold hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Inventory PDF
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-8 py-6">Product</th>
                    <th className="px-8 py-6">Category</th>
                    <th className="px-8 py-6">Type</th>
                    <th className="px-8 py-6">Price</th>
                    <th className="px-8 py-6">Stock</th>
                    <th className="px-8 py-6">Status</th>
                    <th className="px-8 py-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-4">
                          <img src={product.images[0]} alt={product.title} className="w-12 h-12 rounded-xl object-cover" referrerPolicy="no-referrer" />
                          <span className="font-bold text-gray-900">{product.title}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm text-gray-600">{product.category}</td>
                      <td className="px-8 py-6">
                        <span className={cn(
                          "text-[10px] font-bold px-2 py-1 rounded-full uppercase",
                          product.salesType === 'offline' ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"
                        )}>
                          {product.salesType === 'offline' ? 'Offline' : 'Online'}
                        </span>
                      </td>
                      <td className="px-8 py-6 font-bold text-blue-900">{formatPrice(product.price)}</td>
                      <td className="px-8 py-6 text-sm text-gray-600">{product.stock}</td>
                      <td className="px-8 py-6">
                        {product.salesType === 'offline' ? (
                          <span className="text-[10px] font-bold px-2 py-1 rounded-full uppercase bg-gray-200 text-gray-700">
                            Sold
                          </span>
                        ) : (
                          <span className={cn(
                            "text-[10px] font-bold px-2 py-1 rounded-full uppercase",
                            product.stock > 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                          )}>
                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => setDeletingProduct(product.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-8 py-20 text-center text-gray-400">
                        No products found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              </div>
            </div>
          </motion.div>
        )}

          {activeTab === 'profit' && (
            <motion.div
              key="profit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Total Revenue', value: formatPrice(profitTotals.revenue), color: 'bg-blue-500' },
                  { label: 'Total Cost', value: formatPrice(profitTotals.cost), color: 'bg-gray-700' },
                  { label: 'Total Delivery Fees', value: formatPrice(profitTotals.deliveryFee), color: 'bg-purple-500' },
                  { label: 'Total Profit', value: formatPrice(profitTotals.profit), color: 'bg-green-500' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4", stat.color)}>
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-medium text-gray-500 mb-1">{stat.label}</p>
                    <h3 className="text-xl font-bold text-gray-900">{stat.value}</h3>
                  </div>
                ))}
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-3">
                  <select
                    value={profitTypeFilter}
                    onChange={e => setProfitTypeFilter(e.target.value as any)}
                    className="px-4 py-3 bg-gray-50 rounded-2xl border border-gray-100 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="all">All Sales</option>
                    <option value="online">Online Only</option>
                    <option value="offline">Offline Only</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <input
                    type="date"
                    value={profitDateFrom}
                    onChange={e => setProfitDateFrom(e.target.value)}
                    className="px-4 py-3 bg-gray-50 rounded-2xl border border-gray-100 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <span className="text-gray-400 text-sm">to</span>
                  <input
                    type="date"
                    value={profitDateTo}
                    onChange={e => setProfitDateTo(e.target.value)}
                    className="px-4 py-3 bg-gray-50 rounded-2xl border border-gray-100 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  {(profitTypeFilter !== 'all' || profitDateFrom || profitDateTo) && (
                    <button
                      onClick={() => { setProfitTypeFilter('all'); setProfitDateFrom(''); setProfitDateTo(''); }}
                      className="px-4 py-3 bg-gray-50 text-gray-500 rounded-2xl border border-gray-100 text-sm font-bold hover:bg-gray-100 transition-all"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    onClick={exportProfitReportPDF}
                    className="px-4 py-3 bg-green-50 text-green-600 rounded-2xl border border-green-100 text-sm font-bold hover:bg-green-100 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <Download className="h-4 w-4" />
                    Profit PDF
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-6">#</th>
                      <th className="px-6 py-6">Item Name</th>
                      <th className="px-6 py-6">Date</th>
                      <th className="px-6 py-6">Cost</th>
                      <th className="px-6 py-6">Delivery Fee</th>
                      <th className="px-6 py-6">Revenue</th>
                      <th className="px-6 py-6">Profit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {profitRows.map((row, i) => (
                      <tr key={row.key} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-5 text-sm text-gray-500">{i + 1}</td>
                        <td className="px-6 py-5">
                          <span className="font-bold text-gray-900">{row.itemName}</span>
                          <span className={cn(
                            "ml-2 text-[9px] font-black px-2 py-0.5 rounded-full uppercase",
                            row.type === 'offline' ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"
                          )}>
                            {row.type}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-sm text-gray-600">{row.date ? new Date(row.date).toLocaleDateString() : '—'}</td>
                        <td className="px-6 py-5 text-sm text-gray-600">{formatPrice(row.cost)}</td>
                        <td className="px-6 py-5 text-sm text-gray-600">{formatPrice(row.deliveryFee)}</td>
                        <td className="px-6 py-5 text-sm font-bold text-blue-900">{formatPrice(row.revenue)}</td>
                        <td className={cn("px-6 py-5 text-sm font-bold", row.profit >= 0 ? "text-green-600" : "text-red-600")}>
                          {formatPrice(row.profit)}
                        </td>
                      </tr>
                    ))}
                    {profitRows.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-gray-400">No sales recorded yet.</td>
                      </tr>
                    )}
                  </tbody>
                  {profitRows.length > 0 && (
                    <tfoot className="bg-gray-50 font-bold text-gray-900">
                      <tr>
                        <td className="px-6 py-5" colSpan={3}>Totals</td>
                        <td className="px-6 py-5">{formatPrice(profitTotals.cost)}</td>
                        <td className="px-6 py-5">{formatPrice(profitTotals.deliveryFee)}</td>
                        <td className="px-6 py-5 text-blue-900">{formatPrice(profitTotals.revenue)}</td>
                        <td className={cn("px-6 py-5", profitTotals.profit >= 0 ? "text-green-600" : "text-red-600")}>
                          {formatPrice(profitTotals.profit)}
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:w-96">
                  <Search className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text"
                    placeholder="Search orders by ID, customer name or phone..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-2xl border border-gray-100 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value as any)}
                    className="flex-1 sm:flex-none px-4 py-3 bg-gray-50 rounded-2xl border border-gray-100 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                  <button
                    onClick={exportSalesReportPDF}
                    className="flex-1 sm:flex-none px-4 py-3 bg-green-50 text-green-600 rounded-2xl border border-green-100 text-sm font-bold hover:bg-green-100 transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Sales PDF
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-8 py-6">Order ID</th>
                    <th className="px-8 py-6">Customer</th>
                    <th className="px-8 py-6">Total</th>
                    <th className="px-8 py-6">Status</th>
                    <th className="px-8 py-6 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-6 font-bold text-blue-600">
                        <div className="flex flex-col">
                          <span>{order.id}</span>
                          <span className="text-[10px] text-gray-400 font-normal">{new Date(order.createdAt).toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900">{order.customerName}</span>
                          <span className="text-xs text-gray-500">{order.phone}</span>
                          <span className="text-[10px] text-gray-400 line-clamp-1">{order.address}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 font-bold text-blue-900">{formatPrice(order.total)}</td>
                      <td className="px-8 py-6">
                        <span className={cn(
                          "text-[10px] font-bold px-2 py-1 rounded-full uppercase flex items-center w-fit space-x-1",
                          order.status === 'pending' && "bg-orange-100 text-orange-600",
                          order.status === 'confirmed' && "bg-blue-100 text-blue-600",
                          order.status === 'shipped' && "bg-purple-100 text-purple-600",
                          order.status === 'delivered' && "bg-green-100 text-green-600"
                        )}>
                          {order.status === 'pending' && <Clock className="h-3 w-3" />}
                          {order.status === 'confirmed' && <CheckCircle className="h-3 w-3" />}
                          {order.status === 'shipped' && <Truck className="h-3 w-3" />}
                          {order.status === 'delivered' && <PackageCheck className="h-3 w-3" />}
                          <span>{order.status}</span>
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex flex-col gap-2 items-end">
                          <div className="flex items-center space-x-2">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value as any, order.paymentStatus)}
                              className="text-xs font-bold p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                            </select>
                            <button 
                              onClick={() => setEditingOrder(order)}
                              className="p-2 text-gray-400 hover:text-blue-600 transition-colors bg-gray-50 rounded-lg"
                              title="Edit Order"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => setDeletingOrder(order.id)}
                              className="flex items-center space-x-1 p-2 text-gray-400 hover:text-red-600 transition-colors bg-gray-50 rounded-lg"
                              title="Remove Order"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="text-xs font-bold">Remove</span>
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center text-gray-400">
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              </div>
            </div>
          </motion.div>
        )}
          {activeTab === 'messages' && (
            <motion.div
              key="messages"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b bg-gray-50/50">
                  <h2 className="text-xl font-bold text-gray-900">Customer Messages</h2>
                  <p className="text-sm text-gray-500">Inquiries and feedback from your customers</p>
                </div>
                <div className="divide-y divide-gray-100">
                  {messages.length > 0 ? (
                    messages.map(msg => (
                      <div 
                        key={msg.id} 
                        className={cn(
                          "p-8 hover:bg-gray-50 transition-colors cursor-pointer",
                          !msg.read ? "bg-blue-50/30" : ""
                        )}
                        onClick={() => markMessageAsRead(msg.id)}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                              {msg.name?.charAt(0) || '?'}
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900">{msg.name}</h3>
                              <p className="text-sm text-gray-500">{msg.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleString()}</span>
                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                              {!msg.read && (
                                <button 
                                  onClick={() => {
                                    markMessageAsRead(msg.id);
                                    toast.success('Message marked as read');
                                  }}
                                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors bg-gray-50 rounded-lg"
                                  title="Mark as Read"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </button>
                              )}
                              <button 
                                onClick={() => setDeletingMessage(msg.id)}
                                className="p-2 text-gray-400 hover:text-red-600 transition-colors bg-gray-50 rounded-lg"
                                title="Delete Message"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="ml-16">
                          <p className="font-bold text-gray-800 mb-2">{msg.subject}</p>
                          <p className="text-gray-600 leading-relaxed mb-4">{msg.message}</p>
                          
                          {msg.reply ? (
                            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                              <p className="text-xs font-bold text-blue-600 mb-1 flex items-center gap-2">
                                <CheckCircle className="h-3 w-3" />
                                Replied on {new Date(msg.repliedAt!).toLocaleString()}
                              </p>
                              <p className="text-sm text-blue-900 italic">"{msg.reply}"</p>
                              <div className="mt-4 pt-4 border-t border-blue-100 flex gap-4">
                                <a 
                                  href={`mailto:${msg.email}?subject=Re: ${msg.subject}&body=${encodeURIComponent(msg.reply)}`}
                                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                                >
                                  <Mail className="h-3 w-3" />
                                  Resend via Email Client
                                </a>
                              </div>
                            </div>
                          ) : replyingTo === msg.id ? (
                            <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                              <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Type your reply here..."
                                className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                              />
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => {
                                    if (replyText.trim()) {
                                      replyToMessage(msg.id, replyText);
                                      // Also open the mail client
                                      window.location.href = `mailto:${msg.email}?subject=Re: ${msg.subject}&body=${encodeURIComponent(replyText)}`;
                                      setReplyingTo(null);
                                      setReplyText('');
                                      toast.success('Reply saved and email client opened');
                                    }
                                  }}
                                  className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all flex items-center gap-2"
                                >
                                  <Send className="h-4 w-4" />
                                  Send & Open Email Client
                                </button>
                                <button 
                                  onClick={() => {
                                    if (replyText.trim()) {
                                      replyToMessage(msg.id, replyText);
                                      setReplyingTo(null);
                                      setReplyText('');
                                      toast.success('Reply saved internally');
                                    }
                                  }}
                                  className="bg-gray-100 text-gray-700 px-6 py-2 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all"
                                >
                                  Save Internally Only
                                </button>
                                <button 
                                  onClick={() => setReplyingTo(null)}
                                  className="bg-gray-50 text-gray-400 px-6 py-2 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setReplyingTo(msg.id);
                              }}
                              className="text-blue-600 font-bold text-sm flex items-center gap-2 hover:underline"
                            >
                              <Mail className="h-4 w-4" />
                              Reply to Customer
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-20 text-center text-gray-400">
                      <Mail className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p>No messages yet</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  {/* Profile Settings */}
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-3 mb-8">
                      <User className="h-6 w-6 text-blue-600" />
                      <h2 className="text-xl font-bold text-gray-900">Profile Settings</h2>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="relative group">
                          <img 
                            src={adminPhoto} 
                            alt="Admin Profile" 
                            className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                          />
                          <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Plus className="h-6 w-6 text-white" />
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setAdminPhoto(reader.result as string);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        </div>
                        <div className="flex-1 space-y-4 w-full">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase">Admin Name</label>
                            <input 
                              type="text" 
                              value={adminName}
                              onChange={(e) => setAdminName(e.target.value)}
                              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none font-bold"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase">Admin Photo URL (Optional)</label>
                            <input 
                              type="text" 
                              value={adminPhoto}
                              onChange={(e) => setAdminPhoto(e.target.value)}
                              placeholder="Paste image URL here..."
                              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none text-sm"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end pt-4">
                        <button 
                          onClick={() => {
                            localStorage.setItem('adminName', adminName);
                            localStorage.setItem('adminPhoto', adminPhoto);
                            toast.success('Profile updated successfully');
                          }}
                          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-sm"
                        >
                          Save Profile Changes
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Category Management */}
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-3 mb-8">
                      <LayoutGrid className="h-6 w-6 text-purple-600" />
                      <h2 className="text-xl font-bold text-gray-900">Category Management</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase">Add New Category</label>
                          <div className="flex gap-2">
                            <input 
                              type="text"
                              value={newCategory}
                              onChange={(e) => setNewCategory(e.target.value)}
                              placeholder="Enter category name..."
                              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-600 outline-none text-sm"
                            />
                            <button 
                              onClick={() => {
                                if (newCategory.trim()) {
                                  addCategory(newCategory.trim());
                                  setNewCategory('');
                                  toast.success(`Category "${newCategory}" added successfully`);
                                }
                              }}
                              className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 transition-all shadow-sm"
                            >
                              Add
                            </button>
                          </div>
                        </div>

                        <div className="p-6 bg-purple-50 rounded-2xl border border-purple-100">
                          <div className="flex items-start space-x-3">
                            <AlertCircle className="h-5 w-5 text-purple-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-bold text-purple-900">Pro Tip</p>
                              <p className="text-xs text-purple-700 leading-relaxed">
                                Deleting a category will automatically reassign all its products to the "Uncategorized" category.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-xs font-bold text-gray-400 uppercase">Existing Categories</label>
                        <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                          {categories.map(cat => (
                            <div key={cat} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-purple-100">
                              <span className="font-medium text-gray-700">{cat}</span>
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => setEditingCategory({ oldName: cat, newName: cat })}
                                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors bg-white rounded-lg shadow-sm"
                                  title="Rename Category"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button 
                                  onClick={() => setDeletingCategory(cat)}
                                  className="p-2 text-gray-400 hover:text-red-600 transition-colors bg-white rounded-lg shadow-sm"
                                  title="Delete Category"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Security Settings */}
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-3 mb-8">
                      <Shield className="h-6 w-6 text-blue-600" />
                      <h2 className="text-xl font-bold text-gray-900">Security Settings</h2>
                    </div>
                    
                    <div className="space-y-6">
                      {[
                        { label: 'Two-Factor Authentication', desc: 'Add an extra layer of security to your account', enabled: true },
                        { label: 'Login Notifications', desc: 'Get notified when someone logs into your account', enabled: true },
                        { label: 'Session Timeout', desc: 'Automatically log out after 30 minutes of inactivity', enabled: false },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                          <div>
                            <p className="font-bold text-gray-900">{item.label}</p>
                            <p className="text-xs text-gray-500">{item.desc}</p>
                          </div>
                          <button className={cn(
                            "w-12 h-6 rounded-full transition-all relative",
                            item.enabled ? "bg-blue-600" : "bg-gray-300"
                          )}>
                            <div className={cn(
                              "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                              item.enabled ? "right-1" : "left-1"
                            )} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 pt-8 border-t flex gap-4">
                      <button 
                        onClick={() => setIsSecurityModalOpen(true)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
                      >
                        Update Security Features
                      </button>
                      <button 
                        onClick={() => setIsAuditLogOpen(true)}
                        className="border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all"
                      >
                        Security Audit Log
                      </button>
                    </div>
                  </div>

                  {/* System Maintenance */}
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-3 mb-8">
                      <RefreshCw className="h-6 w-6 text-orange-600" />
                      <h2 className="text-xl font-bold text-gray-900">System Maintenance</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button 
                        onClick={() => toast.info("Optimizing database...")}
                        className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-left hover:border-orange-200 transition-all group"
                      >
                        <Database className="h-6 w-6 text-orange-600 mb-4 group-hover:scale-110 transition-transform" />
                        <p className="font-bold text-gray-900">Optimize Database</p>
                        <p className="text-xs text-gray-500">Clean up temporary data and logs</p>
                      </button>
                      <button 
                        onClick={() => toast.info("Checking for updates...")}
                        className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-left hover:border-blue-200 transition-all group"
                      >
                        <Terminal className="h-6 w-6 text-blue-600 mb-4 group-hover:scale-110 transition-transform" />
                        <p className="font-bold text-gray-900">System Update</p>
                        <p className="text-xs text-gray-500">Check for latest software version</p>
                      </button>
                    </div>

                    <div className="mt-8 pt-8 border-t">
                      <button 
                        onClick={() => setIsMaintenanceModalOpen(true)}
                        className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700 transition-all flex items-center justify-center space-x-2"
                      >
                        <ShieldCheck className="h-5 w-5" />
                        <span>Run Full System Maintenance</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Current Session */}
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-3 mb-6">
                      <History className="h-5 w-5 text-green-600" />
                      <h3 className="font-bold text-gray-900">Current Session</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 rounded-2xl">
                        <p className="text-xs text-green-600 font-bold uppercase mb-1">Status</p>
                        <p className="text-sm font-bold text-green-700">Active & Secure</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs text-gray-400 uppercase font-bold">Details</p>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">IP Address</span>
                          <span className="font-bold">192.168.1.1</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Location</span>
                          <span className="font-bold">Kigali, Rwanda</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Device</span>
                          <span className="font-bold">MacBook Pro</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-blue-900 p-8 rounded-3xl shadow-xl text-white">
                    <h3 className="font-bold mb-6">Admin Support</h3>
                    <p className="text-sm text-blue-200 mb-8 leading-relaxed">
                      Need help with security or maintenance? Contact our technical support team.
                    </p>
                    <button className="w-full bg-white text-blue-900 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all">
                      Contact Support
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'employees' && (
            <motion.div
              key="employees"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <EmployeesTab
                employees={employees}
                addEmployee={addEmployee}
                updateEmployee={updateEmployee}
                deleteEmployee={deleteEmployee}
                addActivity={addActivity}
                formatPrice={formatPrice}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      </div>{/* end flex flex-1 */}

      {/* Category Modal */}
      <AnimatePresence>
        {isAddingCategory && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingCategory(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-bold text-gray-900">Manage Categories</h2>
                <button onClick={() => setIsAddingCategory(false)} className="p-2 hover:bg-gray-200 rounded-full">
                  <LucideX className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New category name..."
                    className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                  <button 
                    onClick={() => {
                      if (newCategory) {
                        addCategory(newCategory);
                        setNewCategory('');
                        toast.success(`Category "${newCategory}" added successfully`);
                      }
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-3">
                  <p className="text-xs font-bold text-gray-400 uppercase">Current Categories</p>
                  <div className="grid grid-cols-1 gap-2">
                    {categories.map(cat => (
                      <div key={cat} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl group hover:bg-gray-100 transition-all">
                        <span className="text-sm font-medium text-gray-700">{cat}</span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                          <button 
                            onClick={() => setEditingCategory({ oldName: cat, newName: cat })}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Rename Category"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => setDeletingCategory(cat)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete Category"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Security Features Modal */}
      <AnimatePresence>
        {isSecurityModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSecurityModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b flex justify-between items-center bg-gray-50">
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Update Security Features</h2>
                </div>
                <button 
                  onClick={() => setIsSecurityModalOpen(false)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <LucideX className="h-6 w-6" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-4">
                  <AlertCircle className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <p className="font-bold text-blue-900">Security Update Available</p>
                    <p className="text-sm text-blue-700">A new security patch (v2.4.1) is available for the authentication system. This update fixes several vulnerabilities and improves session handling.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900">Pending Updates</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Auth Module Patch', version: 'v2.4.1', priority: 'High' },
                      { name: 'Database Encryption Update', version: 'v1.8.0', priority: 'Medium' },
                      { name: 'SSL Certificate Renewal', version: 'N/A', priority: 'Critical' }
                    ].map((update, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div>
                          <p className="font-bold text-gray-900">{update.name}</p>
                          <p className="text-xs text-gray-500">Version: {update.version}</p>
                        </div>
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase",
                          update.priority === 'Critical' ? "bg-red-100 text-red-600" :
                          update.priority === 'High' ? "bg-orange-100 text-orange-600" :
                          "bg-blue-100 text-blue-600"
                        )}>
                          {update.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => {
                    toast.promise(new Promise(resolve => setTimeout(resolve, 2000)), {
                      loading: 'Updating security features...',
                      success: 'Security features updated successfully!',
                      error: 'Failed to update security features.'
                    });
                    setIsSecurityModalOpen(false);
                  }}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className="h-5 w-5" />
                  Apply All Security Updates
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Category Modal */}
      <AnimatePresence>
        {editingCategory && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingCategory(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-bold text-gray-900">Rename Category</h2>
                <button onClick={() => setEditingCategory(null)} className="p-2 hover:bg-gray-200 rounded-full">
                  <LucideX className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Category Name</label>
                  <input 
                    type="text"
                    value={editingCategory.newName}
                    onChange={(e) => setEditingCategory({ ...editingCategory, newName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none"
                    autoFocus
                  />
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      if (editingCategory.newName.trim() && editingCategory.newName.trim() !== editingCategory.oldName) {
                        updateCategory(editingCategory.oldName, editingCategory.newName.trim());
                        toast.success(`Category renamed to "${editingCategory.newName}"`);
                      }
                      setEditingCategory(null);
                    }}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
                  >
                    Save Changes
                  </button>
                  <button 
                    onClick={() => setEditingCategory(null)}
                    className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Category Confirmation Modal */}
      <AnimatePresence>
        {deletingCategory && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingCategory(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trash2 className="h-10 w-10 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Delete Category?</h2>
                <p className="text-gray-500 mb-8 leading-relaxed">
                  Are you sure you want to delete <span className="font-bold text-gray-900">"{deletingCategory}"</span>? 
                  All products in this category will be moved to <span className="font-bold text-gray-900">"Uncategorized"</span>.
                </p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => {
                      deleteCategory(deletingCategory);
                      toast.success(`Category "${deletingCategory}" deleted`);
                      setDeletingCategory(null);
                    }}
                    className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200"
                  >
                    Yes, Delete
                  </button>
                  <button 
                    onClick={() => setDeletingCategory(null)}
                    className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Order Confirmation Modal */}
      <AnimatePresence>
        {deletingOrder && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingOrder(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="h-10 w-10 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Remove Order?</h2>
                <p className="text-gray-500 mb-8 leading-relaxed">
                  Are you sure you want to remove order <span className="font-bold text-gray-900">#{deletingOrder}</span>? 
                  This action cannot be undone.
                </p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => {
                      deleteOrder(deletingOrder);
                      toast.success('Order deleted successfully');
                      setDeletingOrder(null);
                    }}
                    className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200"
                  >
                    Yes, Remove
                  </button>
                  <button 
                    onClick={() => setDeletingOrder(null)}
                    className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Product Confirmation Modal */}
      <AnimatePresence>
        {deletingProduct && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingProduct(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="h-10 w-10 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Delete Product?</h2>
                <p className="text-gray-500 mb-8 leading-relaxed">
                  Are you sure you want to delete this product? It will be removed from the website too.
                  This action cannot be undone.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      deleteProduct(deletingProduct);
                      toast.success('Product deleted successfully');
                      setDeletingProduct(null);
                    }}
                    className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setDeletingProduct(null)}
                    className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Message Confirmation Modal */}
      <AnimatePresence>
        {deletingMessage && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingMessage(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="h-10 w-10 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Delete Message?</h2>
                <p className="text-gray-500 mb-8 leading-relaxed">
                  Are you sure you want to delete this message? 
                  This action cannot be undone.
                </p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => {
                      deleteMessage(deletingMessage);
                      toast.success('Message deleted successfully');
                      setDeletingMessage(null);
                    }}
                    className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200"
                  >
                    Yes, Delete
                  </button>
                  <button 
                    onClick={() => setDeletingMessage(null)}
                    className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Security Audit Log Modal */}
      <AnimatePresence>
        {isAuditLogOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAuditLogOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-8 border-b flex justify-between items-center bg-gray-50">
                <div className="flex items-center gap-3">
                  <History className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Security Audit Log</h2>
                </div>
                <button 
                  onClick={() => setIsAuditLogOpen(false)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <LucideX className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                <div className="mb-6 flex justify-between items-center">
                  <p className="text-sm text-gray-500">Showing last 50 activity events</p>
                  <button 
                    onClick={() => setIsAddingLog(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Insert Log Entry</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {activityLog.map((log, i) => (
                    <div key={log.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "p-2 rounded-lg",
                          log.type === 'system' ? "bg-blue-100 text-blue-600" :
                          log.type === 'order' ? "bg-green-100 text-green-600" :
                          log.type === 'product' ? "bg-purple-100 text-purple-600" :
                          "bg-orange-100 text-orange-600"
                        )}>
                          {log.type === 'system' ? <Shield className="h-5 w-5" /> :
                           log.type === 'order' ? <ShoppingBag className="h-5 w-5" /> :
                           log.type === 'product' ? <Package className="h-5 w-5" /> :
                           <User className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{log.action}</p>
                          <p className="text-xs text-gray-500">Admin: {log.adminName || 'System'} • Type: {log.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{new Date(log.timestamp).toLocaleString()}</p>
                        <p className="text-[10px] font-bold uppercase text-blue-600">Success</p>
                      </div>
                    </div>
                  ))}
                  {activityLog.length === 0 && (
                    <div className="text-center py-20 text-gray-400 italic">
                      No activity logs found.
                    </div>
                  )}
                </div>
              </div>

              <div className="p-8 border-t bg-gray-50 flex justify-between items-center">
                <p className="text-sm text-gray-500">Showing last 50 security events</p>
                <button className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export Full Log (CSV)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Insert Log Modal */}
      <AnimatePresence>
        {isAddingLog && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingLog(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-bold text-gray-900">Insert Log Entry</h2>
                <button onClick={() => setIsAddingLog(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                  <LucideX className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Action Description</label>
                  <textarea 
                    value={newLogAction}
                    onChange={e => setNewLogAction(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Describe the activity..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Log Type</label>
                  <select 
                    value={newLogType}
                    onChange={e => setNewLogType(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="system">System</option>
                    <option value="product">Product</option>
                    <option value="order">Order</option>
                    <option value="user">User</option>
                  </select>
                </div>
                <button 
                  onClick={() => {
                    if (!newLogAction.trim()) {
                      toast.error('Please enter an action description');
                      return;
                    }
                    addActivity(newLogAction, newLogType, adminName);
                    setNewLogAction('');
                    setIsAddingLog(false);
                    toast.success('Log entry inserted successfully');
                  }}
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                >
                  Insert Log
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* System Maintenance Modal */}
      <AnimatePresence>
        {isMaintenanceModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isMaintenanceRunning && setIsMaintenanceModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b flex justify-between items-center bg-gray-50">
                <div className="flex items-center gap-3">
                  <Settings className="h-6 w-6 text-orange-600" />
                  <h2 className="text-2xl font-bold text-gray-900">System Maintenance</h2>
                </div>
                {!isMaintenanceRunning && (
                  <button 
                    onClick={() => setIsMaintenanceModalOpen(false)}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <LucideX className="h-6 w-6" />
                  </button>
                )}
              </div>

              <div className="p-8 space-y-8 text-center">
                {!isMaintenanceRunning ? (
                  <>
                    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <RefreshCw className="h-10 w-10 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Run Full Maintenance</h3>
                      <p className="text-gray-500">This will optimize your database, clear cache, and perform a security scan. This process may take a few minutes.</p>
                    </div>
                    <div className="space-y-3 text-left bg-gray-50 p-6 rounded-2xl border border-gray-100">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-2">Tasks to be performed:</p>
                      {[
                        'Database Index Optimization',
                        'Clear Temporary Cache Files',
                        'Security Vulnerability Scan',
                        'System Log Rotation',
                        'Dependency Integrity Check'
                      ].map((task, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm text-gray-700">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {task}
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => {
                        setIsMaintenanceRunning(true);
                        let progress = 0;
                        const interval = setInterval(() => {
                          progress += 5;
                          setMaintenanceProgress(progress);
                          if (progress >= 100) {
                            clearInterval(interval);
                            setIsMaintenanceRunning(false);
                            setMaintenanceProgress(0);
                            toast.success('System maintenance completed successfully!');
                            setIsMaintenanceModalOpen(false);
                          }
                        }, 100);
                      }}
                      className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg"
                    >
                      Start Maintenance Now
                    </button>
                  </>
                ) : (
                  <div className="py-10 space-y-6">
                    <div className="relative w-32 h-32 mx-auto">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="60"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          className="text-gray-100"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="60"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={377}
                          strokeDashoffset={377 - (377 * maintenanceProgress) / 100}
                          className="text-orange-600 transition-all duration-300"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-900">{maintenanceProgress}%</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Maintenance in Progress</h3>
                      <p className="text-gray-500 animate-pulse">Please do not close this window...</p>
                    </div>
                    <div className="text-sm text-gray-400 italic">
                      {maintenanceProgress < 20 && "Optimizing database indexes..."}
                      {maintenanceProgress >= 20 && maintenanceProgress < 40 && "Clearing temporary cache files..."}
                      {maintenanceProgress >= 40 && maintenanceProgress < 70 && "Running security vulnerability scan..."}
                      {maintenanceProgress >= 70 && maintenanceProgress < 90 && "Rotating system logs..."}
                      {maintenanceProgress >= 90 && "Finalizing maintenance tasks..."}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {(isAddingProduct || editingProduct) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsAddingProduct(false); setEditingProduct(null); }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-8 border-b flex justify-between items-center bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button 
                  onClick={() => { setIsAddingProduct(false); setEditingProduct(null); }}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <LucideX className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                <ProductForm 
                  initialData={editingProduct || undefined}
                  onSave={(data) => {
                    if (editingProduct) {
                      updateProduct({ ...editingProduct, ...data });
                    } else {
                      addProduct({ ...data, id: Math.random().toString(36).substr(2, 9), rating: 5, isFeatured: false });
                    }
                    setIsAddingProduct(false);
                    setEditingProduct(null);
                  }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Order Modal */}
      <AnimatePresence>
        {editingOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingOrder(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Edit Order #{editingOrder.id}</h2>
                  <p className="text-sm text-gray-500">Modify customer details or order items</p>
                </div>
                <button 
                  onClick={() => setEditingOrder(null)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <LucideX className="h-6 w-6 text-gray-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <OrderForm 
                  initialData={editingOrder} 
                  onSave={(updatedData) => {
                    updateOrder({ ...editingOrder, ...updatedData });
                    setEditingOrder(null);
                    toast.success('Order updated successfully');
                  }} 
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const API_BASE_SC = import.meta.env.VITE_API_URL ?? '';

const SiteContentManager = () => {
  const { siteSettings, updateSiteSettings, uploadImage } = useShop();
  const [localSettings, setLocalSettings] = useState(siteSettings);
  const [isSaving, setIsSaving] = useState(false);
  const heroFileRefs = useRef<(HTMLInputElement | null)[]>([]);
  const teamFileRefs = useRef<(HTMLInputElement | null)[]>([]);
  const testimonialFileRefs = useRef<(HTMLInputElement | null)[]>([]);
  const logoFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalSettings(siteSettings);
  }, [siteSettings]);

  const slides = localSettings.heroSlides || [];
  const team = localSettings.teamMembers || [];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`${API_BASE_SC}/api/site-settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(localSettings),
      });
      if (!res.ok) throw new Error('Save failed');
      updateSiteSettings(localSettings);
      toast.success('Site content saved successfully');
    } catch {
      toast.error('Failed to save changes — please try again');
    } finally {
      setIsSaving(false);
    }
  };

  const handleHeroImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadImage(file);
      const newSlides = [...localSettings.heroSlides];
      newSlides[index] = { ...newSlides[index], image: url };
      setLocalSettings({ ...localSettings, heroSlides: newSlides });
      toast.success('Hero image uploaded');
    } catch (error) {
      toast.error('Failed to upload hero image');
    }
  };

  const handleTeamImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadImage(file);
      const newTeam = [...localSettings.teamMembers];
      newTeam[index] = { ...newTeam[index], image: url };
      setLocalSettings({ ...localSettings, teamMembers: newTeam });
      toast.success('Team member photo uploaded');
    } catch (error) {
      toast.error('Failed to upload team photo');
    }
  };

  const handleTestimonialImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadImage(file);
      const newTestimonials = [...localSettings.testimonials];
      newTestimonials[index] = { ...newTestimonials[index], image: url };
      setLocalSettings({ ...localSettings, testimonials: newTestimonials });
      toast.success('Testimonial photo uploaded');
    } catch (error) {
      toast.error('Failed to upload testimonial photo');
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadImage(file);
      setLocalSettings({ ...localSettings, logoUrl: url });
      toast.success('Company logo uploaded');
    } catch (error) {
      toast.error('Failed to upload logo');
    }
  };

  return (
    <div className="space-y-12">
      {/* General Settings */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">General Settings</h2>
            <p className="text-gray-500">Manage your company branding</p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="space-y-4">
            <label className="text-sm font-bold text-gray-700">Company Logo</label>
            <div className="relative w-48 h-48 rounded-2xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 group">
              {localSettings.logoUrl ? (
                <img src={localSettings.logoUrl} alt="Company Logo" className="w-full h-full object-contain p-4" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                  <Globe className="h-8 w-8 mb-2" />
                  <span className="text-xs font-medium">No logo uploaded</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button 
                  onClick={() => logoFileRef.current?.click()}
                  className="bg-white text-gray-900 p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                  title="Upload Logo"
                >
                  <Upload className="h-5 w-5" />
                </button>
                {localSettings.logoUrl && (
                  <button 
                    onClick={() => setLocalSettings({ ...localSettings, logoUrl: '' })}
                    className="bg-white text-red-600 p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                    title="Remove Logo"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
              <input 
                type="file" 
                ref={logoFileRef}
                className="hidden" 
                accept="image/*"
                onChange={handleLogoUpload}
              />
            </div>
            <p className="text-xs text-gray-400 italic">Recommended: Transparent PNG or SVG</p>
          </div>

          <div className="flex-1 space-y-4 w-full">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Logo URL (Alternative)</label>
              <input 
                type="text" 
                value={localSettings.logoUrl || ''}
                onChange={(e) => setLocalSettings({ ...localSettings, logoUrl: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm"
                placeholder="https://example.com/logo.png"
              />
              <p className="text-[10px] text-gray-400">You can either upload an image or paste a direct URL.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Hero Section</h2>
            <p className="text-gray-500">Manage the slides on your home page</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                const newSlides = [...(localSettings.heroSlides || [])];
                newSlides.push({
                  image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1920",
                  title: { en: "New Slide", fr: "Nouvelle Diapo", rw: "Iyindi Diapo" },
                  subtitle: { en: "Add a catchy subtitle here", fr: "Ajoutez un sous-titre ici", rw: "Shyiraho akandi jambo" },
                  cta: { en: "Learn More", fr: "En Savoir Plus", rw: "Menya byinshi" }
                });
                setLocalSettings({ ...localSettings, heroSlides: newSlides });
              }}
              className="bg-gray-100 text-gray-700 px-6 py-2 rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Slide</span>
            </button>
            <button 
              onClick={handleSave}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all"
            >
              Save Changes
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(localSettings.heroSlides || []).map((slide, idx) => (
            <div key={idx} className="relative border border-gray-100 rounded-2xl p-4 space-y-4">
              <button 
                onClick={() => {
                  const newSlides = localSettings.heroSlides.filter((_, i) => i !== idx);
                  setLocalSettings({ ...localSettings, heroSlides: newSlides });
                }}
                className="absolute -top-2 -right-2 p-2 bg-red-100 text-red-600 rounded-full shadow-lg hover:bg-red-600 hover:text-white transition-all z-10"
              >
                <LucideX className="h-4 w-4" />
              </button>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 group">
                <img src={slide?.image} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => heroFileRefs.current[idx]?.click()}
                    className="bg-white text-gray-900 p-2 rounded-full shadow-lg"
                  >
                    <Upload className="h-5 w-5" />
                  </button>
                </div>
                <input 
                  type="file" 
                  ref={el => heroFileRefs.current[idx] = el}
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => handleHeroImageUpload(idx, e)}
                />
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Title (EN)</label>
                  <input 
                    type="text" 
                    value={slide.title.en}
                    onChange={(e) => {
                      const newSlides = [...localSettings.heroSlides];
                      newSlides[idx] = { ...newSlides[idx], title: { ...newSlides[idx].title, en: e.target.value } };
                      setLocalSettings({ ...localSettings, heroSlides: newSlides });
                    }}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Title (FR)</label>
                  <input 
                    type="text" 
                    value={slide.title.fr}
                    onChange={(e) => {
                      const newSlides = [...localSettings.heroSlides];
                      newSlides[idx] = { ...newSlides[idx], title: { ...newSlides[idx].title, fr: e.target.value } };
                      setLocalSettings({ ...localSettings, heroSlides: newSlides });
                    }}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Title (RW)</label>
                  <input 
                    type="text" 
                    value={slide.title.rw}
                    onChange={(e) => {
                      const newSlides = [...localSettings.heroSlides];
                      newSlides[idx] = { ...newSlides[idx], title: { ...newSlides[idx].title, rw: e.target.value } };
                      setLocalSettings({ ...localSettings, heroSlides: newSlides });
                    }}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Subtitle (EN)</label>
                  <input 
                    type="text" 
                    value={slide.subtitle.en}
                    onChange={(e) => {
                      const newSlides = [...localSettings.heroSlides];
                      newSlides[idx] = { ...newSlides[idx], subtitle: { ...newSlides[idx].subtitle, en: e.target.value } };
                      setLocalSettings({ ...localSettings, heroSlides: newSlides });
                    }}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Subtitle (FR)</label>
                  <input 
                    type="text" 
                    value={slide.subtitle.fr}
                    onChange={(e) => {
                      const newSlides = [...localSettings.heroSlides];
                      newSlides[idx] = { ...newSlides[idx], subtitle: { ...newSlides[idx].subtitle, fr: e.target.value } };
                      setLocalSettings({ ...localSettings, heroSlides: newSlides });
                    }}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Subtitle (RW)</label>
                  <input 
                    type="text" 
                    value={slide.subtitle.rw}
                    onChange={(e) => {
                      const newSlides = [...localSettings.heroSlides];
                      newSlides[idx] = { ...newSlides[idx], subtitle: { ...newSlides[idx].subtitle, rw: e.target.value } };
                      setLocalSettings({ ...localSettings, heroSlides: newSlides });
                    }}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">CTA (EN)</label>
                  <input 
                    type="text" 
                    value={slide.cta.en}
                    onChange={(e) => {
                      const newSlides = [...localSettings.heroSlides];
                      newSlides[idx] = { ...newSlides[idx], cta: { ...newSlides[idx].cta, en: e.target.value } };
                      setLocalSettings({ ...localSettings, heroSlides: newSlides });
                    }}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">CTA (FR)</label>
                  <input 
                    type="text" 
                    value={slide.cta.fr}
                    onChange={(e) => {
                      const newSlides = [...localSettings.heroSlides];
                      newSlides[idx] = { ...newSlides[idx], cta: { ...newSlides[idx].cta, fr: e.target.value } };
                      setLocalSettings({ ...localSettings, heroSlides: newSlides });
                    }}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">CTA (RW)</label>
                  <input 
                    type="text" 
                    value={slide.cta.rw}
                    onChange={(e) => {
                      const newSlides = [...localSettings.heroSlides];
                      newSlides[idx] = { ...newSlides[idx], cta: { ...newSlides[idx].cta, rw: e.target.value } };
                      setLocalSettings({ ...localSettings, heroSlides: newSlides });
                    }}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Meet Our Team</h2>
            <p className="text-gray-500">Update team member details and roles</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                const newTeam = [...(localSettings.teamMembers || [])];
                newTeam.push({
                  name: "New Member",
                  role: { en: "Position", fr: "Poste", rw: "Umwanya" },
                  slogan: { en: "Slogan here", fr: "Slogan ici", rw: "Intero" },
                  image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
                  phone: "+250",
                  socials: { facebook: "#", instagram: "#", tiktok: "#" }
                });
                setLocalSettings({ ...localSettings, teamMembers: newTeam });
              }}
              className="bg-gray-100 text-gray-700 px-6 py-2 rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Member</span>
            </button>
            <button 
              onClick={handleSave}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all"
            >
              Save Changes
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(localSettings.teamMembers || []).map((member, idx) => (
            <div key={idx} className="relative border border-gray-100 rounded-2xl p-6 space-y-4">
              <button 
                onClick={() => {
                  const newTeam = localSettings.teamMembers.filter((_, i) => i !== idx);
                  setLocalSettings({ ...localSettings, teamMembers: newTeam });
                }}
                className="absolute -top-2 -right-2 p-2 bg-red-100 text-red-600 rounded-full shadow-lg hover:bg-red-600 hover:text-white transition-all z-10"
              >
                <LucideX className="h-4 w-4" />
              </button>
              <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden bg-gray-100 group">
                <img src={member?.image} alt={member?.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => teamFileRefs.current[idx]?.click()}
                    className="bg-white text-gray-900 p-2 rounded-full shadow-lg"
                  >
                    <Upload className="h-5 w-5" />
                  </button>
                </div>
                <input 
                  type="file" 
                  ref={el => teamFileRefs.current[idx] = el}
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => handleTeamImageUpload(idx, e)}
                />
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Name</label>
                  <input 
                    type="text" 
                    value={member.name}
                    onChange={(e) => {
                      const newTeam = [...localSettings.teamMembers];
                      newTeam[idx] = { ...newTeam[idx], name: e.target.value };
                      setLocalSettings({ ...localSettings, teamMembers: newTeam });
                    }}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold"
                  />
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Role (EN)</label>
                    <input
                      type="text"
                      value={member.role?.en ?? ''}
                      onChange={(e) => {
                        const newTeam = [...localSettings.teamMembers];
                        newTeam[idx] = { ...newTeam[idx], role: { ...(newTeam[idx].role || {}), en: e.target.value } };
                        setLocalSettings({ ...localSettings, teamMembers: newTeam });
                      }}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Role (FR)</label>
                    <input
                      type="text"
                      value={member.role?.fr ?? ''}
                      onChange={(e) => {
                        const newTeam = [...localSettings.teamMembers];
                        newTeam[idx] = { ...newTeam[idx], role: { ...(newTeam[idx].role || {}), fr: e.target.value } };
                        setLocalSettings({ ...localSettings, teamMembers: newTeam });
                      }}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Role (RW)</label>
                    <input
                      type="text"
                      value={member.role?.rw ?? ''}
                      onChange={(e) => {
                        const newTeam = [...localSettings.teamMembers];
                        newTeam[idx] = { ...newTeam[idx], role: { ...(newTeam[idx].role || {}), rw: e.target.value } };
                        setLocalSettings({ ...localSettings, teamMembers: newTeam });
                      }}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Slogan (EN)</label>
                    <input
                      type="text"
                      value={member.slogan?.en ?? ''}
                      onChange={(e) => {
                        const newTeam = [...localSettings.teamMembers];
                        newTeam[idx] = { ...newTeam[idx], slogan: { ...(newTeam[idx].slogan || {}), en: e.target.value } };
                        setLocalSettings({ ...localSettings, teamMembers: newTeam });
                      }}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm italic"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Slogan (FR)</label>
                    <input
                      type="text"
                      value={member.slogan?.fr ?? ''}
                      onChange={(e) => {
                        const newTeam = [...localSettings.teamMembers];
                        newTeam[idx] = { ...newTeam[idx], slogan: { ...(newTeam[idx].slogan || {}), fr: e.target.value } };
                        setLocalSettings({ ...localSettings, teamMembers: newTeam });
                      }}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm italic"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Slogan (RW)</label>
                    <input
                      type="text"
                      value={member.slogan?.rw ?? ''}
                      onChange={(e) => {
                        const newTeam = [...localSettings.teamMembers];
                        newTeam[idx] = { ...newTeam[idx], slogan: { ...(newTeam[idx].slogan || {}), rw: e.target.value } };
                        setLocalSettings({ ...localSettings, teamMembers: newTeam });
                      }}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm italic"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Phone</label>
                  <input
                    type="text"
                    value={member.phone ?? ''}
                    onChange={(e) => {
                      const newTeam = [...localSettings.teamMembers];
                      newTeam[idx] = { ...newTeam[idx], phone: e.target.value };
                      setLocalSettings({ ...localSettings, teamMembers: newTeam });
                    }}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm"
                    placeholder="+250..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Facebook</label>
                  <input
                    type="text"
                    value={member.socials?.facebook ?? ''}
                    onChange={(e) => {
                      const newTeam = [...localSettings.teamMembers];
                      newTeam[idx] = { ...newTeam[idx], socials: { ...(newTeam[idx].socials || {}), facebook: e.target.value } };
                      setLocalSettings({ ...localSettings, teamMembers: newTeam });
                    }}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm"
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Instagram</label>
                  <input
                    type="text"
                    value={member.socials?.instagram ?? ''}
                    onChange={(e) => {
                      const newTeam = [...localSettings.teamMembers];
                      newTeam[idx] = { ...newTeam[idx], socials: { ...(newTeam[idx].socials || {}), instagram: e.target.value } };
                      setLocalSettings({ ...localSettings, teamMembers: newTeam });
                    }}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm"
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">TikTok</label>
                  <input
                    type="text"
                    value={member.socials?.tiktok ?? ''}
                    onChange={(e) => {
                      const newTeam = [...localSettings.teamMembers];
                      newTeam[idx] = { ...newTeam[idx], socials: { ...(newTeam[idx].socials || {}), tiktok: e.target.value } };
                      setLocalSettings({ ...localSettings, teamMembers: newTeam });
                    }}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm"
                    placeholder="https://tiktok.com/@..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mt-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Customer Testimonials</h2>
            <p className="text-gray-500">Manage customer reviews and feedback</p>
          </div>
          <button 
            onClick={() => {
              const newTestimonial: Testimonial = {
                id: Math.random().toString(36).substr(2, 9),
                name: '',
                location: '',
                message: '',
                rating: 5,
                image: ''
              };
              setLocalSettings({ ...localSettings, testimonials: [...(localSettings.testimonials || []), newTestimonial] });
            }}
            className="flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add Testimonial</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {(localSettings.testimonials || []).map((testimonial, idx) => (
            <div key={testimonial.id} className="relative border border-gray-100 rounded-2xl p-6 space-y-4 text-left">
              <button 
                onClick={() => {
                  const newTestimonials = localSettings.testimonials.filter((_, i) => i !== idx);
                  setLocalSettings({ ...localSettings, testimonials: newTestimonials });
                }}
                className="absolute -top-2 -right-2 p-2 bg-red-100 text-red-600 rounded-full shadow-lg hover:bg-red-600 hover:text-white transition-all z-10"
              >
                <LucideX className="h-4 w-4" />
              </button>
              
              <div className="flex items-start gap-4">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 group flex-shrink-0">
                  <img src={testimonial.image || `https://ui-avatars.com/api/?name=${testimonial.name}`} alt={testimonial.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => testimonialFileRefs.current[idx]?.click()}
                      className="bg-white text-gray-900 p-1.5 rounded-full shadow-lg"
                    >
                      <Upload className="h-4 w-4" />
                    </button>
                  </div>
                  <input 
                    type="file" 
                    ref={el => testimonialFileRefs.current[idx] = el}
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => handleTestimonialImageUpload(idx, e)}
                  />
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Customer Name</label>
                      <input 
                        type="text" 
                        value={testimonial.name}
                        onChange={(e) => {
                          const newTestimonials = [...localSettings.testimonials];
                          newTestimonials[idx] = { ...newTestimonials[idx], name: e.target.value };
                          setLocalSettings({ ...localSettings, testimonials: newTestimonials });
                        }}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Rating (1-5)</label>
                      <select 
                        value={testimonial.rating}
                        onChange={(e) => {
                          const newTestimonials = [...localSettings.testimonials];
                          newTestimonials[idx] = { ...newTestimonials[idx], rating: Number(e.target.value) };
                          setLocalSettings({ ...localSettings, testimonials: newTestimonials });
                        }}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold"
                      >
                        {[1, 2, 3, 4, 5].map(num => <option key={num} value={num}>{num} Stars</option>)}
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Location (Optional)</label>
                    <input 
                      type="text" 
                      value={testimonial.location || ''}
                      onChange={(e) => {
                        const newTestimonials = [...localSettings.testimonials];
                        newTestimonials[idx] = { ...newTestimonials[idx], location: e.target.value };
                        setLocalSettings({ ...localSettings, testimonials: newTestimonials });
                      }}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm"
                      placeholder="e.g. Kigali, Rwanda"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Message/Review</label>
                    <textarea 
                      value={testimonial.message}
                      onChange={(e) => {
                        const newTestimonials = [...localSettings.testimonials];
                        newTestimonials[idx] = { ...newTestimonials[idx], message: e.target.value };
                        setLocalSettings({ ...localSettings, testimonials: newTestimonials });
                      }}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm min-h-[100px]"
                      placeholder="Write the customer's review here..."
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="pt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving…' : 'Save All Site Content'}
        </button>
      </div>
    </div>
  );
};

interface ProductFormProps {
  initialData?: Partial<Product>;
  onSave: (data: any) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSave }) => {
  const { categories, uploadImage } = useShop();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    price: initialData?.price || 0,
    oldPrice: initialData?.oldPrice || 0,
    category: initialData?.category || categories[0],
    description: initialData?.description || '',
    stock: initialData?.stock || 0,
    images: initialData?.images || [''],
    variations: initialData?.variations || [] as Variation[],
    cost: initialData?.cost || 0,
    salesType: initialData?.salesType || 'online' as 'online' | 'offline',
    salePrice: initialData?.salePrice || 0,
    saleDate: initialData?.saleDate ? initialData.saleDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
    offlineDeliveryFee: initialData?.offlineDeliveryFee || 0,
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      toast.loading(`Uploading ${files.length} image(s)...`, { id: 'uploading' });
      const uploadPromises = files.map(file => uploadImage(file));
      const urls = await Promise.all(uploadPromises);
      
      const currentImages = formData.images.filter(img => img !== '');
      setFormData({ ...formData, images: [...currentImages, ...urls] });
      toast.success('Images uploaded successfully', { id: 'uploading' });
    } catch (error) {
      toast.error('Failed to upload images', { id: 'uploading' });
    }
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const addVariation = () => {
    const newVariation: Variation = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      value: '',
      stock: 0,
      priceModifier: 0
    };
    setFormData({ ...formData, variations: [...formData.variations, newVariation] });
  };

  const removeVariation = (id: string) => {
    setFormData({ ...formData, variations: formData.variations.filter(v => v.id !== id) });
  };

  const updateVariation = (id: string, field: keyof Variation, value: any) => {
    setFormData({
      ...formData,
      variations: formData.variations.map(v => v.id === id ? { ...v, [field]: value } : v)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.salesType === 'offline') {
      if (!formData.salePrice || formData.salePrice <= 0) {
        toast.error('Enter a valid sale price for this offline sale');
        return;
      }
      if (!formData.saleDate) {
        toast.error('Select a sale date for this offline sale');
        return;
      }
    }

    onSave({
      ...formData,
      published: formData.salesType === 'online',
      // Offline-only fields are meaningless for an online product — keep them zeroed out.
      ...(formData.salesType === 'online'
        ? { salePrice: 0, saleDate: undefined, offlineDeliveryFee: 0 }
        : { saleDate: new Date(formData.saleDate).toISOString() }),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Product Title</label>
          <input
            required
            type="text"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="e.g. Smart LED TV"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Current Price (RWF)</label>
            <input
              required
              type="number"
              value={formData.price}
              onChange={e => setFormData({ ...formData, price: parseInt(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Old Price (Optional)</label>
            <input
              type="number"
              value={formData.oldPrice}
              onChange={e => setFormData({ ...formData, oldPrice: parseInt(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
            Cost Price (RWF)
            <span className="text-[9px] font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Admin Only — never public</span>
          </label>
          <input
            required
            type="number"
            value={formData.cost}
            onChange={e => setFormData({ ...formData, cost: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="What you paid for this item"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Category</label>
          <select
            value={formData.category}
            onChange={e => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Stock Quantity</label>
          <input
            required
            type="number"
            value={formData.stock}
            onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Description</label>
          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Detailed product description..."
          />
        </div>

        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-700">Product Variations</label>
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={() => {
                  const sizes = ['38', '39', '40', '41', '42', '43', '44'];
                  const newVariations = sizes.map(s => ({
                    id: Math.random().toString(36).substr(2, 9),
                    name: 'Size',
                    value: s,
                    stock: 10,
                    priceModifier: 0
                  }));
                  setFormData({ ...formData, variations: [...formData.variations, ...newVariations] });
                }}
                className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-600 hover:text-white transition-all uppercase tracking-tighter"
              >
                + Size Preset
              </button>
              <button 
                type="button"
                onClick={() => {
                  const colors = ['Black', 'White', 'Red', 'Blue', 'Brown'];
                  const newVariations = colors.map(c => ({
                    id: Math.random().toString(36).substr(2, 9),
                    name: 'Color',
                    value: c,
                    stock: 10,
                    priceModifier: 0
                  }));
                  setFormData({ ...formData, variations: [...formData.variations, ...newVariations] });
                }}
                className="text-[10px] font-black text-orange-600 bg-orange-50 px-2 py-1 rounded hover:bg-orange-600 hover:text-white transition-all uppercase tracking-tighter"
              >
                + Color Preset
              </button>
              <button 
                type="button"
                onClick={addVariation}
                className="text-[10px] font-black text-gray-600 bg-gray-50 px-2 py-1 rounded hover:bg-gray-600 hover:text-white transition-all uppercase tracking-tighter"
              >
                + Custom
              </button>
            </div>
          </div>
          
          <div className="space-y-3">
            {formData.variations.map((v) => (
              <div key={v.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3 relative group">
                <button 
                  type="button"
                  onClick={() => removeVariation(v.id)}
                  className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <LucideX className="h-4 w-4" />
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Type (e.g. Size)</label>
                    <input 
                      type="text"
                      value={v.name}
                      onChange={e => updateVariation(v.id, 'name', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                      placeholder="Size"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Value (e.g. XL)</label>
                    <input 
                      type="text"
                      value={v.value}
                      onChange={e => updateVariation(v.id, 'value', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                      placeholder="XL"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Stock</label>
                    <input 
                      type="number"
                      value={v.stock}
                      onChange={e => updateVariation(v.id, 'stock', parseInt(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Price Mod (+/-)</label>
                    <input 
                      type="number"
                      value={v.priceModifier}
                      onChange={e => updateVariation(v.id, 'priceModifier', parseInt(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
            {formData.variations.length === 0 && (
              <p className="text-xs text-gray-400 italic text-center py-4 border-2 border-dashed border-gray-100 rounded-xl">
                No variations added. Using main stock.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <label className="text-sm font-bold text-gray-700 flex items-center justify-between">
            <span>Product Gallery</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">{formData.images.filter(img => img).length} Images Added</span>
          </label>
          
          <div className="grid grid-cols-3 gap-4">
            {formData.images.map((img, i) => (
              img && (
                <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm">
                  <img src={img} alt="Product" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center space-y-2 px-2">
                    <span className="text-[10px] text-white font-black uppercase tracking-widest bg-blue-600 px-2 py-1 rounded">Image {i + 1}</span>
                    <button 
                      type="button"
                      onClick={() => {
                        const newImages = formData.images.filter((_, idx) => idx !== i);
                        setFormData({ ...formData, images: newImages.length ? newImages : [''] });
                      }}
                      className="p-2 bg-red-600 text-white rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )
            ))}
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl hover:border-blue-600 hover:bg-blue-50 transition-all text-gray-400 hover:text-blue-600 group"
            >
              <div className="p-3 bg-gray-50 rounded-full group-hover:bg-blue-100 transition-colors mb-2">
                <Plus className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider">Add Photo</span>
            </button>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Or Add via URL</p>
             <div className="flex gap-2">
               <input
                 type="text"
                 placeholder="Paste image URL here..."
                 className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                 onKeyDown={(e) => {
                   if (e.key === 'Enter') {
                     e.preventDefault();
                     const val = (e.currentTarget as HTMLInputElement).value;
                     if (val) {
                        const newImages = [...formData.images.filter(img => img), val];
                        setFormData({ ...formData, images: newImages });
                        (e.currentTarget as HTMLInputElement).value = '';
                     }
                   }
                 }}
               />
               <button 
                 type="button"
                 onClick={(e) => {
                   const input = (e.currentTarget.previousSibling as HTMLInputElement);
                   if (input.value) {
                      const newImages = [...formData.images.filter(img => img), input.value];
                      setFormData({ ...formData, images: newImages });
                      input.value = '';
                   }
                 }}
                 className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all text-sm"
               >
                 Add
               </button>
             </div>
          </div>

          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*"
            multiple
          />
        </div>

        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold text-gray-500 uppercase">Gallery Preview</p>
            <p className="text-[10px] text-gray-400 italic">Images will appear in a carousel on the store</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {formData.images.map((img, i) => img ? (
              <div key={i} className="aspect-square rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm group relative">
                <img src={img} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-[10px] text-white font-bold px-2 py-1 bg-black/50 rounded-full">#{i + 1}</span>
                </div>
              </div>
            ) : (
              <div key={i} className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center bg-white/50">
                <Package className="h-6 w-6 text-gray-200" />
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8 space-y-4 border-t border-gray-100">
          <label className="text-sm font-bold text-gray-700">How was this sold?</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, salesType: 'online' })}
              className={cn(
                "p-4 rounded-2xl border-2 text-left transition-all",
                formData.salesType === 'online' ? "border-blue-600 bg-blue-50" : "border-gray-100 hover:border-blue-200"
              )}
            >
              <p className={cn("font-bold text-sm", formData.salesType === 'online' ? "text-blue-600" : "text-gray-700")}>Publish to website</p>
              <p className="text-[11px] text-gray-500">Goes live in the catalog, sellable as usual.</p>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, salesType: 'offline' })}
              className={cn(
                "p-4 rounded-2xl border-2 text-left transition-all",
                formData.salesType === 'offline' ? "border-orange-600 bg-orange-50" : "border-gray-100 hover:border-orange-200"
              )}
            >
              <p className={cn("font-bold text-sm", formData.salesType === 'offline' ? "text-orange-600" : "text-gray-700")}>Save as offline sale</p>
              <p className="text-[11px] text-gray-500">Already sold outside the website — bookkeeping only, never shown publicly.</p>
            </button>
          </div>

          {formData.salesType === 'offline' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700">Sale Price (RWF)</label>
                <input
                  required
                  type="number"
                  value={formData.salePrice}
                  onChange={e => setFormData({ ...formData, salePrice: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Actual selling price"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700">Sale Date</label>
                <input
                  required
                  type="date"
                  value={formData.saleDate}
                  onChange={e => setFormData({ ...formData, saleDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700">Delivery Fee (RWF)</label>
                <input
                  type="number"
                  value={formData.offlineDeliveryFee}
                  onChange={e => setFormData({ ...formData, offlineDeliveryFee: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="0 (no website location, entered manually)"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className={cn(
              "w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg",
              formData.salesType === 'online' ? "bg-blue-600 hover:bg-blue-700 shadow-blue-200" : "bg-orange-600 hover:bg-orange-700 shadow-orange-200"
            )}
          >
            {formData.salesType === 'online' ? 'Publish to Website' : 'Save as Offline Sale'}
          </button>
        </div>
      </div>
    </form>
  );
};

interface OrderFormProps {
  initialData: Order;
  onSave: (data: any) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ initialData, onSave }) => {
  const { formatPrice } = useCurrency();
  const [formData, setFormData] = useState({
    customerName: initialData.customerName,
    phone: initialData.phone,
    address: initialData.address,
    items: [...initialData.items],
    status: initialData.status,
    paymentStatus: initialData.paymentStatus,
    total: initialData.total
  });

  const updateItemQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], quantity: newQuantity };
    
    // Recalculate total
    const newTotal = newItems.reduce((sum, item) => {
      const price = item.price + (item.selectedVariation?.priceModifier || 0);
      return sum + price * item.quantity;
    }, 0);

    setFormData({ ...formData, items: newItems, total: newTotal });
  };

  const removeItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    const newTotal = newItems.reduce((sum, item) => {
      const price = item.price + (item.selectedVariation?.priceModifier || 0);
      return sum + price * item.quantity;
    }, 0);
    setFormData({ ...formData, items: newItems, total: newTotal });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Customer Information</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Customer Name</label>
              <input
                required
                type="text"
                value={formData.customerName}
                onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Phone Number</label>
              <input
                required
                type="text"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Delivery Address</label>
              <textarea
                required
                rows={3}
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Order Status</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Order Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Payment Status</label>
              <select
                value={formData.paymentStatus}
                onChange={e => setFormData({ ...formData, paymentStatus: e.target.value as any })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Waiting Confirmation">Waiting Confirmation</option>
                <option value="Pending - Cash on Delivery">Pending - Cash on Delivery</option>
                <option value="Waiting for Bank Transfer">Waiting for Bank Transfer</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Order Items</h3>
        <div className="space-y-3">
          {formData.items.map((item, index) => (
            <div key={`${item.id}-${index}`} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <img src={item.images[0]} alt={item.title} className="w-16 h-16 object-cover rounded-lg" referrerPolicy="no-referrer" />
              <div className="flex-1">
                <h4 className="font-bold text-gray-900">{item.title}</h4>
                {item.selectedVariation && (
                  <p className="text-xs text-gray-500">
                    {item.selectedVariation.name}: {item.selectedVariation.value}
                  </p>
                )}
                <p className="text-sm font-bold text-blue-600">
                  {formatPrice(item.price + (item.selectedVariation?.priceModifier || 0))}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={() => updateItemQuantity(index, item.quantity - 1)}
                    className="px-3 py-1 hover:bg-gray-50 text-gray-600"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 font-bold text-sm border-x border-gray-200">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateItemQuantity(index, item.quantity + 1)}
                    className="px-3 py-1 hover:bg-gray-50 text-gray-600"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
          {formData.items.length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500">No items in this order.</p>
            </div>
          )}
        </div>
      </div>

      <div className="pt-6 border-t flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Total Amount</p>
          <p className="text-2xl font-black text-gray-900">{formatPrice(formData.total)}</p>
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200"
          >
            Save Changes
          </button>
        </div>
      </div>
    </form>
  );
};

const CloseIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

interface EmployeesTabProps {
  employees: Employee[];
  addEmployee: (e: Employee) => Promise<void>;
  updateEmployee: (e: Employee) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  addActivity: (action: string, type: 'order' | 'product' | 'user' | 'system', adminName?: string) => void;
  formatPrice: (n: number) => string;
}

const EmployeesTab: React.FC<EmployeesTabProps> = ({
  employees, addEmployee, updateEmployee, deleteEmployee, addActivity, formatPrice,
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; salary: string; startDate: string } | null>(null);
  const [paymentEmployeeId, setPaymentEmployeeId] = useState<string | null>(null);
  const [paymentForm, setPaymentForm] = useState({ amount: '', status: 'pending' as 'confirmed' | 'pending', date: new Date().toISOString().split('T')[0] });
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [newEmpForm, setNewEmpForm] = useState({ name: '', salary: '', startDate: '' });

  const toggleExpand = (id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleAddEmployee = async () => {
    if (!newEmpForm.name.trim()) { toast.error('Name is required'); return; }
    const employee: Employee = {
      id: Math.random().toString(36).substr(2, 9),
      name: newEmpForm.name.trim(),
      salary: parseFloat(newEmpForm.salary) || 0,
      startDate: newEmpForm.startDate || undefined,
      payments: [],
    };
    try {
      await addEmployee(employee);
      addActivity(`Employee added: ${employee.name}`, 'system');
      toast.success('Employee added');
      setShowAddModal(false);
      setNewEmpForm({ name: '', salary: '', startDate: '' });
    } catch {
      toast.error('Failed to add employee');
    }
  };

  const openEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setEditForm({ name: emp.name, salary: String(emp.salary), startDate: emp.startDate || '' });
  };

  const handleUpdateEmployee = async () => {
    if (!editingEmployee || !editForm) return;
    if (!editForm.name.trim()) { toast.error('Name is required'); return; }
    try {
      await updateEmployee({
        ...editingEmployee,
        name: editForm.name.trim(),
        salary: parseFloat(editForm.salary) || 0,
        startDate: editForm.startDate || undefined,
      });
      addActivity(`Employee updated: ${editForm.name}`, 'system');
      toast.success('Employee updated');
      setEditingEmployee(null);
      setEditForm(null);
    } catch {
      toast.error('Failed to update employee');
    }
  };

  const handleAddPayment = async () => {
    const amount = parseFloat(paymentForm.amount);
    if (!amount || amount <= 0) { toast.error('Enter a valid amount'); return; }
    const emp = employees.find(e => e.id === paymentEmployeeId);
    if (!emp) return;
    const newPayment: SalaryPayment = {
      id: Math.random().toString(36).substr(2, 9),
      amount,
      status: paymentForm.status,
      date: paymentForm.date,
    };
    const payments = [newPayment, ...(emp.payments ?? [])]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
    try {
      await updateEmployee({ ...emp, payments });
      addActivity(`Payment recorded for ${emp.name}: ${formatPrice(amount)}`, 'system');
      toast.success('Payment added');
      setPaymentEmployeeId(null);
      setPaymentForm({ amount: '', status: 'pending', date: new Date().toISOString().split('T')[0] });
    } catch {
      toast.error('Failed to add payment');
    }
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    const emp = employees.find(e => e.id === confirmDeleteId);
    try {
      await deleteEmployee(confirmDeleteId);
      if (emp) addActivity(`Employee deleted: ${emp.name}`, 'system');
      toast.success('Employee deleted');
      setConfirmDeleteId(null);
    } catch {
      toast.error('Failed to delete employee');
    }
  };

  const totalPayroll = employees.reduce((s, e) => s + e.salary, 0);
  const pendingCount = employees.filter(e => (e.payments ?? [])[0]?.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Employees', value: employees.length, color: 'bg-blue-500', icon: <Users className="h-5 w-5" /> },
          { label: 'Monthly Payroll', value: formatPrice(totalPayroll), color: 'bg-green-500', icon: <DollarSign className="h-5 w-5" /> },
          { label: 'Pending Latest Payments', value: pendingCount, color: 'bg-orange-500', icon: <Clock className="h-5 w-5" /> },
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4', s.color)}>
              {s.icon}
            </div>
            <p className="text-xs font-medium text-gray-500 mb-1">{s.label}</p>
            <h3 className="text-xl font-bold text-gray-900">{s.value}</h3>
          </div>
        ))}
      </div>

      {/* Header bar */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Employee List</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-5 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Employee
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-5 w-8" />
                <th className="px-6 py-5">ID</th>
                <th className="px-6 py-5">Name</th>
                <th className="px-6 py-5">Monthly Salary</th>
                <th className="px-6 py-5">Start Date</th>
                <th className="px-6 py-5">Latest Payment</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {employees.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400 text-sm">
                    No employees yet. Click "Add Employee" to get started.
                  </td>
                </tr>
              )}
              {employees.map(emp => {
                const latest = (emp.payments ?? [])[0];
                const expanded = expandedRows.has(emp.id);
                return (
                  <React.Fragment key={emp.id}>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-5">
                        <button onClick={() => toggleExpand(emp.id)} className="text-gray-400 hover:text-blue-600 transition-colors">
                          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </button>
                      </td>
                      <td className="px-6 py-5 text-[11px] text-gray-400 font-mono">{emp.id}</td>
                      <td className="px-6 py-5 font-bold text-gray-900">{emp.name}</td>
                      <td className="px-6 py-5 font-bold text-blue-700">{formatPrice(emp.salary)}</td>
                      <td className="px-6 py-5 text-sm text-gray-600">
                        {emp.startDate
                          ? new Date(emp.startDate.slice(0, 10) + 'T12:00:00').toLocaleDateString()
                          : '—'}
                      </td>
                      <td className="px-6 py-5">
                        {latest ? (
                          <div className="flex flex-col gap-0.5">
                            <span className={cn(
                              'text-[10px] font-bold px-2 py-1 rounded-full uppercase w-fit flex items-center gap-1',
                              latest.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-600'
                            )}>
                              {latest.status === 'confirmed'
                                ? <CheckCircle className="h-3 w-3" />
                                : <Clock className="h-3 w-3" />}
                              {latest.status}
                            </span>
                            <span className="text-xs text-gray-400">
                              {formatPrice(latest.amount)} · {new Date(latest.date).toLocaleDateString()}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">No payments yet</span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            title="Add Payment"
                            onClick={() => {
                              setPaymentEmployeeId(emp.id);
                              setPaymentForm({ amount: '', status: 'pending', date: new Date().toISOString().split('T')[0] });
                            }}
                            className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-all"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                          <button
                            title="Edit Employee"
                            onClick={() => openEdit(emp)}
                            className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            title="Delete Employee"
                            onClick={() => setConfirmDeleteId(emp.id)}
                            className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expanded && (
                      <tr className="bg-blue-50/40">
                        <td colSpan={7} className="px-10 py-4">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                            Payment History (latest 3)
                          </p>
                          {(emp.payments ?? []).length === 0 ? (
                            <p className="text-xs text-gray-400">No payment records yet.</p>
                          ) : (
                            <div className="flex flex-wrap gap-3">
                              {(emp.payments ?? []).map((p, i) => (
                                <div key={p.id || i} className="bg-white border border-gray-100 rounded-xl px-4 py-3 flex flex-col gap-2 min-w-[170px]">
                                  <span className={cn(
                                    'text-[10px] font-bold uppercase',
                                    p.status === 'confirmed' ? 'text-green-600' : 'text-orange-500'
                                  )}>{p.status}</span>
                                  <span className="text-sm font-bold text-gray-900">{formatPrice(p.amount)}</span>
                                  <span className="text-xs text-gray-400">{new Date(p.date).toLocaleDateString()}</span>
                                  {p.status === 'pending' && (
                                    <button
                                      onClick={async () => {
                                        const updated = (emp.payments ?? []).map((pay, j) =>
                                          j === i ? { ...pay, status: 'confirmed' as const } : pay
                                        );
                                        try {
                                          await updateEmployee({ ...emp, payments: updated });
                                          addActivity(`Payment confirmed for ${emp.name}`, 'system');
                                          toast.success('Payment confirmed');
                                        } catch {
                                          toast.error('Failed to confirm payment');
                                        }
                                      }}
                                      className="mt-1 text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded-lg hover:bg-green-200 transition-all flex items-center gap-1 w-fit"
                                    >
                                      <CheckCircle className="h-3 w-3" />
                                      Confirm
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div className="absolute inset-0 bg-black/50" onClick={() => setShowAddModal(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.div className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md z-10" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Employee</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-1 block">Full Name *</label>
                  <input type="text" value={newEmpForm.name} onChange={e => setNewEmpForm(f => ({ ...f, name: e.target.value }))} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="e.g. Jean Bosco" />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-1 block">Monthly Salary</label>
                  <input type="number" min="0" value={newEmpForm.salary} onChange={e => setNewEmpForm(f => ({ ...f, salary: e.target.value }))} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="0" />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-1 block">Start Date</label>
                  <input type="date" value={newEmpForm.startDate} onChange={e => setNewEmpForm(f => ({ ...f, startDate: e.target.value }))} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={() => setShowAddModal(false)} className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all">Cancel</button>
                <button onClick={handleAddEmployee} className="flex-1 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all">Add Employee</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Employee Modal */}
      <AnimatePresence>
        {editingEmployee && editForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div className="absolute inset-0 bg-black/50" onClick={() => { setEditingEmployee(null); setEditForm(null); }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.div className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md z-10" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Employee</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-1 block">Full Name *</label>
                  <input type="text" value={editForm.name} onChange={e => setEditForm(f => f ? { ...f, name: e.target.value } : f)} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-1 block">Monthly Salary</label>
                  <input type="number" min="0" value={editForm.salary} onChange={e => setEditForm(f => f ? { ...f, salary: e.target.value } : f)} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-1 block">Start Date</label>
                  <input type="date" value={editForm.startDate} onChange={e => setEditForm(f => f ? { ...f, startDate: e.target.value } : f)} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={() => { setEditingEmployee(null); setEditForm(null); }} className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all">Cancel</button>
                <button onClick={handleUpdateEmployee} className="flex-1 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all">Save Changes</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Payment Modal */}
      <AnimatePresence>
        {paymentEmployeeId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div className="absolute inset-0 bg-black/50" onClick={() => setPaymentEmployeeId(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.div className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md z-10" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Add Payment</h2>
              <p className="text-sm text-gray-500 mb-6">
                Only the 3 most recent payments are kept per employee.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-1 block">Amount *</label>
                  <input type="number" min="0" value={paymentForm.amount} onChange={e => setPaymentForm(f => ({ ...f, amount: e.target.value }))} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="0" />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-1 block">Status</label>
                  <select value={paymentForm.status} onChange={e => setPaymentForm(f => ({ ...f, status: e.target.value as 'confirmed' | 'pending' }))} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-blue-500 outline-none text-sm">
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-1 block">Payment Date</label>
                  <input type="date" value={paymentForm.date} onChange={e => setPaymentForm(f => ({ ...f, date: e.target.value }))} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={() => setPaymentEmployeeId(null)} className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all">Cancel</button>
                <button onClick={handleAddPayment} className="flex-1 px-6 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition-all">Add Payment</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {confirmDeleteId && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
            <motion.div className="absolute inset-0 bg-black/50" onClick={() => setConfirmDeleteId(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.div className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm z-10 text-center" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Employee?</h3>
              <p className="text-sm text-gray-500 mb-8">
                {employees.find(e => e.id === confirmDeleteId)?.name} and all their payment history will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDeleteId(null)} className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all">Cancel</button>
                <button onClick={handleDelete} className="flex-1 px-6 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-all">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
