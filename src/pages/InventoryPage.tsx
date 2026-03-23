import React from 'react';
import { useData } from '../context/DataContext';
import { Package, AlertTriangle, CheckCircle2, ShoppingCart, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const InventoryPage: React.FC = () => {
  const { products } = useData();

  const lowStockProducts = products.filter(p => p.stock <= p.minStockAlert && p.stock > 0);
  const outOfStockProducts = products.filter(p => p.stock === 0);
  const healthyProducts = products.filter(p => p.stock > p.minStockAlert);

  const stats = [
    { label: 'Alertes Critiques', count: lowStockProducts.length, icon: <AlertTriangle size={28} />, color: 'from-orange-500 to-orange-600', shadow: 'shadow-orange-200' },
    { label: 'Rupture Stock', count: outOfStockProducts.length, icon: <ShoppingCart size={28} />, color: 'from-red-500 to-red-600', shadow: 'shadow-red-200' },
    { label: 'Stocks Sains', count: healthyProducts.length, icon: <CheckCircle2 size={28} />, color: 'from-emerald-500 to-emerald-600', shadow: 'shadow-emerald-200' },
  ];

  return (
    <div className="space-y-10 pb-12">
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
          Logistique
        </div>
        <h1 className="text-4xl font-black text-indigo-950 tracking-tight leading-none flex items-center gap-4">
          <Package className="text-indigo-600" size={36} strokeWidth={2.5} />
          Inventaire Stock
        </h1>
        <p className="text-indigo-500 font-medium">Surveillance en temps réel des flux de boissons et articles.</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-gradient-to-br ${stat.color} p-8 rounded-[2.5rem] ${stat.shadow} shadow-xl text-white flex items-center justify-between group overflow-hidden relative`}
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10">
              <p className="text-white/70 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-4xl font-black">{stat.count}</p>
            </div>
            <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl relative z-10">
              {stat.icon}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Critical Alerts */}
        <div className="lg:col-span-5 bg-white/70 backdrop-blur-md rounded-[3rem] border border-indigo-50 shadow-xl shadow-indigo-100/20 overflow-hidden">
          <div className="p-10 pb-6 border-b border-indigo-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-xl text-orange-600"><AlertTriangle size={20} /></div>
              <h3 className="font-black text-indigo-950 uppercase tracking-tighter text-lg">Priorités</h3>
            </div>
            <span className="bg-red-500 text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest animate-pulse">Urgent</span>
          </div>
          <div className="p-10 space-y-4">
            {[...outOfStockProducts, ...lowStockProducts].length > 0 ? [...outOfStockProducts, ...lowStockProducts].map(p => (
              <motion.div 
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                key={p.id} 
                className={`flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all ${p.stock === 0 ? 'bg-red-50/50 border-red-100 shadow-sm' : 'bg-orange-50/50 border-orange-100'}`}
              >
                <div className="flex flex-col">
                  <span className="font-black text-indigo-950">{p.name}</span>
                  <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mt-0.5">{p.category}</span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className={`text-2xl font-black ${p.stock === 0 ? 'text-red-600' : 'text-orange-600'}`}>{p.stock}</span>
                    <span className="text-indigo-300 text-[9px] font-black block uppercase">Seuil: {p.minStockAlert}</span>
                  </div>
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-300 hover:text-indigo-600 transition-colors shadow-sm cursor-pointer">
                    <ArrowRight size={18} />
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="py-10 text-center space-y-4">
                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto text-indigo-200">
                  <CheckCircle2 size={32} />
                </div>
                <p className="text-indigo-300 font-black uppercase tracking-widest text-xs">Tout est sous contrôle</p>
              </div>
            )}
          </div>
        </div>

        {/* Global State */}
        <div className="lg:col-span-7 bg-white/70 backdrop-blur-md rounded-[3rem] border border-indigo-50 shadow-xl shadow-indigo-100/20 overflow-hidden">
          <div className="p-10 pb-6 border-b border-indigo-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600"><Package size={20} /></div>
              <h3 className="font-black text-indigo-950 uppercase tracking-tighter text-lg">État Global du Stock</h3>
            </div>
          </div>
          <div className="p-10 space-y-10 max-h-[600px] overflow-y-auto no-scrollbar">
            {products.map((p, i) => (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                key={p.id} 
                className="space-y-4 group"
              >
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <span className="text-sm font-black text-indigo-950 block leading-none">{p.name}</span>
                    <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Catégorie {p.category}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-indigo-600">{p.stock}</span>
                    <span className="text-indigo-300 text-[10px] font-black ml-1.5 uppercase">unités</span>
                  </div>
                </div>
                <div className="w-full bg-indigo-50 h-3 rounded-full overflow-hidden shadow-inner p-0.5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((p.stock / 100) * 100, 100)}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full rounded-full transition-colors duration-500 ${
                      p.stock === 0 ? 'bg-red-500' : 
                      p.stock <= p.minStockAlert ? 'bg-orange-500' : 
                      'bg-gradient-to-r from-indigo-500 to-violet-500'
                    }`}
                  ></motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};