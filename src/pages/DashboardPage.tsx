import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { formatCurrency } from '../lib/utils';
import { 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  Package, 
  ArrowUpRight, 
  Calendar,
  Zap,
  BarChart3
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';

export const DashboardPage: React.FC = () => {
  const { orders, products, baseCurrency } = useData();

  const todayOrders = useMemo(() => {
    const today = new Date().setHours(0, 0, 0, 0);
    return orders.filter(o => o.timestamp >= today);
  }, [orders]);

  const dailySales = todayOrders.reduce((sum, o) => sum + o.total, 0);
  
  const topProducts = useMemo(() => {
    const productCounts: Record<string, number> = {};
    orders.forEach(o => {
      o.items.forEach(item => {
        productCounts[item.productId] = (productCounts[item.productId] || 0) + item.quantity;
      });
    });
    
    return Object.entries(productCounts)
      .map(([id, count]) => ({
        name: products.find(p => p.id === id)?.name || 'Inconnu',
        count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [orders, products]);

  const salesByWaiter = useMemo(() => {
    const waiterTotals: Record<string, number> = {};
    orders.forEach(o => {
      waiterTotals[o.waiterName] = (waiterTotals[o.waiterName] || 0) + o.total;
    });
    
    return Object.entries(waiterTotals)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total);
  }, [orders]);

  const stats = [
    { label: 'Ventes du Jour', value: formatCurrency(dailySales, baseCurrency), icon: <TrendingUp className="text-white" />, trend: '+12%', color: 'from-indigo-600 to-indigo-800' },
    { label: 'Commandes', value: todayOrders.length, icon: <ShoppingCart className="text-white" />, trend: '+5%', color: 'from-violet-500 to-violet-700' },
    { label: 'Stock Critique', value: products.filter(p => p.stock <= p.minStockAlert).length, icon: <Package className="text-white" />, trend: 'Alerte', color: 'from-purple-600 to-purple-800' },
    { label: 'Staff Actif', value: salesByWaiter.length, icon: <Users className="text-white" />, trend: 'Live', color: 'from-blue-600 to-blue-800' },
  ];

  return (
    <div className="space-y-10 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-indigo-950 tracking-tight leading-none">Bonjour, Patron 👋</h1>
          <p className="text-indigo-500 font-medium flex items-center gap-2">
            <Calendar size={18} className="text-indigo-400" /> {format(new Date(), 'eeee d MMMM yyyy', { locale: fr })}
          </p>
        </div>
        <div className="bg-white/50 backdrop-blur-sm border border-indigo-100 p-2 rounded-2xl flex items-center gap-3">
           <div className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-100">
            <Zap size={16} className="fill-current" /> Rapports Live
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-gradient-to-br ${stat.color} p-8 rounded-[2.5rem] shadow-xl shadow-indigo-100/50 flex flex-col gap-6 text-white relative overflow-hidden group`}
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="flex items-center justify-between relative z-10">
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">{stat.icon}</div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md">
                {stat.trend}
              </span>
            </div>
            <div className="relative z-10">
              <p className="text-white/70 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-black">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/70 backdrop-blur-md rounded-[3rem] border border-indigo-50 shadow-xl shadow-indigo-100/20 overflow-hidden"
        >
          <div className="p-10 pb-6 border-b border-indigo-50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600"><BarChart3 size={20} /></div>
              <h3 className="font-black text-indigo-950 uppercase tracking-tighter text-lg">Top Produits</h3>
            </div>
          </div>
          <div className="p-10 space-y-8">
            {topProducts.length > 0 ? topProducts.map((p, i) => (
              <div key={i} className="space-y-3">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-indigo-300">0{i + 1}</span>
                    <span className="font-bold text-indigo-900">{p.name}</span>
                  </div>
                  <span className="text-sm font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{p.count} ventes</span>
                </div>
                <div className="w-full bg-indigo-50 h-3 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(p.count / (topProducts[0]?.count || 1)) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full" 
                  ></motion.div>
                </div>
              </div>
            )) : <p className="text-center text-indigo-300 py-10 font-bold uppercase tracking-widest">Aucune donnée</p>}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/70 backdrop-blur-md rounded-[3rem] border border-indigo-50 shadow-xl shadow-indigo-100/20 overflow-hidden"
        >
          <div className="p-10 pb-6 border-b border-indigo-50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-100 rounded-xl text-violet-600"><Users size={20} /></div>
              <h3 className="font-black text-indigo-950 uppercase tracking-tighter text-lg">Performance Staff</h3>
            </div>
          </div>
          <div className="p-10">
            <div className="space-y-4">
              {salesByWaiter.length > 0 ? salesByWaiter.map((w, i) => (
                <div key={i} className="flex items-center gap-5 p-5 rounded-[2rem] bg-indigo-50/50 border border-transparent hover:border-indigo-100 hover:bg-white transition-all group">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-xl shadow-inner">
                    {w.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-indigo-950 leading-none mb-1">{w.name}</p>
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Actif aujourd'hui</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-indigo-600 text-lg">{formatCurrency(w.total, baseCurrency)}</p>
                    <div className="flex items-center justify-end gap-1">
                       <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                       <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{((w.total / (dailySales || 1)) * 100).toFixed(0)}% du CA</p>
                    </div>
                  </div>
                </div>
              )) : <p className="text-center text-indigo-300 py-10 font-bold uppercase tracking-widest">Aucune donnée</p>}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};