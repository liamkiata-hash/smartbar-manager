import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Table, Product, Order, CurrencyCode, CurrencyRates, TableStatus } from '../types';
import { DEFAULT_RATES } from '../lib/utils';
import { toast } from 'sonner';

interface DataContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  tables: Table[];
  products: Product[];
  orders: Order[];
  rates: CurrencyRates;
  baseCurrency: CurrencyCode;
  updateRates: (newRates: CurrencyRates) => void;
  setBaseCurrency: (cur: CurrencyCode) => void;
  addOrder: (order: Order) => void;
  completeOrder: (orderId: string) => void;
  updateTableStatus: (id: number, status: TableStatus, orderId?: string) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  logout: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('smartbar_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [tables, setTables] = useState<Table[]>(() => {
    const saved = localStorage.getItem('smartbar_tables');
    return saved ? JSON.parse(saved) : Array.from({ length: 12 }, (_, i) => ({ id: i + 1, status: 'free' }));
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('smartbar_products');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Primus 72cl', category: 'Bière', price: 2.5, stock: 50, minStockAlert: 10 },
      { id: '2', name: 'Coca Cola 33cl', category: 'Soda', price: 1.2, stock: 100, minStockAlert: 20 },
      { id: '3', name: 'Heineken', category: 'Bière', price: 3.5, stock: 24, minStockAlert: 12 },
      { id: '4', name: 'Eau Vive 1.5L', category: 'Eau', price: 1.0, stock: 60, minStockAlert: 15 },
    ];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('smartbar_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [rates, setRates] = useState<CurrencyRates>(() => {
    const saved = localStorage.getItem('smartbar_rates');
    return saved ? JSON.parse(saved) : DEFAULT_RATES;
  });

  const [baseCurrency, setBaseCurrency] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem('smartbar_base_currency');
    return (saved as CurrencyCode) || 'USD';
  });

  useEffect(() => {
    localStorage.setItem('smartbar_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('smartbar_tables', JSON.stringify(tables));
  }, [tables]);

  useEffect(() => {
    localStorage.setItem('smartbar_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('smartbar_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('smartbar_rates', JSON.stringify(rates));
  }, [rates]);

  useEffect(() => {
    localStorage.setItem('smartbar_base_currency', baseCurrency);
  }, [baseCurrency]);

  const updateTableStatus = (id: number, status: TableStatus, orderId?: string) => {
    setTables(prev => prev.map(t => t.id === id ? { ...t, status, currentOrderId: orderId } : t));
  };

  const addOrder = (order: Order) => {
    setOrders(prev => [...prev, order]);
    // Decrease stock
    setProducts(prev => prev.map(p => {
      const orderItem = order.items.find(item => item.productId === p.id);
      if (orderItem) {
        const newStock = p.stock - orderItem.quantity;
        if (newStock <= p.minStockAlert) {
          toast.warning(`Stock faible: ${p.name} (${newStock} restants)`);
        }
        return { ...p, stock: newStock };
      }
      return p;
    }));
  };

  const completeOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'completed', completedAt: Date.now() } : o));
  };

  const addProduct = (p: Product) => setProducts(prev => [...prev, p]);
  const updateProduct = (p: Product) => setProducts(prev => prev.map(item => item.id === p.id ? p : item));
  const deleteProduct = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));
  
  const updateRates = (newRates: CurrencyRates) => setRates(newRates);
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('smartbar_user');
  };

  return (
    <DataContext.Provider value={{
      currentUser, setCurrentUser, tables, products, orders, rates, baseCurrency,
      updateRates, setBaseCurrency, addOrder, completeOrder, updateTableStatus,
      addProduct, updateProduct, deleteProduct, logout
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};