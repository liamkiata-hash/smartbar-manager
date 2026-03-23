import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Role } from '../types';
import { LogIn, UserPlus, GlassWater } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('waiter');
  const { setCurrentUser } = useData();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      const users = JSON.parse(localStorage.getItem('smartbar_all_users') || '[]');
      const user = users.find((u: any) => u.email === email && u.password === password);
      
      if (user) {
        setCurrentUser(user);
        toast.success(`Bienvenue, ${user.name} !`);
      } else {
        toast.error('Email ou mot de passe incorrect');
      }
    } else {
      const users = JSON.parse(localStorage.getItem('smartbar_all_users') || '[]');
      if (users.find((u: any) => u.email === email)) {
        toast.error('Cet email est déjà utilisé');
        return;
      }
      
      const newUser = { id: Math.random().toString(36).substr(2, 9), name, email, password, role };
      localStorage.setItem('smartbar_all_users', JSON.stringify([...users, newUser]));
      setCurrentUser(newUser);
      toast.success('Compte créé avec succès !');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Dynamic Gradient Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/60 via-slate-950/80 to-violet-900/60 z-10"></div>
      
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 opacity-60 blur-[2px] scale-105"
        style={{ 
          backgroundImage: 'url("https://storage.googleapis.com/dala-prod-public-storage/generated-images/649a81c5-8cfb-4a7c-943e-18b63298bb25/lounge-bar-aesthetic-93016f78-1774034886635.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      ></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden relative z-20"
      >
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-10 text-white text-center relative">
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
             <GlassWater className="w-6 h-6 text-indigo-600" />
          </div>
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl font-black tracking-tighter italic">SMARTBAR</h1>
            <p className="opacity-80 mt-2 text-xs uppercase tracking-[0.3em] font-black">Professional Lounge Manager</p>
          </motion.div>
        </div>
        
        <div className="p-10 pt-12">
          <div className="flex mb-10 bg-white/5 p-1.5 rounded-2xl border border-white/10">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isLogin ? 'bg-white text-indigo-700 shadow-xl' : 'text-indigo-200 hover:text-white'}`}
            >
              Connexion
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${!isLogin ? 'bg-white text-indigo-700 shadow-xl' : 'text-indigo-200 hover:text-white'}`}
            >
              Inscription
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-2 px-1">Nom Complet</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-indigo-300/30 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                    placeholder="Jean Dupont"
                    required={!isLogin}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            <div>
              <label className="block text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-2 px-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-indigo-300/30 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                placeholder="nom@exemple.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-2 px-1">Mot de passe</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-indigo-300/30 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-2 px-1">Rôle</label>
                  <select 
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="waiter" className="text-slate-900">Serveur</option>
                    <option value="boss" className="text-slate-900">Patron</option>
                  </select>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black uppercase tracking-widest py-5 rounded-2xl transition-all flex items-center justify-center gap-3 mt-8 shadow-2xl shadow-indigo-600/30 border border-white/10"
            >
              {isLogin ? <><LogIn size={20} className="mb-0.5" /> Connexion</> : <><UserPlus size={20} className="mb-0.5" /> Inscription</>}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};