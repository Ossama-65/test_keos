'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, CheckCircle } from 'lucide-react';

interface SiteContent {
  name: string;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  whatsapp: string;
  copyright: string;
}

interface MetaContent {
  title: string;
  description: string;
  keywords: string;
}

export default function SiteSettingsPage() {
  const [site, setSite] = useState<SiteContent>({
    name: '',
    tagline: '',
    description: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    whatsapp: '',
    copyright: ''
  });
  const [meta, setMeta] = useState<MetaContent>({
    title: '',
    description: '',
    keywords: ''
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
      const data = await res.json();
      if (data.site) setSite(data.site);
      if (data.meta) setMeta(data.meta);
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
        body: JSON.stringify({ section: 'site', data: site })
      });
      await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'meta', data: meta })
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
          <h1 className="text-3xl font-bold text-white">Informations du site</h1>
          <p className="text-slate-400 mt-1">Modifiez les informations générales de votre site</p>
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

      {/* Site Info */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold text-white mb-6">Identité du site</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Nom du site
            </label>
            <input
              type="text"
              value={site.name}
              onChange={(e) => setSite({ ...site, name: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
              placeholder="URBANSTYLE"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Slogan / Accent
            </label>
            <input
              type="text"
              value={site.tagline}
              onChange={(e) => setSite({ ...site, tagline: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
              placeholder="STYLE"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description courte
            </label>
            <textarea
              value={site.description}
              onChange={(e) => setSite({ ...site, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all resize-none"
              placeholder="Votre destination mode pour des vêtements de qualité."
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Copyright
            </label>
            <input
              type="text"
              value={site.copyright}
              onChange={(e) => setSite({ ...site, copyright: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
              placeholder="© 2024 UrbanStyle. Tous droits réservés."
            />
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold text-white mb-6">Coordonnées</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={site.email}
              onChange={(e) => setSite({ ...site, email: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
              placeholder="contact@urbanstyle.fr"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Téléphone
            </label>
            <input
              type="text"
              value={site.phone}
              onChange={(e) => setSite({ ...site, phone: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
              placeholder="01 23 45 67 89"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              WhatsApp (numéro sans +)
            </label>
            <input
              type="text"
              value={site.whatsapp}
              onChange={(e) => setSite({ ...site, whatsapp: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
              placeholder="33123456789"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Ville
            </label>
            <input
              type="text"
              value={site.city}
              onChange={(e) => setSite({ ...site, city: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
              placeholder="75001 Paris, France"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Adresse
            </label>
            <input
              type="text"
              value={site.address}
              onChange={(e) => setSite({ ...site, address: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
              placeholder="123 Avenue de la Mode"
            />
          </div>
        </div>
      </div>

      {/* SEO */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">SEO & Métadonnées</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Titre de la page (balise title)
            </label>
            <input
              type="text"
              value={meta.title}
              onChange={(e) => setMeta({ ...meta, title: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
              placeholder="UrbanStyle | T-Shirts & Jeans Premium Homme"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description SEO
            </label>
            <textarea
              value={meta.description}
              onChange={(e) => setMeta({ ...meta, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all resize-none"
              placeholder="Découvrez notre collection de t-shirts et jeans..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Mots-clés (séparés par des virgules)
            </label>
            <input
              type="text"
              value={meta.keywords}
              onChange={(e) => setMeta({ ...meta, keywords: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
              placeholder="t-shirt homme, jean homme, vêtements homme..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

