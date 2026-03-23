import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { formatCurrency } from '../lib/utils';
import { 
  Search, 
  Calendar, 
  User, 
  Table as TableIcon, 
  History,
  Download,
  Filter,
  ArrowUpDown,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const HistoryPage: React.FC = () => {
  const { orders, products, baseCurrency } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterWaiter, setFilterWaiter] = useState('All');

  // Flatten orders into individual sold items
  const historyItems = useMemo(() => {
    const completedOrders = orders.filter(o => o.status === 'completed');
    
    const flattened = completedOrders.flatMap(order => 
      order.items.map(item => {
        const product = products.find(p => p.id === item.productId);
        return {
          orderId: order.id,
          timestamp: order.completedAt || order.timestamp,
          productId: item.productId,
          productName: product?.name || 'Produit supprimé',
          category: product?.category || 'N/A',
          quantity: item.quantity,
          priceAtOrder: item.priceAtOrder,
          total: item.priceAtOrder * item.quantity,
          waiterName: order.waiterName,
          tableId: order.tableId,
          currency: order.currency
        };
      })
    );

    // Sort by timestamp descending
    return flattened.sort((a, b) => b.timestamp - a.timestamp);
  }, [orders, products]);

  const waiters = ['All', ...new Set(orders.map(o => o.waiterName))];

  const filteredItems = historyItems.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.waiterName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWaiter = filterWaiter === 'All' || item.waiterName === filterWaiter;
    return matchesSearch && matchesWaiter;
  });

  const totalSales = filteredItems.reduce((sum, item) => sum + item.total, 0);

  const formatDate = (ts: number) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(ts);
  };

  return (
    <div className="space-y-10 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
            Archives
          </div>
          <h1 className="text-4xl font-black text-indigo-950 tracking-tight leading-none flex items-center gap-4">
            <History className="text-indigo-600" size={36} strokeWidth={2.5} />
            Historique Ventes
          </h1>
          <p className="text-indigo-500 font-medium">Analyse détaillée de chaque transaction effectuée.</p>
        </div>
        
        <div className="bg-white/40 backdrop-blur-md p-4 rounded-[2rem] border border-indigo-100 shadow-xl shadow-indigo-100/20 flex items-center gap-6">
          <div className="space-y-0.5">
            <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Volume Total Sélection</p>
            <p className="text-3xl font-black text-indigo-700">{formatCurrency(totalSales, baseCurrency)}</p>
          </div>
          <button className="w-14 h-14 bg-indigo-600 text-white hover:bg-indigo-700 rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-indigo-200">
            <Download size={24} />
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-5 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Chercher un article ou un serveur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-white border border-indigo-50 rounded-[2rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-300 outline-none transition-all shadow-xl shadow-indigo-100/10 text-indigo-900 font-medium placeholder:text-indigo-200"
          />
        </div>
        
        <div className="md:col-span-4 relative group">
          <User className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
          <select
            value={filterWaiter}
            onChange={(e) => setFilterWaiter(e.target.value)}
            className="w-full pl-14 pr-10 py-5 bg-white border border-indigo-50 rounded-[2rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-300 outline-none transition-all shadow-xl shadow-indigo-100/10 appearance-none cursor-pointer text-indigo-900 font-bold uppercase text-xs tracking-widest"
          >
            {waiters.map(w => (
              <option key={w} value={w}>{w === 'All' ? 'Tous les serveurs' : w}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3 flex items-center justify-center gap-3 bg-indigo-50/50 px-6 py-5 border border-indigo-100/50 rounded-[2rem] text-indigo-600 font-black uppercase text-[10px] tracking-widest shadow-inner">
          <Filter size={16} />
          <span>{filteredItems.length} transactions</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/70 backdrop-blur-md border border-indigo-50 rounded-[3rem] overflow-hidden shadow-2xl shadow-indigo-100/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-indigo-50/30 border-b border-indigo-50">
              <tr>
                <th className="px-10 py-6 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    Horodatage <ArrowUpDown size={14} />
                  </div>
                </th>
                <th className="px-10 py-6 text-[10px] font-black text-indigo-400 uppercase tracking-widest">Détails Article</th>
                <th className="px-10 py-6 text-[10px] font-black text-indigo-400 uppercase tracking-widest">Staff</th>
                <th className="px-10 py-6 text-[10px] font-black text-indigo-400 uppercase tracking-widest text-center">Table</th>
                <th className="px-10 py-6 text-[10px] font-black text-indigo-400 uppercase tracking-widest text-center">Qté</th>
                <th className="px-10 py-6 text-[10px] font-black text-indigo-400 uppercase tracking-widest text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-50">
              <AnimatePresence mode="popLayout">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, idx) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={`${item.orderId}-${item.productId}-${idx}`} 
                      className="hover:bg-indigo-50/50 transition-colors group"
                    >
                      <td className="px-10 py-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-bold text-indigo-900">{formatDate(item.timestamp).split(' ')[0]}</span>
                          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter">{formatDate(item.timestamp).split(' ')[2]}</span>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                             <FileText size={18} />
                           </div>
                           <div>
                            <p className="text-sm font-black text-indigo-950">{item.productName}</p>
                            <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">{item.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-indigo-50 rounded-full w-fit shadow-sm">
                          <div className="w-5 h-5 bg-gradient-to-br from-indigo-500 to-violet-500 text-white rounded-full flex items-center justify-center text-[8px] font-black">
                            {item.waiterName.charAt(0)}
                          </div>
                          <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">{item.waiterName}</span>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-center">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 text-xs font-black shadow-inner">
                          T{item.tableId}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-center">
                        <span className="text-sm font-black text-indigo-950 px-3 py-1 bg-indigo-50/50 rounded-lg">x{item.quantity}</span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-black text-indigo-700 font-mono">
                            {formatCurrency(item.total, item.currency)}
                          </span>
                          <span className="text-[9px] font-bold text-indigo-300 uppercase">{formatCurrency(item.priceAtOrder, item.currency)} / u</span>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-10 py-24 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-200 animate-pulse">
                          <History size={48} />
                        </div>
                        <p className="text-indigo-300 font-black uppercase tracking-[0.2em] text-sm">Aucune transaction trouvée</p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};