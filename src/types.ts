export type Category = 'Heritage' | 'Summer' | 'Urban';

export interface Product {
  id: number;
  name: string;
  price: number;
  category: Category;
  color: string;
  image?: string | null;
  label: string;
  stock: number;
  description?: string;
}

export type OrderStatus = 'pending' | 'onway' | 'delivered' | 'cancelled';
export type PaymentStatus = 'Unpaid' | 'Paid';

export interface OrderItem extends Product {
  qty: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  location: string;
  items: OrderItem[];
  totalPrice: number;
  paymentMethod: string;
  paid: PaymentStatus;
  status: OrderStatus;
  trackingEnabled: boolean;
  trackingLink?: string;
  createdAt: string;
}
