import { Product } from './types';

export const PRODUCTS: Product[] = [
  { id: 1, name: "Midnight Linen", price: 1850, category: "Heritage", color: "#2C2C2A", label: "Linen Shirt", stock: 15, description: "A timeless charcoal linen shirt, perfect for evening gatherings." },
  { id: 2, name: "Saffron Breeze", price: 1690, category: "Summer", color: "#EF9F27", label: "Cotton Shirt", stock: 15, description: "Breathable cotton in a vibrant saffron hue, capturing the Dhaka sun." },
  { id: 3, name: "Teal Drift", price: 1950, category: "Urban", color: "#1D9E75", label: "Oversized", stock: 15, description: "Modern oversized fit in a deep teal, designed for the urban explorer." },
  { id: 4, name: "Cloud White", price: 1550, category: "Heritage", color: "#FFFFFF", label: "Formal", stock: 15, description: "The essential white shirt, crisp and versatile for any occasion." },
  { id: 5, name: "Violet Dusk", price: 1790, category: "Summer", color: "#534AB7", label: "Slim Fit", stock: 15, description: "Elegant violet shade in a tailored slim fit profile." },
  { id: 6, name: "Sand Dune", price: 1850, category: "Urban", color: "#D2B48C", label: "Casual", stock: 15, description: "Earth-toned casual shirt with a relaxed feel." },
  { id: 7, name: "Forest Root", price: 1990, category: "Urban", color: "#2E4A3E", label: "Utility", stock: 15, description: "Deep forest green with functional utility pockets." },
  { id: 8, name: "Coral Sky", price: 1650, category: "Summer", color: "#FF7F50", label: "Henley", stock: 15, description: "Soft coral henley-style shirt for effortless summer days." },
  { id: 9, name: "Ink Wash", price: 2100, category: "Heritage", color: "#000080", label: "Double Pocket", stock: 15, description: "Heritage navy with double chest pockets and premium stitching." }
];

export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'kite@2025'
};

export const LOCAL_STORAGE_KEYS = {
  PRODUCTS: 'kite_products',
  ORDERS: 'kite_orders',
  CART: 'kite_cart',
  WISHLIST: 'kite_wishlist',
  ADMIN_LOGGED_IN: 'kite_admin_auth',
  GEMINI_KEY: 'kite_gemini_key'
};
