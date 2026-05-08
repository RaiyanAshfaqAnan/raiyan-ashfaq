import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, Box, Shirt, Bot, LogOut, X, 
  Trash2, Copy, CheckCircle2, Truck, Clock, AlertCircle,
  TriangleAlert, Camera, Image as ImageIcon
} from 'lucide-react';
import { useStore } from '../StoreContext';
import { ADMIN_CREDENTIALS, PRODUCTS } from '../constants';
import { Order, Product, OrderStatus, PaymentStatus } from '../types';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const { 
    orders, products, adminLoggedIn, loginAdmin, logoutAdmin, deleteOrder, updateOrder, setProducts,
    geminiKey, setGeminiKey 
  } = useStore();
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'shirts' | 'ai'>('dashboard');
  const [loginForm, setLoginForm] = useState({ user: '', pass: '' });
  const [loginError, setLoginError] = useState(false);
  const [orderFilter, setOrderFilter] = useState<OrderStatus | 'all'>('all');
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  const [deletingShirtId, setDeletingShirtId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' });

  const triggerToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 2000);
  };

  const handlePermanentDelete = () => {
    if (deletingOrderId) {
      deleteOrder(deletingOrderId);
      triggerToast("Order deleted successfully");
      setDeletingOrderId(null);
    }
  };

  const handlePermanentDeleteShirt = () => {
    if (deletingShirtId !== null) {
      setProducts(prev => prev.filter(p => p.id !== deletingShirtId));
      triggerToast("Shirt deleted successfully");
      setDeletingShirtId(null);
    }
  };
   
  // Shirt Management State
  const [editingShirt, setEditingShirt] = useState<Product | null>(null);
  const [shirtForm, setShirtForm] = useState<Partial<Product>>({
    name: '', price: 0, category: 'Heritage', label: '', image: null, stock: 0
  });
  const [imgError, setImgError] = useState<string | null>(null);

  const handleEditShirt = (p: Product) => {
    setEditingShirt(p);
    setShirtForm(p);
    document.getElementById('product-form-top')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setImgError("Image too large. Please upload under 2MB.");
      return;
    }

    setImgError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setShirtForm(prev => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  // AI Chat State
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: "👋 আস্সালামুয়ালাইকুম! I'm your kite — ঘুড়ি AI Business Assistant powered by Gemini. How can I help you today?" }
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.user === ADMIN_CREDENTIALS.username && loginForm.pass === ADMIN_CREDENTIALS.password) {
      loginAdmin();
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const syncProducts = () => {
    // Validation
    if (!shirtForm.name || shirtForm.name.trim() === '') {
      triggerToast("Product Name is required");
      return;
    }
    if (!shirtForm.price || shirtForm.price <= 0) {
      triggerToast("Price must be a positive number");
      return;
    }
    if (shirtForm.stock === undefined || shirtForm.stock < 0) {
      triggerToast("Stock must be 0 or more");
      return;
    }

    if (editingShirt) {
      setProducts(prev => prev.map(p => p.id === editingShirt.id ? { ...p, ...shirtForm } as Product : p));
      triggerToast("Shirt updated successfully");
      setEditingShirt(null);
    } else {
      const newId = Math.max(...products.map(p => p.id), 0) + 1;
      setProducts(prev => [...prev, { ...shirtForm, id: newId, color: '#F0F2F5' } as Product]);
      triggerToast("Shirt added successfully");
    }
    setShirtForm({ name: '', price: 0, category: 'Heritage', label: '', image: null, stock: 0 });
    setImgError(null);
  };

  const sendAiMessage = async () => {
    if (!aiInput.trim() || !geminiKey) return;
    const userMsg = aiInput.trim();
    setAiInput('');
    setAiMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setAiLoading(true);

    const storeContext = `You are a helpful business assistant for "kite — ঘুড়ি", a premium Bangladeshi shirt brand. 
    Store details:
    - Products: ${products.length}
    - Total orders: ${orders.length}
    - Revenue: ৳${orders.reduce((s,o)=>s+o.totalPrice,0).toLocaleString()}
    - Pending: ${orders.filter(o=>o.status==='pending').length}
    The store sells premium shirts with bKash, Nagad, COD options. Respond concisely.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${storeContext}\n\nUser: ${userMsg}` }] }]
        })
      });
      const data = await response.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response.";
      setAiMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setAiMessages(prev => [...prev, { role: 'assistant', content: "Error connecting to Gemini. Please check your API key." }]);
    } finally {
      setAiLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-charcoal text-white z-[9999] overflow-hidden flex"
    >
      <AnimatePresence>
        {!adminLoggedIn ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="m-auto w-full max-w-[400px] bg-white border border-gray-medium p-10 rounded-2xl shadow-xl text-center text-charcoal"
          >
            <div className="font-serif text-3xl mb-2">kite — ঘুড়ি</div>
            <p className="opacity-60 mb-8 font-bold uppercase tracking-widest text-xs">Admin Access</p>
            
            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-widest opacity-40 ml-1">Username</label>
                <input 
                  type="text" 
                  autoComplete="username"
                  className="w-full p-4 bg-gray-light border border-gray-medium/50 rounded-lg outline-none focus:border-violet transition-colors"
                  value={loginForm.user}
                  onChange={e => setLoginForm(prev => ({ ...prev, user: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-widest opacity-40 ml-1">Password</label>
                <input 
                  type="password" 
                  autoComplete="current-password"
                  className="w-full p-4 bg-gray-light border border-gray-medium/50 rounded-lg outline-none focus:border-violet transition-colors"
                  value={loginForm.pass}
                  onChange={e => setLoginForm(prev => ({ ...prev, pass: e.target.value }))}
                />
              </div>
              
              {loginError && (
                <div className="flex items-center gap-2 p-3 bg-danger/10 text-danger text-xs font-bold rounded-lg uppercase tracking-wider">
                  <AlertCircle className="w-4 h-4" />
                  Invalid credentials
                </div>
              )}
              
              <button className="w-full bg-charcoal text-white py-4 rounded-lg font-bold uppercase tracking-widest hover:bg-violet transition-colors">
                Login
              </button>
            </form>
            
            <button 
              onClick={onClose} 
              className="mt-6 text-xs font-bold uppercase opacity-40 hover:opacity-100 transition-opacity"
            >
              ← Back to Store
            </button>
          </motion.div>
        ) : (
          <div className="flex w-full h-full">
            {/* Sidebar */}
            <div className="w-64 bg-charcoal text-white flex flex-col h-full shrink-0">
              <div className="p-8 border-b border-white/10 mb-6">
                <div className="font-serif text-2xl">kite — ঘুড়ি</div>
                <p className="text-[10px] uppercase tracking-widest opacity-50 mt-1 font-bold">Admin Dashboard</p>
              </div>
              
              <nav className="flex-1">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                  { id: 'orders', label: 'Orders', icon: Box },
                  { id: 'shirts', label: 'Manage Shirts', icon: Shirt },
                  { id: 'ai', label: 'AI Assistant', icon: Bot },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={cn(
                      "w-full flex items-center gap-4 px-8 py-4 transition-colors",
                      activeTab === item.id ? "bg-violet text-white" : "opacity-60 hover:opacity-100 hover:bg-white/5"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="font-bold text-xs uppercase tracking-widest">{item.label}</span>
                  </button>
                ))}
              </nav>

              <div className="p-6">
                <button 
                  onClick={logoutAdmin}
                  className="w-full bg-white/10 hover:bg-danger text-white py-3 rounded flex items-center justify-center gap-2 transition-colors uppercase font-bold text-xs tracking-widest"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden bg-[#F0F2F5]">
              <header className="h-20 border-b border-gray-medium bg-white flex items-center justify-between px-10 shrink-0 text-charcoal shadow-sm">
                <h2 className="text-3xl font-serif">{activeTab === 'orders' ? 'Orders' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
                <div className="flex items-center gap-4">
                  <span className="text-sm opacity-50">kite Admin v1.0 | Welcome, Admin!</span>
                  <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors opacity-50">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto p-10 custom-scrollbar text-charcoal">
                
                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && (
                  <div className="space-y-10">
                    <h3 className="text-xl font-serif mb-6">All Orders</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                        { label: 'Total Orders', value: orders.length },
                        { label: 'Total Revenue', value: `৳${orders.reduce((s,o)=>s+o.totalPrice,0).toLocaleString()}` },
                        { label: 'Pending Orders', value: orders.filter(o=>o.status==='pending').length },
                        { label: 'Delivered', value: orders.filter(o=>o.status==='delivered').length },
                      ].map((stat, i) => (
                        <div key={i} className="bg-white border border-gray-medium p-8 rounded-xl shadow-sm flex flex-col items-center text-center">
                          <span className="text-[10px] uppercase tracking-widest opacity-40 mb-2 font-bold">{stat.label}</span>
                          <span className="text-3xl font-serif">{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                  <div className="space-y-8">
                    <div className="flex justify-between items-center mb-8">
                      <h3 className="text-xl font-serif">All Orders</h3>
                      <select 
                        className="p-2 bg-white border border-gray-medium rounded-lg outline-none text-sm focus:border-violet"
                        value={orderFilter}
                        onChange={e => setOrderFilter(e.target.value as any)}
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="onway">On the Way</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-medium overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-gray-medium text-[10px] font-bold uppercase tracking-wider opacity-60">
                            <th className="px-6 py-4">Order ID</th>
                            <th className="px-4 py-4">Customer</th>
                            <th className="px-4 py-4">Phone</th>
                            <th className="px-4 py-4">Location</th>
                            <th className="px-4 py-4">Product</th>
                            <th className="px-4 py-4">Price</th>
                            <th className="px-4 py-4">Payment</th>
                            <th className="px-4 py-4">Paid</th>
                            <th className="px-4 py-4">Status</th>
                            <th className="px-4 py-4">Tracking</th>
                            <th className="px-6 py-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-light">
                          {orders.filter(o => orderFilter === 'all' || o.status === orderFilter).reverse().map((order) => {
                            const isTerminal = order.status === 'delivered' || order.status === 'cancelled';
                            return (
                              <tr key={order.id} className="text-xs hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-6">
                                  <div className="font-bold">{order.id}</div>
                                  <div className="text-[10px] opacity-40 mt-1">{order.createdAt}</div>
                                </td>
                                <td className="px-4 py-6">{order.customerName}</td>
                                <td className="px-4 py-6">{order.phone}</td>
                                <td className="px-4 py-6 truncate max-w-[100px]">{order.location}</td>
                                <td className="px-4 py-6">
                                  {order.items.map(item => `${item.name}(${item.qty})`).join(', ')}
                                </td>
                                <td className="px-4 py-6 font-bold text-violet">৳{order.totalPrice.toLocaleString()}</td>
                                <td className="px-4 py-6">COD</td>
                                <td className="px-4 py-6">
                                  <select 
                                    className="bg-transparent border border-gray-medium rounded p-1 outline-none"
                                    value={order.paid}
                                    onChange={(e) => updateOrder(order.id, { paid: e.target.value as PaymentStatus })}
                                  >
                                    <option value="Unpaid">Unpaid</option>
                                    <option value="Paid">Paid</option>
                                  </select>
                                </td>
                                <td className="px-4 py-6">
                                  <select 
                                    className={cn(
                                      "p-2 rounded border border-gray-medium outline-none",
                                      order.status === 'pending' ? 'text-amber-600' :
                                      order.status === 'onway' ? 'text-violet' :
                                      order.status === 'delivered' ? 'text-success' : 'text-danger'
                                    )}
                                    value={order.status}
                                    onChange={(e) => {
                                      const newStatus = e.target.value as OrderStatus;
                                      updateOrder(order.id, { status: newStatus });
                                    }}
                                  >
                                    <option value="pending">⏳ Pending</option>
                                    <option value="onway">🚚 On the Way</option>
                                    <option value="delivered">✅ Delivered</option>
                                    <option value="cancelled">❌ Cancelled</option>
                                  </select>
                                </td>
                                <td className="px-4 py-6">
                                  <div className="flex gap-2 min-w-[200px]">
                                    <input 
                                      type="url"
                                      placeholder="Paste tracking URL..."
                                      className="flex-1 px-3 py-2 bg-gray-light border border-gray-medium rounded text-[10px] outline-none focus:border-violet transition-colors"
                                      defaultValue={order.trackingLink || ''}
                                      id={`tracking-${order.id}`}
                                    />
                                    <button 
                                      onClick={() => {
                                        const input = document.getElementById(`tracking-${order.id}`) as HTMLInputElement;
                                        const val = input.value;
                                        updateOrder(order.id, { trackingLink: val, trackingEnabled: !!val });
                                      }}
                                      className="bg-charcoal text-white px-3 py-2 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-violet transition-colors whitespace-nowrap"
                                    >
                                      Update
                                    </button>
                                  </div>
                                  {order.trackingLink && (
                                    <div className="mt-1 px-1">
                                      <a href={order.trackingLink} target="_blank" rel="noopener noreferrer" className="text-[9px] text-violet font-bold hover:underline">
                                        View Active Link →
                                      </a>
                                    </div>
                                  )}
                                </td>
                                <td className="px-6 py-6 flex flex-col gap-2">
                                  {!isTerminal && (
                                    <button 
                                      onClick={() => {
                                        if (window.confirm("Are you sure you want to cancel this order?")) {
                                          updateOrder(order.id, { status: 'cancelled' });
                                        }
                                      }}
                                      className="bg-[#FF9800] text-white px-3 py-2 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-charcoal transition-colors border-none shadow-sm"
                                    >
                                      Cancel
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => setDeletingOrderId(order.id)}
                                    className="bg-[#E53935] text-white px-3 py-2 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-charcoal transition-colors border-none shadow-sm"
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Products Management */}
                {activeTab === 'shirts' && (
                  <div className="space-y-10">
                    <div id="product-form-top" className="bg-white border border-gray-medium p-10 rounded-xl shadow-sm">
                      {editingShirt ? (
                        <div className="flex items-center gap-3 mb-8">
                          <h3 className="text-2xl font-serif text-violet">Editing: {editingShirt.name}</h3>
                          <button 
                            onClick={() => {
                              setEditingShirt(null);
                              setShirtForm({ name: '', price: 0, category: 'Heritage', label: '', image: null, stock: 0 });
                              setImgError(null);
                            }}
                            className="text-xs font-bold uppercase tracking-widest opacity-40 hover:opacity-100 hover:text-danger underline transition-all"
                          >
                            Cancel Edit
                          </button>
                        </div>
                      ) : (
                        <h3 className="text-2xl font-serif mb-8">Add New Product</h3>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <label className="text-xs font-bold uppercase tracking-widest opacity-40">Product Name</label>
                          <input 
                            className="w-full p-4 bg-gray-light border border-gray-medium/50 rounded-lg outline-none focus:border-violet"
                            value={shirtForm.name}
                            onChange={e => setShirtForm(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <label className="text-xs font-bold uppercase tracking-widest opacity-40">Price (৳)</label>
                            <input 
                              type="number"
                              className="w-full p-4 bg-gray-light border border-gray-medium/50 rounded-lg outline-none focus:border-violet"
                              value={shirtForm.price}
                              onChange={e => setShirtForm(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                            />
                          </div>
                          <div className="space-y-4">
                            <label className="text-xs font-bold uppercase tracking-widest opacity-40">Stock Quantity</label>
                            <input 
                              type="number"
                              min="0"
                              className="w-full p-4 bg-gray-light border border-gray-medium/50 rounded-lg outline-none focus:border-violet"
                              value={shirtForm.stock}
                              onChange={e => setShirtForm(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                            />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <label className="text-xs font-bold uppercase tracking-widest opacity-40">Category</label>
                          <select 
                            className="w-full p-4 bg-gray-light border border-gray-medium/50 rounded-lg outline-none focus:border-violet"
                            value={shirtForm.category}
                            onChange={e => setShirtForm(prev => ({ ...prev, category: e.target.value as any }))}
                          >
                            <option value="Heritage">Heritage</option>
                            <option value="Summer">Summer</option>
                            <option value="Urban">Urban</option>
                          </select>
                        </div>
                        <div className="space-y-4">
                          <label className="text-xs font-bold uppercase tracking-widest opacity-40">Label (Short)</label>
                          <input 
                            className="w-full p-4 bg-gray-light border border-gray-medium/50 rounded-lg outline-none focus:border-violet"
                            value={shirtForm.label}
                            onChange={e => setShirtForm(prev => ({ ...prev, label: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-4 md:col-span-2">
                          <label className="text-xs font-bold uppercase tracking-widest opacity-40">Shirt Image</label>
                          <div 
                            onClick={() => document.getElementById('shirt-image-input')?.click()}
                            className={cn(
                              "relative w-full aspect-video md:aspect-[21/9] border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden",
                              shirtForm.image ? "border-violet" : "border-gray-medium hover:border-violet bg-gray-light"
                            )}
                          >
                            {shirtForm.image ? (
                              <>
                                <img src={shirtForm.image} alt="Preview" className="w-full h-full object-contain" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <p className="text-white text-[10px] font-bold uppercase tracking-widest">Click to Change</p>
                                </div>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShirtForm(prev => ({ ...prev, image: null }));
                                  }}
                                  className="absolute top-4 right-4 bg-white/20 backdrop-blur-md hover:bg-danger text-white p-2 rounded-full transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <div className="text-center p-8">
                                <Camera className="w-8 h-8 mx-auto mb-3 opacity-20" />
                                <p className="text-xs font-bold uppercase tracking-widest opacity-40">Click to upload shirt image</p>
                                <p className="text-[10px] opacity-30 mt-1">JPG, PNG, WEBP — max 2MB</p>
                              </div>
                            )}
                            <input 
                              id="shirt-image-input"
                              type="file" 
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageUpload}
                            />
                          </div>
                          {imgError && <p className="text-[10px] text-danger font-bold uppercase tracking-wider">{imgError}</p>}
                        </div>
                      </div>
                      <div className="mt-10 flex gap-4">
                        <button 
                          onClick={syncProducts} 
                          className="bg-violet text-white px-10 py-4 rounded font-bold uppercase tracking-widest text-xs hover:bg-charcoal transition-colors shadow-lg"
                        >
                          {editingShirt ? 'Update Shirt' : 'Save Product'}
                        </button>
                        {editingShirt && (
                          <button 
                            onClick={() => { setEditingShirt(null); setShirtForm({ name: '', price: 0, category: 'Heritage', label: '', image: null, stock: 0 }); setImgError(null); }} 
                            className="text-charcoal px-8 py-4 rounded font-bold border border-gray-medium uppercase tracking-widest text-xs hover:bg-gray-100 transition-colors"
                          >
                            Cancel Edit
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="bg-white border border-gray-medium rounded-xl overflow-hidden shadow-sm">
                       <table className="w-full text-left">
                        <thead>
                          <tr className="bg-gray-light text-xs uppercase tracking-widest font-bold opacity-40 border-b border-gray-medium">
                            <th className="px-8 py-5">Visual</th>
                            <th className="px-8 py-5">Name</th>
                            <th className="px-8 py-5">Category</th>
                            <th className="px-8 py-5">Price</th>
                            <th className="px-8 py-5">Stock</th>
                            <th className="px-8 py-5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-light text-sm">
                          {products.map(p => (
                            <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-8 py-6">
                                <div className="w-12 h-12 rounded bg-gray-light border border-black/10 overflow-hidden flex items-center justify-center">
                                  {p.image ? (
                                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <ImageIcon className="w-4 h-4 opacity-20" />
                                  )}
                                </div>
                              </td>
                              <td className="px-8 py-6 font-bold">{p.name}</td>
                              <td className="px-8 py-6 opacity-60">{p.category}</td>
                              <td className="px-8 py-6 font-bold">৳{p.price.toLocaleString()}</td>
                              <td className="px-8 py-6">
                                <div className={cn(
                                  "inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest border",
                                  p.stock > 10 ? "text-success border-success/20 bg-success/5" :
                                  p.stock > 0 ? "text-amber-600 border-amber-600/20 bg-amber-600/5" :
                                  "text-danger border-danger/20 bg-danger/5"
                                )}>
                                  {p.stock > 0 ? p.stock : 'OUT'}
                                </div>
                              </td>
                              <td className="px-8 py-6 text-right space-x-4">
                                <button onClick={() => handleEditShirt(p)} className="text-violet font-bold uppercase text-[10px] tracking-widest hover:underline px-2 py-1">Edit</button>
                                <button onClick={() => setDeletingShirtId(p.id)} className="text-danger font-bold uppercase text-[10px] tracking-widest hover:underline px-2 py-1">Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* AI Assistant */}
                {activeTab === 'ai' && (
                  <div className="space-y-6 flex flex-col h-full">
                    {!geminiKey ? (
                      <div className="bg-white border border-gray-medium p-16 rounded-xl shadow-sm text-center space-y-8 m-auto max-w-2xl">
                        <div className="w-20 h-20 mx-auto bg-violet/10 rounded-full flex items-center justify-center">
                          <Bot className="w-10 h-10 text-violet" />
                        </div>
                        <div>
                          <h3 className="text-3xl font-serif">Setup AI Assistant</h3>
                          <p className="opacity-50 max-w-sm mx-auto">Enter your Gemini API key to enable AI-powered business insights.</p>
                        </div>
                        <div className="space-y-4">
                          <input 
                            type="password"
                            placeholder="Gemini API Key"
                            className="w-full p-4 bg-gray-light border border-gray-medium rounded-lg outline-none focus:border-violet"
                            id="gemini-key-input"
                          />
                          <button 
                            onClick={() => setGeminiKey((document.getElementById('gemini-key-input') as HTMLInputElement).value)}
                            className="w-full bg-violet text-white py-4 rounded font-bold uppercase tracking-widest text-xs"
                          >
                            Connect
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col min-h-0 bg-white border border-gray-medium rounded-xl shadow-sm overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
                          {aiMessages.map((msg, i) => (
                            <div key={i} className={cn("flex", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                              <div className={cn(
                                "max-w-[80%] p-5 rounded-2xl text-sm leading-relaxed",
                                msg.role === 'user' 
                                  ? 'bg-violet text-white rounded-tr-none' 
                                  : 'bg-gray-light border border-gray-medium/50 rounded-tl-none'
                              )}>
                                <div className="prose prose-sm max-w-none">
                                  <ReactMarkdown>
                                    {msg.content}
                                  </ReactMarkdown>
                                </div>
                              </div>
                            </div>
                          ))}
                          {aiLoading && (
                            <div className="flex justify-start">
                              <div className="text-xs font-bold uppercase tracking-widest animate-pulse opacity-40">AI is thinking...</div>
                            </div>
                          )}
                        </div>
                        <div className="p-6 border-t border-gray-medium bg-gray-50 flex gap-4">
                          <input 
                            placeholder="Ask a question about your business..."
                            className="flex-1 p-4 bg-white border border-gray-medium rounded-lg outline-none focus:border-violet"
                            value={aiInput}
                            onChange={e => setAiInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && sendAiMessage()}
                          />
                          <button 
                            disabled={aiLoading}
                            onClick={sendAiMessage}
                            className="bg-charcoal text-white px-8 rounded font-bold uppercase tracking-widest text-xs disabled:opacity-30"
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Order Confirmation Modal */}
      <AnimatePresence>
        {deletingOrderId && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingOrderId(null)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white text-charcoal w-full max-w-md p-8 rounded-2xl shadow-2xl border border-gray-medium text-center"
            >
              <div className="w-16 h-16 bg-danger/10 text-danger rounded-full flex items-center justify-center mx-auto mb-6">
                <TriangleAlert className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-serif mb-2">Delete Order?</h4>
              <p className="opacity-60 text-sm leading-relaxed mb-8">
                Are you sure you want to permanently delete Order <span className="font-bold">#{deletingOrderId}</span>? This action cannot be undone.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setDeletingOrderId(null)}
                  className="bg-[#9E9E9E] text-white py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:opacity-90 transition-opacity"
                >
                  Cancel
                </button>
                <button 
                  onClick={handlePermanentDelete}
                  className="bg-[#E53935] text-white py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:opacity-90 transition-opacity"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Shirt Confirmation Modal */}
      <AnimatePresence>
        {deletingShirtId !== null && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingShirtId(null)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white text-charcoal w-full max-w-md p-8 rounded-2xl shadow-2xl border border-gray-medium text-center"
            >
              <div className="w-16 h-16 bg-danger/10 text-danger rounded-full flex items-center justify-center mx-auto mb-6">
                <TriangleAlert className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-serif mb-2">Delete Shirt?</h4>
              <p className="opacity-60 text-sm leading-relaxed mb-8">
                Are you sure you want to delete <span className="font-bold">'{products.find(p => p.id === deletingShirtId)?.name}'</span>? This will remove it from the store permanently.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setDeletingShirtId(null)}
                  className="bg-[#9E9E9E] text-white py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:opacity-90 transition-opacity"
                >
                  Cancel
                </button>
                <button 
                  onClick={handlePermanentDeleteShirt}
                  className="bg-[#E53935] text-white py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:opacity-90 transition-opacity"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {toast.show && (
          <motion.div 
            initial={{ opacity: 0, y: -50, x: 50 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -50, x: 50 }}
            className="fixed top-8 right-8 z-[10001] bg-[#4CAF50] text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 border border-white/10"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-bold text-xs uppercase tracking-widest">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
