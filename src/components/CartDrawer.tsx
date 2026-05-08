import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Trash2 } from 'lucide-react';
import { useStore } from '../StoreContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaceOrder: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onPlaceOrder }) => {
  const { cart, removeFromCart } = useStore();
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[1500]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 w-full max-w-[450px] h-full bg-white z-[1600] flex flex-col p-8 lg:p-10 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-10 text-charcoal">
              <h3 className="text-2xl font-serif">Your Bag</h3>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-8 h-8 opacity-50" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-40 gap-4 text-charcoal">
                  <ShoppingBag className="w-16 h-16" />
                  <p className="text-lg">Your cart is empty.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-8 border-b border-gray-light text-charcoal">
                      <div 
                        className="w-24 h-32 bg-gray-light flex-shrink-0 flex items-center justify-center font-serif text-sm opacity-40 uppercase tracking-tighter"
                        style={{ background: `linear-gradient(135deg, ${item.color}33, ${item.color}11)` }}
                      >
                        {item.label}
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <h4 className="font-semibold text-lg">{item.name}</h4>
                          <p className="text-sm opacity-50 uppercase tracking-widest mt-1">Size: M</p>
                        </div>
                        <div className="flex justify-between items-end">
                          <div className="text-sm">
                            <span className="font-medium">{item.qty} × ৳{item.price.toLocaleString()}</span>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-danger hover:underline text-sm flex items-center gap-1 group"
                          >
                            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-8 border-t border-gray-medium mt-auto text-charcoal">
              <div className="flex justify-between mb-8">
                <span className="text-lg opacity-60">Subtotal</span>
                <span className="text-2xl font-bold">৳{subtotal.toLocaleString()}</span>
              </div>
              <button 
                disabled={cart.length === 0}
                onClick={onPlaceOrder}
                className="w-full bg-violet text-white py-5 font-bold uppercase tracking-[2px] hover:bg-charcoal transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg active:scale-95 transition-transform"
              >
                Place Order
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
