'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, CheckCircle, Plus, Trash2, GripVertical } from 'lucide-react';

interface HeroContent {
  badge: string;
  title: string;
  titleAccent: string;
  description: string;
  ctaText: string;
  ctaSecondary: string;
  backgroundImage: string;
}

interface Advantage {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface Bestsellers {
  title: string;
  description: string;
  products: string[];
}

interface Product {
  id: string;
  name: string;
}

export default function HeroPage() {
  const [hero, setHero] = useState<HeroContent>({
    badge: '',
    title: '',
    titleAccent: '',
    description: '',
    ctaText: '',
    ctaSecondary: '',
    backgroundImage: ''
  });
  const [advantages, setAdvantages] = useState<Advantage[]>([]);
  const [bestsellers, setBestsellers] = useState<Bestsellers>({
    title: '',
    description: '',
    products: []
  });
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/content');
      const data = await res.json();
      if (data.hero) setHero(data.hero);
      if (data.advantages) setAdvantages(data.advantages);
      if (data.bestsellers) setBestsellers(data.bestsellers);
      if (data.products) setAllProducts(data.products);
    } catch (error) {
      console.error('Error fetching content:', error);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'hero', data: hero })
      });
      await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'advantages', data: advantages })
      });
      await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'bestsellers', data: bestsellers })
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving:', error);
    }
    setSaving(false);
  };

  const addAdvantage = () => {
    setAdvantages([...advantages, {
      id: String(Date.now()),
      icon: 'Star',
      title: 'Nouvel avantage',
      description: 'Description de l\'avantage'
    }]);
  };

  const removeAdvantage = (id: string) => {
    setAdvantages(advantages.filter(a => a.id !== id));
  };

  const updateAdvantage = (id: string, field: keyof Advantage, value: string) => {
    setAdvantages(advantages.map(a => 
      a.id === id ? { ...a, [field]: value } : a
    ));
  };

  const toggleBestseller = (productId: string) => {
    if (bestsellers.products.includes(productId)) {
      setBestsellers({
        ...bestsellers,
        products: bestsellers.products.filter(id => id !== productId)
      });
    } else {
      setBestsellers({
        ...bestsellers,
        products: [...bestsellers.products, productId]
      });
    }
  };

  const icons = ['Truck', 'Shield', 'RefreshCw', 'Star', 'Heart', 'Award', 'Clock', 'Gift', 'Zap', 'Check'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Hero & Page d&apos;accueil</h1>
          <p className="text-slate-400 mt-1">Personnalisez votre page d&apos;accueil</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-500/25 disabled:opacity-50"
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

      {/* Hero Section */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold text-white mb-6">Section Hero</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Badge (ex: Nouvelle Collection 2024)
            </label>
            <input
              type="text"
              value={hero.badge}
              onChange={(e) => setHero({ ...hero, badge: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Titre principal
            </label>
            <input
              type="text"
              value={hero.title}
              onChange={(e) => setHero({ ...hero, title: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Titre accent (coloré)
            </label>
            <input
              type="text"
              value={hero.titleAccent}
              onChange={(e) => setHero({ ...hero, titleAccent: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Bouton principal
            </label>
            <input
              type="text"
              value={hero.ctaText}
              onChange={(e) => setHero({ ...hero, ctaText: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Bouton secondaire
            </label>
            <input
              type="text"
              value={hero.ctaSecondary}
              onChange={(e) => setHero({ ...hero, ctaSecondary: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <textarea
              value={hero.description}
              onChange={(e) => setHero({ ...hero, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all resize-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              URL de l&apos;image de fond
            </label>
            <input
              type="text"
              value={hero.backgroundImage}
              onChange={(e) => setHero({ ...hero, backgroundImage: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
            />
            {hero.backgroundImage && (
              <div className="mt-4 aspect-video rounded-xl overflow-hidden border border-slate-600">
                <img 
                  src={hero.backgroundImage} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Advantages */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Avantages</h2>
          <button
            onClick={addAdvantage}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl hover:bg-emerald-500/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </button>
        </div>
        <div className="space-y-4">
          {advantages.map((advantage) => (
            <div key={advantage.id} className="bg-slate-900/50 border border-slate-600 rounded-xl p-4">
              <div className="flex items-start gap-4">
                <GripVertical className="w-5 h-5 text-slate-600 mt-3 cursor-grab" />
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Icône</label>
                    <select
                      value={advantage.icon}
                      onChange={(e) => updateAdvantage(advantage.id, 'icon', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500"
                    >
                      {icons.map(icon => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Titre</label>
                    <input
                      type="text"
                      value={advantage.title}
                      onChange={(e) => updateAdvantage(advantage.id, 'title', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Description</label>
                    <input
                      type="text"
                      value={advantage.description}
                      onChange={(e) => updateAdvantage(advantage.id, 'description', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
                <button
                  onClick={() => removeAdvantage(advantage.id)}
                  className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bestsellers */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Section Bestsellers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Titre de la section
            </label>
            <input
              type="text"
              value={bestsellers.title}
              onChange={(e) => setBestsellers({ ...bestsellers, title: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <input
              type="text"
              value={bestsellers.description}
              onChange={(e) => setBestsellers({ ...bestsellers, description: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Produits à afficher ({bestsellers.products.length} sélectionnés)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {allProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => toggleBestseller(product.id)}
                className={`p-3 text-left rounded-xl border transition-all ${
                  bestsellers.products.includes(product.id)
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                    : 'bg-slate-900/50 border-slate-600 text-slate-400 hover:border-slate-500'
                }`}
              >
                <p className="text-sm font-medium truncate">{product.name}</p>
                <p className="text-xs mt-1 opacity-60">ID: {product.id}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

