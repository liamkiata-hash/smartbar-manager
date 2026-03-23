import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { OrderModal } from '../components/OrderModal';
import { Table, TableStatus } from '../types';
import { Users, CreditCard, CircleDashed, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const TablesPage: React.FC = () => {
  const { tables } = useData();
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case 'free': return 'bg-white/40 border-indigo-100 text-indigo-300 hover:bg-white hover:border-indigo-400 hover:shadow-2xl hover:shadow-indigo-100/50 group-hover:-translate-y-1';
      case 'occupied': return 'bg-gradient-to-br from-indigo-600 to-indigo-800 border-indigo-500 text-white shadow-xl shadow-indigo-200 hover:shadow-2xl hover:brightness-110 group-hover:-translate-y-1';
      case 'paying': return 'bg-gradient-to-br from-violet-500 to-purple-700 border-violet-400 text-white shadow-xl shadow-violet-200 hover:shadow-2xl hover:brightness-110 group-hover:-translate-y-1';
      default: return 'bg-white text-slate-400';
    }
  };

  const getStatusIcon = (status: TableStatus) => {
    switch (status) {
      case 'free': return <CircleDashed size={28} strokeWidth={1.5} />;
      case 'occupied': return <Users size={28} />;
      case 'paying': return <CreditCard size={28} />;
    }
  };

  const getStatusLabel = (status: TableStatus) => {
    switch (status) {
      case 'free': return 'Libre';
      case 'occupied': return 'Occupée';
      case 'paying': return 'En attente';
    }
  };

  return (
    <div className="space-y-10 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
            Plan de salle
          </div>
          <h1 className="text-4xl font-black text-indigo-950 tracking-tight leading-none">Gestion des Tables</h1>
          <p className="text-indigo-500 font-medium max-w-lg">Sélectionnez une table pour ouvrir une commande ou encaisser une note en attente.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 bg-white/40 backdrop-blur-md p-2 rounded-[2rem] border border-indigo-100 shadow-sm">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-white shadow-sm">
            <div className="w-2 h-2 rounded-full bg-indigo-200"></div> Libre
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-indigo-700 bg-indigo-50">
             <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></div> Occupée
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-violet-700 bg-violet-50">
             <div className="w-2 h-2 rounded-full bg-violet-500"></div> En attente
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
        {tables.map((table, index) => (
          <motion.div
            key={table.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03 }}
            className="group"
          >
            <button
              onClick={() => setSelectedTable(table)}
              className={`w-full aspect-[4/5] rounded-[2.5rem] border-2 flex flex-col items-center justify-between p-8 transition-all duration-500 ${getStatusColor(table.status)}`}
            >
              <div className={`p-5 rounded-[1.5rem] transition-all duration-500 ${table.status === 'free' ? 'bg-indigo-50/50 group-hover:bg-indigo-600 group-hover:text-white' : 'bg-white/20'}`}>
                {getStatusIcon(table.status)}
              </div>
              
              <div className="text-center">
                <span className={`text-4xl font-black block leading-none mb-2 ${table.status === 'free' ? 'text-indigo-900 group-hover:text-indigo-600' : 'text-white'}`}>T{table.id}</span>
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] block opacity-70`}>
                  {getStatusLabel(table.status)}
                </span>
              </div>

              {table.status !== 'free' && (
                <div className="mt-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                   ACTIF
                </div>
              )}
            </button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedTable && (
          <OrderModal 
            table={selectedTable} 
            onClose={() => setSelectedTable(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};