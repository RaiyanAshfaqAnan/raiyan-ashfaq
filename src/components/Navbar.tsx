import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Heart, MapPin, Search, Menu, X, Settings } from 'lucide-react';
import { useStore } from '../StoreContext';
import { cn } from '../lib/utils';

interface NavbarProps {
  onOpenAdmin: () => void;
  onOpenTracking: () => void;
  onOpenWishlist: () => void;
  onToggleCart: () => void;
  onShowPage: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenAdmin, 
  onOpenTracking, 
  onOpenWishlist, 
  onToggleCart, 
  onShowPage 
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cart, wishlist } = useStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  const NavLink = ({ to, children }: { to: string, children: React.ReactNode }) => (
    <button 
      onClick={() => { onShowPage(to); setMobileMenuOpen(false); }}
      className="hover:text-violet transition-colors font-medium text-sm lg:text-base"
    >
      {children}
    </button>
  );

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 w-full h-20 flex items-center justify-between px-6 lg:px-10 z-[1000] transition-all duration-300",
        scrolled ? "bg-white h-[70px] border-b border-gray-medium shadow-[0_4px_20px_rgba(0,0,0,0.03)]" : "bg-transparent"
      )}>
        <div className="flex items-center gap-4 lg:hidden">
          <button onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-6 h-6 text-charcoal" />
          </button>
        </div>

        <div 
          className="font-serif text-2xl lg:text-3xl cursor-pointer"
          onClick={() => onShowPage('home')}
        >
          kite — ঘুড়ি
        </div>

        <div className="hidden lg:flex items-center gap-10">
          <NavLink to="home">Home</NavLink>
          <NavLink to="shop">Shop</NavLink>
          <NavLink to="collections">Collections</NavLink>
          <NavLink to="lookbook">Lookbook</NavLink>
          <NavLink to="about">About</NavLink>
          <NavLink to="contact">Contact</NavLink>
        </div>

        <div className="flex items-center gap-4 lg:gap-6 text-charcoal">
          <button className="relative group" onClick={onOpenTracking} title="Track Order">
            <MapPin className="w-5 h-5 lg:w-6 lg:h-6 group-hover:text-violet transition-colors" />
          </button>
          <button className="relative group hidden lg:block">
            <Search className="w-5 h-5 lg:w-6 lg:h-6 group-hover:text-violet transition-colors" />
          </button>
          <button className="relative group" onClick={onOpenWishlist}>
            <Heart className={cn("w-5 h-5 lg:w-6 lg:h-6 transition-colors", wishlist.length > 0 ? "fill-danger text-danger" : "group-hover:text-violet")} />
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-violet text-white text-[10px] w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold">
                {wishlist.length}
              </span>
            )}
          </button>
          <button className="relative group" onClick={onToggleCart}>
            <ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6 group-hover:text-violet transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-violet text-white text-[10px] w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
          <button className="relative group" onClick={onOpenAdmin} title="Admin">
            <Settings className="w-5 h-5 lg:w-6 lg:h-6 group-hover:text-violet transition-colors" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-[1100]"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed top-0 left-0 w-4/5 h-full bg-white z-[1200] p-10 flex flex-col gap-6"
            >
              <button 
                className="absolute top-6 right-6"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="w-8 h-8" />
              </button>
              <div className="font-serif text-3xl mb-10">kite — ঘুড়ি</div>
              <div className="flex flex-col gap-6 text-xl">
                <NavLink to="home">Home</NavLink>
                <NavLink to="shop">Shop</NavLink>
                <NavLink to="collections">Collections</NavLink>
                <NavLink to="lookbook">Lookbook</NavLink>
                <NavLink to="about">About</NavLink>
                <NavLink to="contact">Contact</NavLink>
                <NavLink to="track">Track Order</NavLink>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
