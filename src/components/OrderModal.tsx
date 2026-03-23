import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Plus, Minus, Trash2, X, CheckCircle2, ClipboardList, ShoppingBag } from 'lucide-react';
import { Product, Table, OrderItem } from '../types';
import { formatCurrency, convertAmount } from '../lib/utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface OrderModalProps {
  table: Table;
  onClose: () => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({ table, onClose }) => {
  const { products, currentUser, addOrder, completeOrder, updateTableStatus, baseCurrency, rates, orders } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [cart, setCart] = useState<OrderItem[]>([]);
  
  const existingOrder = table.currentOrderId ? orders.find(o => o.id === table.currentOrderId) : null;

  const categories = ['Tous', ...new Set(products.map(p => p.category))];
  const filteredProducts = selectedCategory === 'Tous' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      toast.error('Plus de stock pour ce produit !');
      return;
    }
    
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item => item.productId === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
        );
      }
      return [...prev, { productId: product.id, quantity: 1, priceAtOrder: product.price }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        const product = products.find(p => p.id === productId);
        if (delta > 0 && product && newQty > product.stock) {
          toast.error(`Stock insuffisant (${product.stock} max)`);
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.priceAtOrder * item.quantity), 0);
  };

  const handleSaveOrder = () => {
    if (cart.length === 0) return;

    const orderId = Math.random().toString(36).substr(2, 9);
    addOrder({
      id: orderId,
      tableId: table.id,
      waiterId: currentUser?.id || '',
      waiterName: currentUser?.name || '',
      items: cart,
      total: calculateTotal(),
      status: 'pending',
      timestamp: Date.now(),
      currency: baseCurrency
    });

    updateTableStatus(table.id, 'occupied', orderId);
    toast.success(`Commande enregistrée pour la table ${table.id}`);
    onClose();
  };

  const handleCompletePayment = () => {
    if (!existingOrder) return;
    completeOrder(existingOrder.id);
    updateTableStatus(table.id, 'free');
    toast.success(`Table ${table.id} libérée ! Paiement reçu.`);
    onClose();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-indigo-950/60 flex items-center justify-center p-4 z-50 backdrop-blur-xl"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 30, opacity: 0 }}
        className="bg-white w-full max-w-6xl h-[90vh] rounded-[3.5rem] flex flex-col overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] border border-white/20"
      >
        <div className="p-10 border-b border-indigo-50 flex items-center justify-between bg-indigo-50/20">
          <div>
            <div className="flex items-center gap-3 mb-1">
               <h2 className="text-4xl font-black text-indigo-950 tracking-tighter">Table {table.id}</h2>
               <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${table.status === 'free' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-600 text-white animate-pulse'}`}>
                 {table.status === 'free' ? 'Prise de commande' : 'Active'}
               </span>
            </div>
            <p className="text-xs font-black text-indigo-400 uppercase tracking-widest">Service par {currentUser?.name}</p>
          </div>
          <button onClick={onClose} className="w-14 h-14 flex items-center justify-center bg-white border border-indigo-50 text-indigo-300 hover:text-indigo-600 rounded-[1.5rem] transition-all shadow-sm">
            <X size={28} />
          </button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden p-8 border-r border-indigo-50">
            <div className="flex gap-3 mb-8 overflow-x-auto pb-4 no-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-8 py-3.5 rounded-full text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                    selectedCategory === cat 
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 border-2 border-indigo-500' 
                    : 'bg-white border-2 border-indigo-50 text-indigo-300 hover:border-indigo-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <motion.button
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    key={product.id}
                    onClick={() => addToCart(product)}
                    disabled={product.stock <= 0}
                    className={`group relative p-6 rounded-[2.5rem] border-2 text-left transition-all flex flex-col h-full ${
                      product.stock <= 0 
                      ? 'bg-slate-50 border-slate-100 opacity-50 cursor-not-allowed' 
                      : 'bg-white border-indigo-50 hover:border-indigo-300 hover:shadow-2xl hover:shadow-indigo-100/50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                       <span className="text-[9px] font-black text-indigo-400 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest">{product.category}</span>
                       <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-300 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                         <Plus size={16} />
                       </div>
                    </div>
                    <span className="text-lg font-black text-indigo-950 mb-4 flex-1 leading-tight group-hover:text-indigo-600 transition-colors">{product.name}</span>
                    <div className="flex items-center justify-between pt-4 border-t border-indigo-50/50">
                      <span className="font-mono font-black text-indigo-700 text-xl">{formatCurrency(product.price, baseCurrency)}</span>
                      <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${product.stock < 10 ? 'bg-orange-100 text-orange-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {product.stock} Dispo
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full md:w-[400px] bg-indigo-50/30 flex flex-col border-t md:border-t-0">
            <div className="p-8 border-b border-indigo-50">
              <h3 className="font-black text-indigo-950 uppercase tracking-tighter text-xl flex items-center gap-3">
                <ShoppingBag size={24} className="text-indigo-600" />
                Panier Client
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
              {cart.length === 0 && !existingOrder && (
                <div className="h-full flex flex-col items-center justify-center text-indigo-300 text-center p-10">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl shadow-indigo-100/50">
                    <Plus size={40} className="text-indigo-100" />
                  </div>
                  <p className="font-black uppercase tracking-widest text-xs">Sélectionnez des articles</p>
                </div>
              )}

              {existingOrder && (
                <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-indigo-100/30 border border-indigo-100/50 mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Déjà Enregistré</span>
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                  </div>
                  <div className="space-y-3">
                    {existingOrder.items.map((item, idx) => {
                      const p = products.find(prod => prod.id === item.productId);
                      return (
                        <div key={idx} className="flex justify-between items-center">
                          <span className="text-sm font-bold text-indigo-900">{p?.name} <span className="text-indigo-300 ml-1">x{item.quantity}</span></span>
                          <span className="text-sm font-black text-indigo-700">{formatCurrency(item.priceAtOrder * item.quantity, baseCurrency)}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {cart.map(item => {
                const product = products.find(p => p.id === item.productId);
                return (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={item.productId} 
                    className="flex items-center gap-4 bg-white p-5 rounded-[2rem] shadow-lg shadow-indigo-100/50 border border-indigo-50"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-sm text-indigo-950 truncate">{product?.name}</p>
                      <p className="text-[10px] text-indigo-400 font-mono font-bold">{formatCurrency(item.priceAtOrder, baseCurrency)}</p>
                    </div>
                    <div className="flex items-center bg-indigo-50 rounded-2xl p-1">
                      <button 
                        onClick={() => updateQuantity(item.productId, -1)}
                        className="w-10 h-10 flex items-center justify-center bg-white rounded-xl hover:text-indigo-600 transition-colors shadow-sm"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center font-black text-indigo-950 text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.productId, 1)}
                        className="w-10 h-10 flex items-center justify-center bg-white rounded-xl hover:text-indigo-600 transition-colors shadow-sm"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.productId)}
                      className="w-10 h-10 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                );
              })}
            </div>

            <div className="p-8 bg-white border-t border-indigo-100 rounded-t-[3.5rem] shadow-[0_-20px_40px_-10px_rgba(79,70,229,0.1)] space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-indigo-400 font-black uppercase text-[10px] tracking-widest">
                  <span>Sous-total HT</span>
                  <span className="font-mono">{formatCurrency(cart.length > 0 ? calculateTotal() : (existingOrder?.total || 0), baseCurrency)}</span>
                </div>
                <div className="flex justify-between items-end pt-3 border-t border-indigo-50">
                  <span className="font-black text-indigo-950 text-xl uppercase tracking-tighter italic">Total</span>
                  <div className="text-right">
                    <span className="text-4xl font-black text-indigo-600 font-mono block leading-none">
                      {formatCurrency(cart.length > 0 ? calculateTotal() : (existingOrder?.total || 0), baseCurrency)}
                    </span>
                    {baseCurrency !== 'USD' && (
                      <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest italic">
                        ≈ {formatCurrency(convertAmount(cart.length > 0 ? calculateTotal() : (existingOrder?.total || 0), baseCurrency, 'USD', rates), 'USD')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                {table.status === 'free' ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveOrder}
                    disabled={cart.length === 0}
                    className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 disabled:opacity-50 text-white font-black uppercase tracking-widest py-6 rounded-[2rem] shadow-2xl shadow-indigo-100 transition-all text-xs border border-white/20"
                  >
                    Valider la commande
                  </motion.button>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                     <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => updateTableStatus(table.id, 'paying', table.currentOrderId)}
                      className="bg-violet-600 hover:bg-violet-700 text-white font-black uppercase tracking-widest py-6 rounded-[2rem] shadow-xl shadow-violet-100 transition-all text-[10px]"
                    >
                      Encaissement
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCompletePayment}
                      className="bg-indigo-950 hover:bg-slate-900 text-white font-black uppercase tracking-widest py-6 rounded-[2rem] shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 transition-all text-[10px]"
                    >
                      <CheckCircle2 size={18} /> Fermer
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};