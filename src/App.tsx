import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { CartDrawer } from './components/CartDrawer';
import { OrderModal } from './components/OrderModal';
import { AdminPanel } from './components/AdminPanel';
import { ProductCard } from './components/ProductCard';
import { useStore, StoreProvider } from './StoreContext';
import { Product, Order, OrderStatus } from './types';
import { PRODUCTS } from './constants';
import { cn } from './lib/utils';
import { Search, Heart, ShoppingBag, MapPin, ArrowRight, Instagram, Facebook, Twitter, Clock, Truck, CheckCircle2, AlertCircle, Mail, Phone, Plus, Minus } from 'lucide-react';

const Footer = ({ onShowPage }: { onShowPage: (page: string) => void }) => (
  <footer className="bg-charcoal text-cream pt-20 pb-10 mt-20">
    <div className="container mx-auto px-6 lg:px-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div>
          <div className="font-serif text-3xl mb-6">kite — ঘুড়ি</div>
          <p className="opacity-60 max-w-xs text-sm leading-relaxed">
            Wear the sky. আকাশ পরো।<br />
            Modern editorial shirts, crafted with pride in Dhaka, Bangladesh.
          </p>
        </div>
        <div>
          <h4 className="font-bold uppercase tracking-widest text-xs mb-6 opacity-40">Shop</h4>
          <ul className="space-y-4 text-sm">
            <li><button onClick={() => onShowPage('shop')} className="opacity-70 hover:opacity-100 transition-opacity">All Shirts</button></li>
            <li><button className="opacity-70 hover:opacity-100 transition-opacity">Summer Drift</button></li>
            <li><button className="opacity-70 hover:opacity-100 transition-opacity">Urban Root</button></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold uppercase tracking-widest text-xs mb-6 opacity-40">Company</h4>
          <ul className="space-y-4 text-sm">
            <li><button onClick={() => onShowPage('about')} className="opacity-70 hover:opacity-100 transition-opacity">Our Story</button></li>
            <li><button className="opacity-70 hover:opacity-100 transition-opacity">Sustainability</button></li>
            <li><button className="opacity-70 hover:opacity-100 transition-opacity">Careers</button></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold uppercase tracking-widest text-xs mb-6 opacity-40">Support</h4>
          <ul className="space-y-4 text-sm">
            <li><button onClick={() => onShowPage('track')} className="opacity-70 hover:opacity-100 transition-opacity">Track Order</button></li>
            <li><button onClick={() => onShowPage('contact')} className="opacity-70 hover:opacity-100 transition-opacity">Contact Us</button></li>
            <li><button className="opacity-70 hover:opacity-100 transition-opacity">Size Guide</button></li>
            <li><button className="opacity-70 hover:opacity-100 transition-opacity">Returns</button></li>
          </ul>
        </div>
      </div>
      <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-widest opacity-40">
        <p>© 2025 kite — ঘুড়ি. Made in Dhaka 🇧🇩</p>
        <div className="flex gap-6 uppercase">
          <span>bkash</span> <span>nagad</span> <span>visa</span> <span>mastercard</span>
        </div>
      </div>
    </div>
  </footer>
);

const ContactForm = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'This field is required.';
    if (!form.email.trim()) newErrors.email = 'This field is required.';
    if (!form.message.trim()) newErrors.message = 'This field is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSuccess(false);
      return;
    }

    setErrors({});
    setSuccess(true);
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    
    // Auto-hide success message
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-cream/30 p-8 lg:p-12 border border-gray-medium/20 shadow-xl">
      {success && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-success text-white p-4 rounded-lg mb-6 flex items-center gap-3 shadow-lg"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-bold text-[10px] uppercase tracking-widest">✓ Message sent! We'll get back to you soon.</span>
        </motion.div>
      )}
      
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Full Name *</label>
        <input 
          type="text" 
          className={cn(
            "w-full p-4 bg-white border outline-none transition-all", 
            errors.name ? "border-danger ring-1 ring-danger/20" : "border-gray-medium/50 focus:border-violet focus:ring-1 focus:ring-violet/20"
          )}
          value={form.name}
          onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
        />
        {errors.name && <p className="text-danger text-[10px] font-bold uppercase tracking-widest mt-1">{errors.name}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Email Address *</label>
          <input 
            type="email" 
            className={cn(
              "w-full p-4 bg-white border outline-none transition-all", 
              errors.email ? "border-danger ring-1 ring-danger/20" : "border-gray-medium/50 focus:border-violet focus:ring-1 focus:ring-violet/20"
            )}
            value={form.email}
            onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
          />
          {errors.email && <p className="text-danger text-[10px] font-bold uppercase tracking-widest mt-1">{errors.email}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Phone Number</label>
          <input 
            type="text" 
            placeholder="+880 1XXXXXXXXX"
            className="w-full p-4 bg-white border border-gray-medium/50 focus:border-violet outline-none transition-all focus:ring-1 focus:ring-violet/20"
            value={form.phone}
            onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Subject</label>
        <input 
          type="text" 
          className="w-full p-4 bg-white border border-gray-medium/50 focus:border-violet outline-none transition-all focus:ring-1 focus:ring-violet/20"
          value={form.subject}
          onChange={e => setForm(prev => ({ ...prev, subject: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Message *</label>
        <textarea 
          rows={5}
          className={cn(
            "w-full p-4 bg-white border outline-none transition-all resize-none", 
            errors.message ? "border-danger ring-1 ring-danger/20" : "border-gray-medium/50 focus:border-violet focus:ring-1 focus:ring-violet/20"
          )}
          value={form.message}
          onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
        />
        {errors.message && <p className="text-danger text-[10px] font-bold uppercase tracking-widest mt-1">{errors.message}</p>}
      </div>

      <button type="submit" className="w-full bg-violet text-white py-5 font-bold uppercase tracking-widest hover:bg-charcoal transition-all shadow-lg active:scale-95 text-xs">
        Send Message
      </button>
    </form>
  );
};

const FaqAccordion = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { q: "What is your delivery time?", a: "For Dhaka city, we deliver within 24–48 hours. Outside Dhaka takes 3–5 working days via courier." },
    { q: "Do you offer Cash on Delivery?", a: "Yes, COD is available nationwide. You can also pay via bKash, Nagad, or card." },
    { q: "What is your return policy?", a: "We offer a 7-day hassle-free return for manufacturing defects or sizing issues. Contact us on WhatsApp to initiate." },
    { q: "How do I track my order?", a: "Once your order is dispatched, the admin will send you a tracking link via your order ID. Use the Track Order option in the navigation." }
  ];

  return (
    <div className="space-y-2">
      {faqs.map((faq, i) => (
        <div key={i} className="border-b border-gray-medium/20">
          <button 
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full py-6 flex justify-between items-center text-left hover:text-violet transition-colors group"
          >
            <span className="font-bold uppercase tracking-widest text-xs md:text-sm">{faq.q}</span>
            <div className={cn(
              "w-8 h-8 rounded-full border flex items-center justify-center transition-all",
              openIndex === i ? "bg-violet text-white border-violet" : "border-gray-medium group-hover:border-violet text-gray-medium group-hover:text-violet"
            )}>
              {openIndex === i ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
          </button>
          <AnimatePresence initial={false}>
            {openIndex === i && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <p className="pb-8 opacity-60 text-sm leading-relaxed max-w-2xl">
                  {faq.a}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

const AppContent: React.FC = () => {
  const { products, cart, wishlist, orders, addToCart } = useStore();
  const [currentPage, setCurrentPage] = useState('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [trackId, setTrackId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [collectionFilter, setCollectionFilter] = useState<'all' | 'Heritage' | 'Summer' | 'Urban'>('all');

  // Filtering products for Collections page
  const filteredCollections = products.filter(p => 
    collectionFilter === 'all' ? true : p.category === collectionFilter
  );

  // Routing synchronization for URL tracking
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const track = params.get('track');
    if (track) {
      setCurrentPage('track');
      setTrackId(track);
      const found = orders.find(o => o.id === track);
      if (found) setTrackedOrder(found);
    }
  }, [orders]);

  const navigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (page !== 'track') {
      window.history.replaceState({}, '', '/');
    }
  };

  const handleTrack = (e?: React.FormEvent) => {
    e?.preventDefault();
    const found = orders.find(o => o.id.toUpperCase() === trackId.toUpperCase());
    setTrackedOrder(found || null);
  };

  return (
    <div className="min-h-screen">
      <Navbar 
        onOpenAdmin={() => setIsAdminOpen(true)} 
        onOpenTracking={() => navigate('track')} 
        onOpenWishlist={() => navigate('wishlist')} 
        onToggleCart={() => setIsCartOpen(true)} 
        onShowPage={navigate}
      />

      <AnimatePresence mode="wait">
        <motion.main
          key={currentPage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="pt-20"
        >
          {currentPage === 'home' && (
            <>
              <section className="relative h-[calc(100vh-80px)] min-h-[600px] flex items-center justify-center overflow-hidden">
                <div className="kite-shape top-[20%] left-[10%]" />
                <div className="kite-shape top-[60%] right-[15%] bg-teal/15 animate-delay-2000" />
                <div className="container mx-auto px-6 text-center z-10">
                  <motion.h1 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-[clamp(3rem,10vw,6.5rem)] leading-none mb-6"
                  >
                    Shirts that fly.<br />
                    <span className="text-violet italic">শার্ট যে উড়ে।</span>
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl lg:text-2xl opacity-70 mb-12"
                  >
                    Crafted in Dhaka. Worn everywhere.
                  </motion.p>
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap justify-center gap-6"
                  >
                    <button onClick={() => navigate('shop')} className="bg-violet text-white px-10 py-5 font-bold uppercase tracking-widest hover:bg-charcoal transition-colors">Shop Now</button>
                    <button onClick={() => navigate('lookbook')} className="border border-charcoal px-10 py-5 font-bold uppercase tracking-widest hover:bg-charcoal hover:text-white transition-all">See Lookbook</button>
                  </motion.div>
                </div>
              </section>

              <section className="py-32 container mx-auto px-6 lg:px-10">
                <div className="flex justify-between items-end mb-16">
                  <h2 className="text-4xl lg:text-5xl">New Arrivals / <span className="text-2xl opacity-40 ml-2">নতুন কালেকশন</span></h2>
                  <button onClick={() => navigate('shop')} className="text-violet font-bold flex items-center gap-2 group">View All <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                  {products.slice(0, 6).map(p => (
                    <ProductCard key={p.id} product={p} onOpen={(p) => { setSelectedProduct(p); navigate('product'); }} />
                  ))}
                </div>
              </section>

              <section className="bg-white py-32">
                <div className="container mx-auto px-6 lg:px-10 flex flex-col lg:flex-row items-center gap-20">
                  <div className="w-full lg:w-1/2 aspect-video lg:aspect-square bg-gray-light flex items-center justify-center font-serif text-3xl opacity-20 border-[20px] border-cream shadow-inner">
                    Dhaka Studio
                  </div>
                  <div className="w-full lg:w-1/2 space-y-8">
                    <h2 className="text-5xl lg:text-6xl">Born in Dhaka.</h2>
                    <p className="text-xl opacity-70 leading-relaxed">
                      Kite (ঘুড়ি) isn't just a label; it's a movement inspired by the rooftops of Old Dhaka. Our shirts are designed for the dreamers who want to wear the freedom of the open sky.
                    </p>
                    <button onClick={() => navigate('about')} className="border-b-2 border-charcoal pb-2 font-bold uppercase tracking-widest hover:text-violet hover:border-violet transition-all">Our Story</button>
                  </div>
                </div>
              </section>
            </>
          )}

          {currentPage === 'shop' && (
            <div className="container mx-auto px-6 lg:px-10 py-20">
              <h1 className="text-6xl mb-16">Shop All</h1>
              <div className="flex flex-col lg:flex-row gap-16">
                <aside className="w-full lg:w-64 space-y-12 shrink-0">
                  <div className="space-y-6">
                    <h4 className="text-[10px] uppercase font-bold tracking-[2px] opacity-40">Category</h4>
                    <div className="flex flex-col gap-4 text-sm font-medium">
                      {['Heritage', 'Summer', 'Urban'].map(cat => (
                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                          <input type="checkbox" className="w-4 h-4 border-gray-medium text-violet focus:ring-violet" />
                          <span className="opacity-70 group-hover:opacity-100">{cat}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h4 className="text-[10px] uppercase font-bold tracking-[2px] opacity-40">Size</h4>
                    <div className="flex flex-wrap gap-2">
                      {['S', 'M', 'L', 'XL'].map(size => (
                        <button key={size} className="w-10 h-10 border border-gray-medium flex items-center justify-center text-xs font-bold hover:border-violet transition-colors">{size}</button>
                      ))}
                    </div>
                  </div>
                </aside>
                
                <main className="flex-1">
                  <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-medium/30">
                    <span className="text-sm opacity-50">Showing {products.length} items</span>
                    <select className="bg-transparent text-sm font-bold border-none focus:ring-0 outline-none">
                      <option>Newest First</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
                    {products.map(p => (
                      <ProductCard key={p.id} product={p} onOpen={(p) => { setSelectedProduct(p); navigate('product'); }} />
                    ))}
                  </div>
                </main>
              </div>
            </div>
          )}

          {currentPage === 'product' && selectedProduct && (
            <div className="py-12 lg:py-20 min-h-screen">
               <div className="container mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
                  <div className="space-y-6">
                    <div className="aspect-[4/5] bg-gray-light overflow-hidden">
                      {selectedProduct.image ? (
                        <img 
                          src={selectedProduct.image} 
                          alt={selectedProduct.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div 
                          className="w-full h-full flex items-center justify-center font-serif text-4xl opacity-20 uppercase tracking-tighter"
                          style={{ background: `linear-gradient(135deg, ${selectedProduct.color}22, ${selectedProduct.color}11)` }}
                        >
                          {selectedProduct.label}
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="aspect-square bg-gray-light border border-gray-medium/20" />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-10">
                    <div>
                      <h1 className="text-5xl lg:text-7xl mb-4">{selectedProduct.name}</h1>
                      <div className="flex flex-col gap-2">
                        <p className="text-2xl font-bold text-violet">৳{selectedProduct.price.toLocaleString()}</p>
                        <div className="text-[10px] font-bold uppercase tracking-widest">
                          {selectedProduct.stock > 10 ? (
                            <span className="text-success">✓ In Stock</span>
                          ) : selectedProduct.stock > 0 ? (
                            <span className="text-amber-600">⚠ Only {selectedProduct.stock} left</span>
                          ) : (
                            <span className="text-danger flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              ✕ Out of Stock
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-lg opacity-70 leading-relaxed">
                      {selectedProduct.description || "A lightweight, breathable shirt crafted from 100% organic materials. Hand-stitched in our Dhaka workshop using ethical manufacturing practices."}
                    </p>

                    <div className="space-y-8 text-charcoal">
                      <div>
                        <span className="block text-sm font-bold uppercase tracking-widest mb-4 opacity-40">Size</span>
                        <div className="flex gap-3">
                          {['S','M','L','XL'].map(size => (
                            <button key={size} className={cn(
                              "w-12 h-12 border flex items-center justify-center font-bold text-xs transition-colors",
                              size === 'M' ? "bg-charcoal text-white" : "border-gray-medium hover:border-charcoal",
                              selectedProduct.stock === 0 && "opacity-20 cursor-not-allowed"
                            )}>
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button 
                        disabled={selectedProduct.stock === 0}
                        onClick={() => { addToCart(selectedProduct); setIsCartOpen(true); }}
                        className={cn(
                          "w-full py-5 font-bold uppercase tracking-widest transition-all shadow-lg active:scale-95",
                          selectedProduct.stock === 0 
                            ? "bg-gray-medium text-white cursor-not-allowed" 
                            : "bg-violet text-white hover:bg-charcoal"
                        )}
                      >
                        {selectedProduct.stock === 0 ? "Out of Stock" : "Add to Bag"}
                      </button>
                    </div>

                    <div className="space-y-4 pt-10 border-t border-gray-medium/30">
                      {['Details', 'Shipping', 'Size Guide'].map((tab) => (
                        <div key={tab} className="border-b border-gray-medium/20 py-4 last:border-0 flex justify-between items-center opacity-70 hover:opacity-100 cursor-pointer">
                           <span className="font-bold uppercase tracking-widest text-xs">{tab}</span>
                           <ArrowRight className="w-4 h-4" />
                        </div>
                      ))}
                    </div>
                  </div>
               </div>
            </div>
          )}

          {currentPage === 'track' && (
            <div className="min-h-screen">
              <section className="py-24 bg-gray-light text-center">
                <div className="container mx-auto px-6">
                  <h1 className="text-5xl lg:text-6xl mb-8">Track Your Order</h1>
                  <form onSubmit={handleTrack} className="max-w-xl mx-auto flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Order ID (e.g. KITE-1001)"
                      className="flex-1 p-4 border border-gray-medium rounded-lg outline-none focus:border-violet transition-colors"
                      value={trackId}
                      onChange={e => setTrackId(e.target.value)}
                    />
                    <button type="submit" className="bg-charcoal text-white px-8 py-4 rounded-lg font-bold uppercase tracking-widest hover:bg-violet transition-colors">Track</button>
                  </form>
                </div>
              </section>

              <section className="py-20 container mx-auto px-6">
                {trackedOrder ? (
                  <div className="max-w-3xl mx-auto border border-gray-medium p-8 lg:p-12">
                    <div className="flex justify-between items-center border-b border-gray-medium pb-8 mb-12">
                      <div>
                        <span className="text-sm opacity-50 uppercase tracking-widest">Order ID</span>
                        <h3 className="text-3xl">{trackedOrder.id}</h3>
                      </div>
                      <div className={cn(
                        "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest",
                        trackedOrder.status === 'delivered' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                      )}>
                        {trackedOrder.status.replace('-', ' ')}
                      </div>
                    </div>

                    <div className="space-y-12 relative pl-8">
                      <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-gray-medium" />
                      {[
                        { status: 'pending', icon: Clock, label: 'Order Received', desc: 'Your order has been placed and is waiting for processing.' },
                        { status: 'onway', icon: Truck, label: 'Out for Delivery', desc: 'Our delivery agent is on their way to your location.' },
                        { status: 'delivered', icon: CheckCircle2, label: 'Delivered', desc: 'Order has been successfully delivered and payment received.' }
                      ].map((step) => {
                        const statusWeights = { pending: 1, onway: 2, delivered: 3, cancelled: 0 };
                        const orderLevel = statusWeights[trackedOrder.status];
                        const stepLevel = statusWeights[step.status as OrderStatus];
                        const isDone = orderLevel >= stepLevel;

                        return (
                          <div key={step.status} className="relative">
                            <div className={cn(
                              "absolute -left-[32px] top-1 w-6 h-6 rounded-full border-4 border-white z-10 flex items-center justify-center",
                              isDone ? "bg-success" : "bg-gray-medium"
                            )}>
                              {isDone && <CheckCircle2 className="w-3 h-3 text-white" />}
                            </div>
                            <div>
                                <h4 className={cn("font-bold text-lg mb-1", isDone ? "text-charcoal" : "opacity-30")}>{step.label}</h4>
                                <p className={cn("text-sm max-w-sm", isDone ? "opacity-60" : "opacity-20")}>{step.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {trackedOrder.trackingLink && (
                      <div className="mt-12 pt-8 border-t border-gray-medium bg-gray-50 p-6 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-violet/10 rounded-full flex items-center justify-center text-violet">
                            <Truck className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-widest opacity-40">Courier Tracking</p>
                            <a 
                              href={trackedOrder.trackingLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-lg font-bold text-violet hover:underline flex items-center gap-2"
                            >
                              Track your package here
                              <ArrowRight className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : trackId && (
                  <div className="text-center py-20 opacity-30">
                    <AlertCircle className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-xl">Order not found. Please check your ID.</p>
                  </div>
                )}
              </section>
            </div>
          )}

          {currentPage === 'about' && (
             <div className="container mx-auto px-6 lg:px-10 py-20 space-y-32">
                <div className="max-w-4xl space-y-10">
                   <h1 className="text-6xl lg:text-8xl">Born from the skies of Dhaka.</h1>
                   <p className="text-2xl opacity-70 leading-relaxed">
                     Modern silhouettes meet traditional Bangladeshi craftsmanship. We believe every shirt should feel as free as a kite.
                   </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                  <div className="aspect-square bg-gray-light border-8 border-white shadow-xl" />
                  <div className="space-y-8 text-lg opacity-80 leading-relaxed">
                    <p>
                      kite — ঘুড়ি was founded on the idea that fashion should feel as light and free as a kite soaring over the rooftops of Old Dhaka during Shakrain.
                    </p>
                    <p>
                      Since 2021, we have been crafting modern silhouettes using traditional Bangladeshi fabrics. Every shirt tells a story of craftsmanship, local pride, and global dreams.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  {[
                    { title: 'Local Craft', desc: 'Every stitch by artisans in Dhaka, ensuring fair wages and quality.' },
                    { title: 'Honest Fabric', desc: '100% organic cotton and hand-loomed linen. Nature only.' },
                    { title: 'Fearless Design', desc: 'Clean lines, bold silhouettes, and a touch of Bengali pride.' }
                  ].map((p, i) => (
                    <div key={i} className="space-y-4">
                      <h3 className="text-2xl font-serif">{p.title}</h3>
                      <p className="opacity-60 leading-relaxed">{p.desc}</p>
                    </div>
                  ))}
                </div>
             </div>
          )}

          {currentPage === 'wishlist' && (
            <div className="container mx-auto px-6 lg:px-10 py-32 min-h-screen">
              <div className="mb-24 text-center">
                <h1 className="text-6xl lg:text-7xl mb-4 font-serif">Your Wishlist</h1>
                <p className="text-sm uppercase tracking-[4px] opacity-40 font-bold">Saved items for later</p>
              </div>
              
              {wishlist.length === 0 ? (
                <div className="text-center py-48 opacity-20 space-y-8">
                   <Heart className="w-24 h-24 mx-auto text-charcoal" />
                   <p className="text-xl font-serif uppercase tracking-[4px]">Nothing saved yet</p>
                   <button onClick={() => navigate('shop')} className="border border-charcoal px-10 py-4 font-bold uppercase tracking-widest text-xs hover:bg-charcoal hover:text-white transition-all">Start Shopping</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                  {products.filter(p => wishlist.includes(p.id)).map(p => (
                    <ProductCard key={p.id} product={p} onOpen={(p) => { setSelectedProduct(p); navigate('product'); }} />
                  ))}
                </div>
              )}
            </div>
          )}

          {currentPage === 'collections' && (
            <div className="container mx-auto px-6 lg:px-10 py-24 min-h-screen">
              <header className="mb-16">
                <h1 className="text-6xl lg:text-8xl mb-4 font-serif">Collections</h1>
                <p className="text-[10px] font-bold uppercase tracking-[4px] opacity-40">
                   {filteredCollections.length} shirts available
                </p>
              </header>

              <div className="flex gap-3 mb-16 overflow-x-auto pb-4 scrollbar-hide">
                {['all', 'Heritage', 'Summer', 'Urban'].map((cat) => (
                  <button 
                    key={cat}
                    onClick={() => setCollectionFilter(cat as any)}
                    className={cn(
                      "px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest border transition-all whitespace-nowrap",
                      collectionFilter === cat 
                        ? "bg-violet text-white border-violet shadow-lg" 
                        : "bg-white text-charcoal border-gray-medium hover:border-charcoal shadow-sm"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {filteredCollections.length === 0 ? (
                <div className="text-center py-32 space-y-6">
                  <div className="text-5xl">👕</div>
                  <p className="text-xl font-serif opacity-30 italic">
                    {products.length === 0 ? "No products available yet." : "No shirts in this collection yet."}
                  </p>
                  <button onClick={() => setCollectionFilter('all')} className="text-violet font-bold uppercase text-[10px] tracking-widest hover:underline">View All Collections</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-10">
                  {filteredCollections.map(p => (
                    <div key={p.id} className={cn("relative", p.stock === 0 && "opacity-60")}>
                      {p.stock === 0 && (
                        <div className="absolute top-4 left-0 z-[11] bg-danger text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 shadow-xl">
                          Out of Stock
                        </div>
                      )}
                      <ProductCard product={p} onOpen={(prod) => { setSelectedProduct(prod); navigate('product'); }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentPage === 'contact' && (
            <div className="container mx-auto px-6 lg:px-10 py-24 min-h-screen">
              <header className="mb-20">
                <h1 className="text-6xl lg:text-8xl mb-6 font-serif tracking-tighter">Get in touch.</h1>
                <p className="text-xl opacity-50 max-w-2xl">
                  Questions about your order, sizing, or anything else? We're always here.
                </p>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 pb-32">
                {/* Left Column: Contact info & Socials */}
                <div className="space-y-16">
                  <div className="space-y-10">
                    <div className="flex gap-6 items-start">
                      <div className="w-14 h-14 bg-gray-light flex items-center justify-center shrink-0 rounded-xl">
                        <MapPin className="w-6 h-6 opacity-40 text-charcoal" />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2">Showroom</h4>
                        <p className="text-lg text-charcoal opacity-80 leading-relaxed font-serif">House 14, Road 27, Dhanmondi,<br />Dhaka 1209</p>
                      </div>
                    </div>

                    <div className="flex gap-6 items-start">
                      <div className="w-14 h-14 bg-gray-light flex items-center justify-center shrink-0 rounded-xl">
                        <Phone className="w-6 h-6 opacity-40 text-charcoal" />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2">WhatsApp</h4>
                        <a href="https://wa.me/8801700000000" target="_blank" className="text-xl font-bold text-charcoal opacity-80 hover:text-violet transition-colors">+880 1700 000 000</a>
                      </div>
                    </div>

                    <div className="flex gap-6 items-start">
                      <div className="w-14 h-14 bg-gray-light flex items-center justify-center shrink-0 rounded-xl">
                        <Mail className="w-6 h-6 opacity-40 text-charcoal" />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2">Email</h4>
                        <a href="mailto:hello@kitebd.com" className="text-lg font-bold text-charcoal opacity-80 hover:text-violet transition-colors">hello@kitebd.com</a>
                      </div>
                    </div>

                    <div className="flex gap-6 items-start">
                      <div className="w-14 h-14 bg-gray-light flex items-center justify-center shrink-0 rounded-xl">
                        <Clock className="w-6 h-6 opacity-40 text-charcoal" />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2">Hours</h4>
                        <p className="text-lg text-charcoal opacity-80 leading-relaxed font-serif">Saturday–Thursday,<br />10AM – 8PM</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 pt-10 border-t border-gray-medium/10">
                    <h4 className="text-[10px] font-bold uppercase tracking-[2px] opacity-40">Follow us on Facebook</h4>
                    <div className="flex flex-wrap gap-4">
                      <a 
                        href="https://www.facebook.com/share/1HEZeZC97a/" 
                        target="_blank" 
                        rel="noreferrer"
                        className="bg-[#1877F2] text-white px-8 py-5 rounded-lg font-bold flex items-center gap-3 hover:opacity-90 transition-all shadow-lg active:scale-95 text-xs uppercase tracking-widest"
                      >
                        <span className="text-lg">𝖋</span>
                        <span>Follow us on Facebook</span>
                      </a>
                      <a 
                        href="https://www.instagram.com/kite_ghuri?igsh=MW9tOTQ4NzlzNWxsbg==" 
                        target="_blank" 
                        rel="noreferrer"
                        className="bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white px-8 py-5 rounded-lg font-bold flex items-center gap-3 hover:opacity-90 transition-all shadow-lg active:scale-95 text-xs uppercase tracking-widest"
                      >
                        <span className="text-xl">📷</span>
                        <span>Follow us on Instagram</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Right Column: Contact Form */}
                <div className="relative">
                  <div className="absolute -top-10 -right-10 w-40 h-40 kite-shape opacity-10 blur-2xl rotate-45 pointer-events-none" />
                  <ContactForm />
                </div>
              </div>

              {/* FAQ Section */}
              <div className="mt-20 pt-32 border-t border-gray-medium/30">
                <header className="text-center mb-20">
                  <h2 className="text-4xl lg:text-5xl font-serif mb-4">Common Questions</h2>
                  <p className="text-sm opacity-40 uppercase tracking-[2px]">Find quick answers to your queries</p>
                </header>
                <div className="max-w-3xl mx-auto">
                  <FaqAccordion />
                </div>
              </div>
            </div>
          )}

          {currentPage === 'lookbook' && (
            <div className="container mx-auto px-6 py-48 text-center min-h-[600px] flex flex-col justify-center items-center">
              <h1 className="text-5xl lg:text-7xl font-serif capitalize mb-8">{currentPage}</h1>
              <p className="text-sm uppercase tracking-[4px] opacity-40 font-bold mb-12">Coming soon to the sky.</p>
              <button 
                onClick={() => navigate('shop')}
                className="bg-violet text-white px-12 py-5 font-bold uppercase tracking-widest hover:bg-charcoal transition-all shadow-lg active:scale-95 text-xs"
              >
                Go back to Shop
              </button>
            </div>
          )}

        </motion.main>
      </AnimatePresence>

      <Footer onShowPage={navigate} />

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        onPlaceOrder={() => { setIsCartOpen(false); setIsOrderModalOpen(true); }} 
      />

      <OrderModal 
        isOpen={isOrderModalOpen} 
        onClose={() => setIsOrderModalOpen(false)} 
        onShowPage={navigate}
      />

      <AdminPanel 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
      />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
