export type Role = 'boss' | 'waiter';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export type TableStatus = 'free' | 'occupied' | 'paying';

export interface Table {
  id: number;
  status: TableStatus;
  currentOrderId?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number; // base price (usually in the primary currency)
  stock: number;
  minStockAlert: number;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  priceAtOrder: number;
}

export interface Order {
  id: string;
  tableId: number;
  waiterId: string;
  waiterName: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'completed';
  timestamp: number;
  completedAt?: number;
  currency: CurrencyCode;
}

export type CurrencyCode = 'USD' | 'CDF' | 'EUR';

export interface CurrencyRates {
  USD: number;
  CDF: number;
  EUR: number;
}