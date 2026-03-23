import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Save, DollarSign, Globe, Shield, Bell, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { CurrencyCode, CurrencyRates } from '../types';
import { motion } from 'framer-motion';

export const SettingsPage: React.FC = () => {
  const { rates, updateRates, baseCurrency, setBaseCurrency } = useData();
  const [localRates, setLocalRates] = useState<CurrencyRates>(rates);

  const handleSaveRates = (e: React.FormEvent) => {
    e.preventDefault();
    updateRates(localRates);
    toast.success('Taux de change mis à jour avec succès');
  };

  const handleChangeRate = (code: keyof CurrencyRates, value: string) => {
    setLocalRates(prev => ({ ...prev, [code]: parseFloat(value) || 0 }));
  };

  return (
    <div className="space-y-10 pb-12">
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
          Configuration
        </div>
        <h1 className="text-4xl font-black text-indigo-950 tracking-tight leading-none flex items-center gap-4">
          <Settings className="text-indigo-600" size={36} strokeWidth={2.5} />
          Paramètres
        </h1>
        <p className="text-indigo-500 font-medium">Contrôle des taux monétaires et préférences système.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-md rounded-[3rem] border border-indigo-50 shadow-xl shadow-indigo-100/20 overflow-hidden"
        >
          <div className="p-10 border-b border-indigo-50 flex items-center gap-4 bg-indigo-50/20">
            <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600">
              <DollarSign size={24} />
            </div>
            <h3 className="font-black text-indigo-950 uppercase tracking-tighter text-lg">Gestion Devises</h3>
          </div>
          
          <div className="p-10">
            <form onSubmit={handleSaveRates} className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4 px-1">Monnaie Principale</label>
                <div className="grid grid-cols-3 gap-3">
                  {['USD', 'CDF', 'EUR'].map((cur) => (
                    <button
                      key={cur}
                      type="button"
                      onClick={() => setBaseCurrency(cur as CurrencyCode)}
                      className={`py-5 rounded-[1.5rem] border-2 font-black transition-all text-xs tracking-widest ${
                        baseCurrency === cur 
                        ? 'bg-gradient-to-br from-indigo-600 to-indigo-800 border-indigo-500 text-white shadow-xl shadow-indigo-200' 
                        : 'bg-white border-indigo-50 text-indigo-300 hover:border-indigo-200'
                      }`}
                    >
                      {cur}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4 px-1">Taux de change (Relatif à 1 USD)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-indigo-50/50 rounded-[2rem] border border-indigo-100/50">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-3">Franc Congolais (CDF)</span>
                    <input 
                      type="number" 
                      value={localRates.CDF}
                      onChange={(e) => handleChangeRate('CDF', e.target.value)}
                      className="w-full bg-white border border-indigo-100 px-5 py-4 rounded-2xl font-mono font-black text-indigo-700 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    />
                  </div>
                  <div className="p-6 bg-indigo-50/50 rounded-[2rem] border border-indigo-100/50">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-3">Euro (EUR)</span>
                    <input 
                      type="number" 
                      step="0.01"
                      value={localRates.EUR}
                      onChange={(e) => handleChangeRate('EUR', e.target.value)}
                      className="w-full bg-white border border-indigo-100 px-5 py-4 rounded-2xl font-mono font-black text-indigo-700 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-indigo-950 text-white py-6 rounded-[2rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:bg-slate-900 shadow-2xl shadow-indigo-100"
              >
                <Save size={22} className="mb-0.5" /> Enregistrer les taux
              </button>
            </form>
          </div>
        </motion.section>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-10 rounded-[3rem] text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
             <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
             <div className="relative z-10">
              <Shield className="mb-6 opacity-60" size={32} />
              <h4 className="text-2xl font-black mb-2">Sécurité & Rôles</h4>
              <p className="text-indigo-100/80 font-medium mb-6 text-sm leading-relaxed">
                Le système de rôles limite l'accès aux données sensibles. Seuls les comptes 'Patron' peuvent modifier les stocks et voir l'historique complet.
              </p>
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] bg-white/20 backdrop-blur-md px-5 py-3 rounded-2xl w-fit border border-white/10">
                Protégé par cryptage local
              </div>
             </div>
          </div>

          <div className="bg-white/70 backdrop-blur-md p-10 rounded-[3rem] border border-indigo-50 shadow-xl shadow-indigo-100/10">
             <Bell className="mb-6 text-indigo-600 opacity-60" size={32} />
             <h4 className="text-xl font-black text-indigo-950 mb-2">Notifications</h4>
             <p className="text-indigo-500/80 font-medium text-sm leading-relaxed">
               Les alertes de stock faible sont configurées par produit. Assurez-vous de définir un seuil cohérent pour chaque article.
             </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};