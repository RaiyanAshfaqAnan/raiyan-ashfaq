import React from 'react';
import { motion } from 'motion/react';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../StoreContext';
import { cn } from '../lib/utils';

interface ProductCardProps {
  product: Product;
  onOpen: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpen }) => {
  const { toggleWishlist, wishlist, addToCart } = useStore();
  const isWishlisted = wishlist.includes(product.id);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group cursor-pointer"
      onClick={() => onOpen(product)}
    >
      <div className="relative aspect-[4/5] bg-gray-light overflow-hidden mb-4">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <>
            <div 
              className="absolute inset-0 opacity-20 transition-transform duration-700 group-hover:scale-110"
              style={{ background: `linear-gradient(135deg, ${product.color}, transparent)` }}
            />
            <div className="absolute inset-0 flex items-center justify-center font-serif text-xl opacity-30">
              {product.label}
            </div>
          </>
        )}
        
        <button 
          className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md z-10 hover:scale-110 transition-transform"
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
        >
          <Heart className={cn("w-5 h-5 transition-colors", isWishlisted ? "fill-danger text-danger" : "text-charcoal")} />
        </button>

        {product.stock === 0 ? (
          <div className="absolute bottom-0 left-0 w-full bg-gray-400 text-white py-4 font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-not-allowed">
            Out of Stock
          </div>
        ) : (
          <motion.button 
            className="absolute bottom-0 left-0 w-full bg-violet text-white py-4 font-semibold uppercase tracking-wider translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2"
            onClick={(e) => { e.stopPropagation(); addToCart(product); }}
          >
            <ShoppingBag className="w-5 h-5" />
            Add to Bag
          </motion.button>
        )}
      </div>

      <div className="space-y-1 px-1">
        <h3 className="font-sans font-medium text-lg text-charcoal">{product.name}</h3>
        <p className="font-bold text-violet">৳{product.price.toLocaleString()}</p>
        <div className="text-[10px] font-bold uppercase tracking-widest mt-1">
          {product.stock > 10 ? (
            <span className="text-success">✓ In Stock</span>
          ) : product.stock > 0 ? (
            <span className="text-amber-600">⚠ Only {product.stock} left</span>
          ) : (
            <span className="text-danger">✕ Out of Stock</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
