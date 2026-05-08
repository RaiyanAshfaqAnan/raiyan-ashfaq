import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Order, OrderItem } from './types';
import { LOCAL_STORAGE_KEYS, PRODUCTS } from './constants';

interface StoreContextType {
  products: Product[];
  orders: Order[];
  cart: OrderItem[];
  wishlist: number[];
  adminLoggedIn: boolean;
  geminiKey: string;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: number) => void;
  addOrder: (order: Order) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  deleteOrder: (orderId: string) => void;
  loginAdmin: () => void;
  logoutAdmin: () => void;
  setGeminiKey: (key: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.PRODUCTS);
    if (saved) {
      // Ensure existing products have stock property
      const parsed = JSON.parse(saved);
      return parsed.map((p: any) => ({ ...p, stock: p.stock ?? 0 }));
    }
    return PRODUCTS;
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : [];
  });
  const [cart, setCart] = useState<OrderItem[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CART);
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlist, setWishlist] = useState<number[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.WISHLIST);
    return saved ? JSON.parse(saved) : [];
  });
  const [adminLoggedIn, setAdminLoggedIn] = useState(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.ADMIN_LOGGED_IN) === 'true';
  });
  const [geminiKey, setGeminiKeyState] = useState(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.GEMINI_KEY) || '';
  });

  // Persistent Savings
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ADMIN_LOGGED_IN, adminLoggedIn.toString());
  }, [adminLoggedIn]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.GEMINI_KEY, geminiKey);
  }, [geminiKey]);

  const addToCart = useCallback((product: Product, qty: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + qty } : item);
      }
      return [...prev, { ...product, qty }];
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const toggleWishlist = useCallback((productId: number) => {
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  }, []);

  const addOrder = useCallback((order: Order) => {
    setOrders(prev => [...prev, order]);
    // Deduct Stock
    setProducts(prevProducts => prevProducts.map(p => {
      const orderItem = order.items.find(item => item.id === p.id);
      if (orderItem) {
        return { ...p, stock: Math.max(0, (p.stock ?? 0) - orderItem.qty) };
      }
      return p;
    }));
  }, []);

  const updateOrder = useCallback((orderId: string, updates: Partial<Order>) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updates } : o));
  }, []);

  const deleteOrder = useCallback((orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  }, []);

  const loginAdmin = useCallback(() => setAdminLoggedIn(true), []);
  const logoutAdmin = useCallback(() => setAdminLoggedIn(false), []);
  const setGeminiKey = useCallback((key: string) => setGeminiKeyState(key), []);

  return (
    <StoreContext.Provider value={{
      products, orders, cart, wishlist, adminLoggedIn, geminiKey,
      setProducts, addToCart, removeFromCart, clearCart, toggleWishlist,
      addOrder, updateOrder, deleteOrder, loginAdmin, logoutAdmin, setGeminiKey
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};
