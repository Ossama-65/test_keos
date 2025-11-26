'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Filter, X, Loader2 } from 'lucide-react';
import WhatsAppChatbot from '../components/WhatsAppChatbot';

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

interface ContentData {
  products: Product[];
  productsPage: {
    title: string;
    description: string;
  };
  site: {
    name: string;
    tagline: string;
    copyright: string;
  };
}

export default function ProductsPage() {
  const [content, setContent] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'tshirt' | 'jean'>('all');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/content');
      const data = await res.json();
      setContent(data);
    } catch (error) {
      console.error('Error fetching content:', error);
    }
    setLoading(false);
  };

  if (loading || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[var(--accent)] animate-spin" />
      </div>
    );
  }

  const { products, productsPage, site } = content;
  const activeProducts = products.filter(p => p.active);
  const filteredProducts = filter === 'all' 
    ? activeProducts 
    : activeProducts.filter(p => p.category === filter);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link href="/" className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              {site.name.replace(site.tagline, '')}<span className="text-[var(--accent)]">{site.tagline}</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm font-medium hover:text-[var(--accent)] transition-colors">Accueil</Link>
              <Link href="/produits" className="text-sm font-medium text-[var(--accent)]">Produits</Link>
              <Link href="/contact" className="text-sm font-medium hover:text-[var(--accent)] transition-colors">Contact</Link>
            </div>
            <button className="flex items-center gap-2 bg-[var(--primary)] text-white px-4 sm:px-6 py-2 sm:py-3 text-sm font-medium hover:bg-[var(--primary-light)] transition-colors">
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Panier</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-32 pb-12 bg-[var(--muted)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            {productsPage.title}
          </h1>
          <p className="text-[var(--muted-foreground)] text-lg max-w-2xl">
            {productsPage.description}
          </p>
        </div>
      </section>

      {/* Filters & Products */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--muted-foreground)]">
                {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
              </span>
            </div>
            
            {/* Desktop Filters */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm font-medium mr-2">Filtrer :</span>
              {[
                { value: 'all', label: 'Tous' },
                { value: 'tshirt', label: 'T-Shirts' },
                { value: 'jean', label: 'Jeans' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value as typeof filter)}
                  className={`px-4 py-2 text-sm font-medium transition-all ${
                    filter === option.value
                      ? 'bg-[var(--primary)] text-white'
                      : 'bg-white border border-[var(--border)] hover:border-[var(--primary)]'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Mobile Filter Button */}
            <button 
              onClick={() => setMobileFilterOpen(true)}
              className="sm:hidden flex items-center gap-2 px-4 py-2 border border-[var(--border)]"
            >
              <Filter className="w-4 h-4" />
              Filtrer
            </button>
          </div>

          {/* Mobile Filter Modal */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 bg-black/50 sm:hidden" onClick={() => setMobileFilterOpen(false)}>
              <div className="absolute bottom-0 left-0 right-0 bg-white p-6 rounded-t-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg">Filtrer par catégorie</h3>
                  <button onClick={() => setMobileFilterOpen(false)}>
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {[
                    { value: 'all', label: 'Tous les produits' },
                    { value: 'tshirt', label: 'T-Shirts' },
                    { value: 'jean', label: 'Jeans' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => { setFilter(option.value as typeof filter); setMobileFilterOpen(false); }}
                      className={`px-4 py-3 text-left font-medium transition-all ${
                        filter === option.value
                          ? 'bg-[var(--primary)] text-white'
                          : 'bg-[var(--muted)]'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product, i) => (
              <div 
                key={product.id} 
                className="group bg-white animate-fade-in-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="aspect-[3/4] overflow-hidden relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button className="bg-white text-[var(--primary)] px-6 py-3 font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      Voir le produit
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <span className="text-xs text-[var(--accent)] uppercase tracking-wide">
                    {product.category === 'tshirt' ? 'T-Shirt' : 'Jean'}
                  </span>
                  <h3 className="font-medium mt-1 text-sm sm:text-base group-hover:text-[var(--accent)] transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <p className="font-semibold">{product.price.toFixed(2)}€</p>
                    <span className="text-xs text-[var(--muted-foreground)]">{product.color}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {product.sizes.map(size => (
                      <span key={size} className="text-xs px-2 py-1 bg-[var(--muted)] text-[var(--muted-foreground)]">
                        {size}
                      </span>
                    ))}
                  </div>
                  <button className="w-full mt-4 bg-[var(--primary)] text-white py-3 text-sm font-medium hover:bg-[var(--primary-light)] transition-colors flex items-center justify-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    Ajouter au panier
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--primary)] text-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            {site.name.replace(site.tagline, '')}<span className="text-[var(--accent)]">{site.tagline}</span>
          </p>
          <p className="text-white/50 text-sm">{site.copyright}</p>
        </div>
      </footer>

      <WhatsAppChatbot />
    </main>
  );
}
