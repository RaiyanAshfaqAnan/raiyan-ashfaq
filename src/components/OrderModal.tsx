import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2 } from 'lucide-react';
import { useStore } from '../StoreContext';
import { Order, OrderStatus, PaymentStatus } from '../types';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowPage: (page: string) => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, onShowPage }) => {
  const { cart, clearCart, addOrder } = useStore();
  const [step, setStep] = useState(1);
  const [orderDetails, setOrderDetails] = useState({
    name: '',
    phone: '',
    location: ''
  });
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderDetails.name || !orderDetails.phone || !orderDetails.location) return;

    const newOrder: Order = {
      id: `KITE-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: orderDetails.name,
      phone: orderDetails.phone,
      location: orderDetails.location,
      items: [...cart],
      totalPrice: subtotal,
      paymentMethod: 'COD',
      paid: 'Unpaid',
      status: 'pending',
      trackingEnabled: false,
      trackingLink: '',
      createdAt: new Date().toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' })
    };

    addOrder(newOrder);
    setCreatedOrder(newOrder);
    clearCart(); // Requirement: Only clear cart on success
    setStep(2);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 z-[2000] backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] bg-white z-[2100] p-8 lg:p-12 shadow-2xl max-h-[90vh] overflow-y-auto text-charcoal border border-gray-medium/10"
          >
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-serif">Checkout</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors opacity-50">
                <X className="w-8 h-8" />
              </button>
            </div>

            {step === 1 ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-charcoal/40 mb-2">Full Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Your Name"
                      className="w-full p-4 border border-gray-medium rounded-lg outline-none focus:border-violet transition-colors"
                      value={orderDetails.name}
                      onChange={e => setOrderDetails(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-charcoal/40 mb-2">Phone Number</label>
                    <input 
                      required
                      type="tel" 
                      placeholder="01XXXXXXXXX"
                      className="w-full p-4 border border-gray-medium rounded-lg outline-none focus:border-violet transition-colors"
                      value={orderDetails.phone}
                      onChange={e => setOrderDetails(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-charcoal/40 mb-2">Delivery Address</label>
                    <textarea 
                      required
                      placeholder="House, Road, Area, City"
                      className="w-full p-4 border border-gray-medium rounded-lg outline-none focus:border-violet transition-colors resize-none h-24"
                      value={orderDetails.location}
                      onChange={e => setOrderDetails(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="bg-gray-light p-6 rounded-lg flex items-center gap-4 border border-gray-medium/50">
                  <div className="text-2xl">💵</div>
                  <div>
                    <p className="font-bold">Cash on Delivery</p>
                    <p className="text-sm opacity-60">Pay when you receive your kite.</p>
                  </div>
                </div>

                <div className="border-t border-gray-medium pt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="opacity-60 uppercase tracking-widest text-xs font-bold">Total Payable</span>
                    <span className="text-2xl font-bold text-violet">৳{subtotal.toLocaleString()}</span>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-violet text-white py-5 font-bold uppercase tracking-[2px] hover:bg-charcoal transition-colors shadow-lg active:scale-95 transition-transform"
                >
                  Confirm Order
                </button>
              </form>
            ) : (
              <div className="text-center py-8 space-y-8">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-success/10 text-success rounded-full">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-4xl font-serif">Order Placed!</h2>
                  <p className="opacity-60 max-w-sm mx-auto">Thank you for choosing kite. Your order will be verified via phone call shortly.</p>
                </div>
                
                <div className="bg-gray-light p-8 rounded-lg border border-gray-medium/50">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-40 block mb-2">Order Tracking ID</span>
                  <div className="text-4xl font-bold text-charcoal tracking-tighter">{createdOrder?.id}</div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button 
                    onClick={() => { onClose(); onShowPage('track'); setStep(1); }}
                    className="flex-1 border border-gray-medium py-4 rounded font-bold uppercase tracking-widest text-xs hover:bg-gray-light transition-colors"
                  >
                    Track Order
                  </button>
                  <button 
                    onClick={() => { onClose(); onShowPage('home'); setStep(1); }}
                    className="flex-1 bg-charcoal text-white py-4 rounded font-bold uppercase tracking-widest text-xs hover:bg-violet transition-colors"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
