'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, CheckCircle } from 'lucide-react';

interface ProductsPageContent {
  title: string;
  description: string;
}

interface ContentData {
  productsPage: ProductsPageContent;
  contact: {
    title: string;
    subtitle: string;
  };
}

export default function PagesSettingsPage() {
  const [productsPage, setProductsPage] = useState<ProductsPageContent>({
    title: '',
    description: ''
  });
  const [contactPage, setContactPage] = useState({
    title: '',
    subtitle: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/content');
      const data: ContentData = await res.json();
      if (data.productsPage) setProductsPage(data.productsPage);
      if (data.contact) {
        setContactPage({
          title: data.contact.title || '',
          subtitle: data.contact.subtitle || ''
        });
      }
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
        body: JSON.stringify({ section: 'productsPage', data: productsPage })
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving:', error);
    }
    setSaving(false);
  };

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
          <h1 className="text-3xl font-bold text-white">Gestion des Pages</h1>
          <p className="text-slate-400 mt-1">Modifiez les titres et descriptions des pages</p>
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

      {/* Products Page */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
            <span className="text-blue-400 font-bold">P</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Page Produits</h2>
            <p className="text-sm text-slate-400">/produits</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Titre de la page
            </label>
            <input
              type="text"
              value={productsPage.title}
              onChange={(e) => setProductsPage({ ...productsPage, title: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
              placeholder="Nos Produits"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <textarea
              value={productsPage.description}
              onChange={(e) => setProductsPage({ ...productsPage, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all resize-none"
              placeholder="Découvrez notre collection..."
            />
          </div>
        </div>
      </div>

      {/* Contact Page Preview */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center justify-center">
            <span className="text-green-400 font-bold">C</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Page Contact</h2>
            <p className="text-sm text-slate-400">/contact</p>
          </div>
        </div>
        <div className="bg-slate-900/50 border border-slate-600 rounded-xl p-4">
          <p className="text-slate-400 text-sm mb-2">Aperçu du contenu actuel :</p>
          <p className="text-white font-medium">{contactPage.title || 'Non défini'}</p>
          <p className="text-slate-400 mt-1">{contactPage.subtitle || 'Non défini'}</p>
          <p className="text-amber-500 text-sm mt-4">
            → Modifiez cette page dans la section &quot;Contact&quot;
          </p>
        </div>
      </div>

      {/* Home Page Preview */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center">
            <span className="text-purple-400 font-bold">H</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Page d&apos;Accueil</h2>
            <p className="text-sm text-slate-400">/</p>
          </div>
        </div>
        <div className="bg-slate-900/50 border border-slate-600 rounded-xl p-4">
          <p className="text-slate-400 text-sm mb-2">Cette page comprend plusieurs sections :</p>
          <ul className="text-white text-sm space-y-1 mt-2">
            <li>• Section Hero (bannière principale)</li>
            <li>• Section Avantages</li>
            <li>• Section Bestsellers</li>
            <li>• Footer</li>
          </ul>
          <p className="text-amber-500 text-sm mt-4">
            → Modifiez ces sections dans &quot;Hero & Accueil&quot;
          </p>
        </div>
      </div>
    </div>
  );
}

