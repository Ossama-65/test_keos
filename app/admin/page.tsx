'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Package, 
  FileText, 
  Settings, 
  TrendingUp,
  ArrowRight,
  Image as ImageIcon,
  Phone,
  RefreshCw
} from 'lucide-react';

interface ContentData {
  products: { id: string; name: string; active: boolean }[];
  site: { name: string };
  hero: { title: string };
  advantages: { id: string }[];
}

export default function AdminDashboard() {
  const [content, setContent] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/content');
      const data = await res.json();
      setContent(data);
    } catch (error) {
      console.error('Error fetching content:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const stats = content ? [
    { 
      label: 'Produits actifs', 
      value: content.products?.filter(p => p.active).length || 0,
      icon: Package,
      color: 'from-emerald-500 to-emerald-600',
      href: '/admin/products'
    },
    { 
      label: 'Total produits', 
      value: content.products?.length || 0,
      icon: TrendingUp,
      color: 'from-blue-500 to-blue-600',
      href: '/admin/products'
    },
    { 
      label: 'Avantages', 
      value: content.advantages?.length || 0,
      icon: Settings,
      color: 'from-purple-500 to-purple-600',
      href: '/admin/hero'
    },
  ] : [];

  const quickLinks = [
    { href: '/admin/site', label: 'Modifier les infos du site', icon: Settings, desc: 'Nom, contact, réseaux sociaux' },
    { href: '/admin/hero', label: 'Modifier la page d\'accueil', icon: ImageIcon, desc: 'Hero, avantages, bestsellers' },
    { href: '/admin/products', label: 'Gérer les produits', icon: Package, desc: 'Ajouter, modifier, supprimer' },
    { href: '/admin/contact', label: 'Modifier la page contact', icon: Phone, desc: 'Coordonnées, horaires' },
    { href: '/admin/pages', label: 'Gérer les pages', icon: FileText, desc: 'Titres et descriptions' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Tableau de bord</h1>
          <p className="text-slate-400 mt-1">Bienvenue dans votre back-office</p>
        </div>
        <button
          onClick={fetchContent}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 hover:text-white hover:border-slate-600 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-slate-600 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {loading ? '...' : stat.value}
                </p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Links */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-start gap-4 p-4 bg-slate-900/50 border border-slate-700 rounded-xl hover:border-amber-500/50 hover:bg-slate-800/50 transition-all group"
            >
              <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <link.icon className="w-5 h-5 text-amber-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white group-hover:text-amber-500 transition-colors">
                  {link.label}
                </h3>
                <p className="text-sm text-slate-400 mt-0.5">{link.desc}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-amber-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Products */}
      {content?.products && content.products.length > 0 && (
        <div className="mt-8 bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Produits récents</h2>
            <Link 
              href="/admin/products"
              className="text-amber-500 hover:text-amber-400 text-sm font-medium flex items-center gap-1"
            >
              Voir tout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {content.products.slice(0, 6).map((product) => (
              <div key={product.id} className="bg-slate-900/50 rounded-xl p-3 border border-slate-700">
                <p className="text-white text-sm font-medium truncate">{product.name}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full mt-2 inline-block ${
                  product.active 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {product.active ? 'Actif' : 'Inactif'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

