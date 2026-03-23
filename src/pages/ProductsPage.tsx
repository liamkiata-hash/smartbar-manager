import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Plus, Search, Trash2, Edit2, Filter, X, Package } from 'lucide-react';
import { Product } from '../types';
import { formatCurrency } from '../lib/utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export const ProductsPage: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, baseCurrency } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: 'Boisson',
    price: 0,
    stock: 0,
    minStockAlert: 10
  });

  const categories = ['Boisson', 'Soda', 'Bière', 'Vin', 'Cocktail', 'Plat', 'Snack', 'Autre'];

  const handleOpenModal = (p?: Product) => {
    if (p) {
      setEditingProduct(p);
      setFormData(p);
    } else {
      setEditingProduct(null);
      setFormData({ name: '', category: 'Boisson', price: 0, stock: 0, minStockAlert: 5 });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(formData as Product);
      toast.success('Produit mis à jour');
    } else {
      addProduct({ ...formData, id: Math.random().toString(36).substr(2, 9) } as Product);
      toast.success('Produit ajouté');
    }
    setIsModalOpen(false);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
            Catalogue
          </div>
          <h1 className="text-4xl font-black text-indigo-950 tracking-tight leading-none flex items-center gap-4">
            <Package className="text-indigo-600" size={36} strokeWidth={2.5} />
            Gestion Produits
          </h1>
          <p className="text-indigo-500 font-medium">Mise à jour des prix, catégories et stocks initiaux.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleOpenModal()}
          className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-8 py-5 rounded-[2rem] font-black uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-indigo-100 transition-all text-xs border border-white/20"
        >
          <Plus size={20} className="mb-0.5" /> Nouveau Produit
        </motion.button>
      </header>

      <div className="bg-white/70 backdrop-blur-md rounded-[3rem] border border-indigo-50 shadow-xl shadow-indigo-100/20 overflow-hidden">
        <div className="p-8 md:p-10 border-b border-indigo-50 flex flex-col md:flex-row gap-6 items-center bg-indigo-50/20">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Chercher dans le catalogue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-white border border-indigo-50 rounded-[2rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-300 outline-none transition-all shadow-xl shadow-indigo-100/5 text-indigo-900 font-medium placeholder:text-indigo-200"
            />
          </div>
          <button className="px-8 py-5 bg-white border border-indigo-100 rounded-[2rem] flex items-center gap-3 text-indigo-600 font-black uppercase tracking-widest text-[10px] hover:bg-indigo-50 transition-all shadow-sm">
            <Filter size={18} /> Filtres
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-indigo-50/30 border-b border-indigo-50">
              <tr>
                <th className="px-10 py-6 text-[10px] font-black text-indigo-400 uppercase tracking-widest">Article & Catégorie</th>
                <th className="px-10 py-6 text-[10px] font-black text-indigo-400 uppercase tracking-widest">Prix Unitaire</th>
                <th className="px-10 py-6 text-[10px] font-black text-indigo-400 uppercase tracking-widest">Niveau Stock</th>
                <th className="px-10 py-6 text-[10px] font-black text-indigo-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-50">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map(product => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={product.id} 
                    className="hover:bg-indigo-50/50 transition-all group"
                  >
                    <td className="px-10 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-indigo-950">{product.name}</span>
                        <span className="text-[9px] font-black text-indigo-400 bg-indigo-50/80 w-fit px-3 py-1 rounded-full mt-1.5 uppercase tracking-widest border border-indigo-100">{product.category}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className="font-mono font-black text-indigo-700 bg-indigo-50/50 px-3 py-1.5 rounded-xl">{formatCurrency(product.price, baseCurrency)}</span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 min-w-[80px] bg-indigo-100/50 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${product.stock <= product.minStockAlert ? 'bg-orange-500' : 'bg-indigo-500'}`}
                            style={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className={`text-xs font-black min-w-[30px] ${product.stock <= product.minStockAlert ? 'text-orange-600' : 'text-indigo-950'}`}>
                          {product.stock}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => handleOpenModal(product)} 
                          className="p-3 bg-white border border-indigo-50 text-indigo-400 hover:text-indigo-600 hover:border-indigo-200 rounded-2xl shadow-sm transition-all"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => deleteProduct(product.id)}
                          className="p-3 bg-white border border-indigo-50 text-indigo-300 hover:text-red-600 hover:border-red-100 rounded-2xl shadow-sm transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-indigo-950/40 backdrop-blur-xl flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden border border-indigo-100"
            >
               <div className="p-10 border-b border-indigo-50 bg-indigo-50/20 flex justify-between items-center">
                <h2 className="text-2xl font-black text-indigo-950 uppercase tracking-tighter">{editingProduct ? 'Modifier Produit' : 'Ajouter Produit'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white border border-indigo-50 rounded-2xl text-indigo-300 hover:text-indigo-600 transition-colors shadow-sm">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-10 space-y-6">
                 <div>
                    <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 px-1">Désignation</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.name} 
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                      className="w-full px-5 py-4 bg-indigo-50/30 border border-indigo-50 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-300 outline-none transition-all font-medium text-indigo-950"
                      placeholder="Ex: Heineken 33cl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 px-1">Catégorie</label>
                      <select 
                        value={formData.category} 
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })} 
                        className="w-full px-5 py-4 bg-indigo-50/30 border border-indigo-50 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-300 outline-none transition-all font-bold text-indigo-950 appearance-none cursor-pointer"
                      >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 px-1">Prix</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        required 
                        value={formData.price} 
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} 
                        className="w-full px-5 py-4 bg-indigo-50/30 border border-indigo-50 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-300 outline-none transition-all font-mono font-black text-indigo-700"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 px-1">Stock Initial</label>
                      <input 
                        type="number" 
                        required 
                        value={formData.stock} 
                        onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })} 
                        className="w-full px-5 py-4 bg-indigo-50/30 border border-indigo-50 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-300 outline-none transition-all font-bold text-indigo-950"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 px-1">Seuil Alerte</label>
                      <input 
                        type="number" 
                        required 
                        value={formData.minStockAlert} 
                        onChange={(e) => setFormData({ ...formData, minStockAlert: parseInt(e.target.value) })} 
                        className="w-full px-5 py-4 bg-indigo-50/30 border border-indigo-50 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-300 outline-none transition-all font-bold text-indigo-950"
                      />
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest mt-4 shadow-xl shadow-indigo-100 hover:brightness-110 transition-all text-xs border border-white/20"
                  >
                    {editingProduct ? 'Mettre à jour' : 'Enregistrer le produit'}
                  </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};