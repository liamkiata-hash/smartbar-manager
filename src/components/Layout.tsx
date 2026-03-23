import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { 
  LayoutDashboard, 
  Table2, 
  Package, 
  Settings, 
  LogOut, 
  GlassWater,
  ClipboardList,
  History
} from 'lucide-react';
import { motion } from 'framer-motion';

export const Layout: React.FC = () => {
  const { currentUser, logout } = useData();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Tableau de bord', roles: ['boss'] },
    { to: '/tables', icon: <Table2 size={20} />, label: 'Tables', roles: ['boss', 'waiter'] },
    { to: '/products', icon: <Package size={20} />, label: 'Produits', roles: ['boss'] },
    { to: '/inventory', icon: <ClipboardList size={20} />, label: 'Stock', roles: ['boss'] },
    { to: '/history', icon: <History size={20} />, label: 'Historique', roles: ['boss'] },
    { to: '/settings', icon: <Settings size={20} />, label: 'Paramètres', roles: ['boss'] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(currentUser?.role || ''));

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-100/50">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white/70 backdrop-blur-md border-r border-indigo-100 shadow-xl shadow-indigo-100/20">
        <div className="p-8 border-b border-indigo-50">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-indigo-700"
          >
            <div className="bg-indigo-600 p-1.5 rounded-lg shadow-lg shadow-indigo-200">
              <GlassWater className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter italic">SMARTBAR</span>
          </motion.div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {filteredNavItems.map((item, idx) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={item.to}
            >
              <NavLink
                to={item.to}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                    isActive 
                    ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-200' 
                    : 'text-indigo-400 hover:bg-indigo-50 hover:text-indigo-900'
                  }`
                }
              >
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </NavLink>
            </motion.div>
          ))}
        </nav>

        <div className="p-4 border-t border-indigo-50 bg-indigo-50/30">
          <div className="flex items-center gap-3 px-4 py-3 mb-4 rounded-2xl bg-white/80 border border-indigo-100">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-xl flex items-center justify-center font-bold shadow-md">
              {currentUser?.name.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden text-left">
              <p className="text-sm font-bold text-indigo-900 truncate leading-none mb-1">{currentUser?.name}</p>
              <p className="text-[10px] text-indigo-500 font-black uppercase tracking-widest">{currentUser?.role === 'boss' ? 'Patron' : 'Serveur'}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-violet-600 hover:bg-violet-50 rounded-2xl transition-all font-bold"
          >
            <LogOut size={20} />
            <span className="text-sm">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-md border-b border-indigo-100 shadow-sm sticky top-0 z-20">
          <div className="flex items-center gap-2 text-indigo-700">
            <GlassWater className="w-6 h-6" />
            <span className="font-black tracking-tighter">SMARTBAR</span>
          </div>
          <button onClick={handleLogout} className="p-2 text-violet-600 bg-violet-50 rounded-lg">
            <LogOut size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Outlet />
          </motion.div>
        </div>

        {/* Mobile Nav */}
        <nav className="md:hidden bg-white/90 backdrop-blur-md border-t border-indigo-100 flex justify-around p-3 pb-6 sticky bottom-0 z-20">
           {filteredNavItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => 
                `flex flex-col items-center px-4 py-2 rounded-xl transition-all ${
                  isActive ? 'text-indigo-600 bg-indigo-50' : 'text-indigo-300'
                }`
              }
            >
              {item.icon}
              <span className="text-[10px] mt-1 font-bold uppercase tracking-tighter">{item.label.split(' ')[0]}</span>
            </NavLink>
          ))}
        </nav>
      </main>
    </div>
  );
};