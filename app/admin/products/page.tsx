'use client';

import { useState, useEffect } from 'react';
import { 
  Save, 
  Loader2, 
  CheckCircle, 
  Plus, 
  Trash2, 
  Edit2,
  X,
  Search,
  Package
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  category: 'tshirt' | 'jean';
  sizes: string[];
  image: string;
  color: string;
  active: boolean;
}

const defaultProduct: Omit<Product, 'id'> = {
  name: '',
  price: 0,
  category: 'tshirt',
  sizes: [],
  image: '',
  color: '',
  active: true
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'tshirt' | 'jean'>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>(defaultProduct);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/content/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'products', data: products })
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving:', error);
    }
    setSaving(false);
  };

  const handleAddProduct = async () => {
    try {
      const res = await fetch('/api/content/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      const data = await res.json();
      if (data.product) {
        setProducts([...products, data.product]);
        setNewProduct(defaultProduct);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    try {
      await fetch('/api/content/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct)
      });
      setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;
    try {
      await fetch(`/api/content/products?id=${id}`, { method: 'DELETE' });
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const toggleProductActive = (id: string) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, active: !p.active } : p
    ));
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || p.category === filter;
    return matchesSearch && matchesFilter;
  });

  const tshirtSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const jeanSizes = ['26', '28', '30', '32', '34', '36', '38', '40'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Produits</h1>
          <p className="text-slate-400 mt-1">{products.length} produits au total</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl hover:bg-emerald-500/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-500/25 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : saved ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {saved ? 'Sauvegardé !' : 'Sauvegarder'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
            />
          </div>
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'Tous' },
              { value: 'tshirt', label: 'T-Shirts' },
              { value: 'jean', label: 'Jeans' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value as typeof filter)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filter === option.value
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <div 
            key={product.id}
            className={`bg-slate-800/50 border rounded-2xl overflow-hidden transition-all ${
              product.active ? 'border-slate-700' : 'border-red-500/30 opacity-60'
            }`}
          >
            {/* Image */}
            <div className="aspect-square relative">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                  <Package className="w-12 h-12 text-slate-500" />
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-2">
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                  product.category === 'tshirt' 
                    ? 'bg-blue-500/80 text-white' 
                    : 'bg-purple-500/80 text-white'
                }`}>
                  {product.category === 'tshirt' ? 'T-Shirt' : 'Jean'}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="font-medium text-white truncate">{product.name}</h3>
              <div className="flex items-center justify-between mt-2">
                <span className="text-lg font-bold text-amber-500">{product.price.toFixed(2)}€</span>
                <span className="text-sm text-slate-400">{product.color}</span>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-3">
                {product.sizes.map(size => (
                  <span key={size} className="text-xs px-2 py-0.5 bg-slate-700 text-slate-300 rounded">
                    {size}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-slate-700">
                <button
                  onClick={() => toggleProductActive(product.id)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    product.active
                      ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                      : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                  }`}
                >
                  {product.active ? 'Actif' : 'Inactif'}
                </button>
                <button
                  onClick={() => setEditingProduct(product)}
                  className="p-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h2 className="text-xl font-semibold text-white">Ajouter un produit</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nom</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Prix (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Catégorie</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as 'tshirt' | 'jean', sizes: [] })}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="tshirt">T-Shirt</option>
                    <option value="jean">Jean</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Couleur</label>
                <input
                  type="text"
                  value={newProduct.color}
                  onChange={(e) => setNewProduct({ ...newProduct, color: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Tailles</label>
                <div className="flex flex-wrap gap-2">
                  {(newProduct.category === 'tshirt' ? tshirtSizes : jeanSizes).map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        const sizes = newProduct.sizes.includes(size)
                          ? newProduct.sizes.filter(s => s !== size)
                          : [...newProduct.sizes, size];
                        setNewProduct({ ...newProduct, sizes });
                      }}
                      className={`px-3 py-1 rounded-lg text-sm transition-all ${
                        newProduct.sizes.includes(size)
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">URL Image</label>
                <input
                  type="text"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-slate-700">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-all"
              >
                Annuler
              </button>
              <button
                onClick={handleAddProduct}
                className="flex-1 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-all"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h2 className="text-xl font-semibold text-white">Modifier le produit</h2>
              <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nom</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Prix (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Catégorie</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as 'tshirt' | 'jean' })}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="tshirt">T-Shirt</option>
                    <option value="jean">Jean</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Couleur</label>
                <input
                  type="text"
                  value={editingProduct.color}
                  onChange={(e) => setEditingProduct({ ...editingProduct, color: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Tailles</label>
                <div className="flex flex-wrap gap-2">
                  {(editingProduct.category === 'tshirt' ? tshirtSizes : jeanSizes).map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        const sizes = editingProduct.sizes.includes(size)
                          ? editingProduct.sizes.filter(s => s !== size)
                          : [...editingProduct.sizes, size];
                        setEditingProduct({ ...editingProduct, sizes });
                      }}
                      className={`px-3 py-1 rounded-lg text-sm transition-all ${
                        editingProduct.sizes.includes(size)
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">URL Image</label>
                <input
                  type="text"
                  value={editingProduct.image}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
                {editingProduct.image && (
                  <div className="mt-2 aspect-video rounded-lg overflow-hidden border border-slate-600">
                    <img src={editingProduct.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-slate-700">
              <button
                onClick={() => setEditingProduct(null)}
                className="flex-1 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-all"
              >
                Annuler
              </button>
              <button
                onClick={handleUpdateProduct}
                className="flex-1 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-all"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

