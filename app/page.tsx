import Link from 'next/link';
import { ArrowRight, Truck, Shield, RefreshCw, Star, Heart, Award, Clock, Gift, Zap, Check } from 'lucide-react';
import WhatsAppChatbot from './components/WhatsAppChatbot';
import { getContent } from '@/lib/content';

// Mapping des icônes
const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Truck,
  Shield,
  RefreshCw,
  Star,
  Heart,
  Award,
  Clock,
  Gift,
  Zap,
  Check
};

export default async function HomePage() {
  const content = await getContent();
  const { site, hero, advantages, bestsellers, products } = content;

  // Récupérer les produits bestsellers
  const bestsellerProducts = bestsellers.products
    .map(id => products.find(p => p.id === id))
    .filter(Boolean)
    .slice(0, 4);

  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link href="/" className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              {site.name.replace(site.tagline, '')}<span className="text-[var(--accent)]">{site.tagline}</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm font-medium hover:text-[var(--accent)] transition-colors">Accueil</Link>
              <Link href="/produits" className="text-sm font-medium hover:text-[var(--accent)] transition-colors">Produits</Link>
              <Link href="/contact" className="text-sm font-medium hover:text-[var(--accent)] transition-colors">Contact</Link>
            </div>
            <Link 
              href="/produits"
              className="bg-[var(--primary)] text-white px-4 sm:px-6 py-2 sm:py-3 text-sm font-medium hover:bg-[var(--primary-light)] transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%), 
              url('${hero.backgroundImage}')`
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <span className="inline-block text-[var(--accent)] text-sm font-medium tracking-widest uppercase mb-4 animate-fade-in-up">
              {hero.badge}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-6 animate-fade-in-up delay-100" style={{ fontFamily: "'Playfair Display', serif" }}>
              {hero.title}<br />
              <span className="text-[var(--accent)]">{hero.titleAccent}</span>
            </h1>
            <p className="text-white/80 text-lg sm:text-xl mb-8 animate-fade-in-up delay-200">
              {hero.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300">
              <Link 
                href="/produits"
                className="inline-flex items-center justify-center gap-2 bg-[var(--accent)] text-white px-8 py-4 font-medium hover:bg-[var(--accent-hover)] transition-all group"
              >
                {hero.ctaText}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-4 font-medium hover:bg-white hover:text-[var(--primary)] transition-all"
              >
                {hero.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {advantages.map((item) => {
              const IconComponent = iconMap[item.icon] || Truck;
              return (
                <div key={item.id} className="flex items-start gap-4 p-6 border border-[var(--border)] hover:border-[var(--accent)] transition-colors">
                  <IconComponent className="w-8 h-8 text-[var(--accent)] flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-[var(--muted-foreground)] text-sm">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Produits Vedettes */}
      <section className="py-16 sm:py-24 bg-[var(--muted)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              {bestsellers.title}
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              {bestsellers.description}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestsellerProducts.map((product, i) => product && (
              <Link href="/produits" key={product.id} className="group">
                <div className="bg-white overflow-hidden">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-xs text-[var(--accent)] uppercase tracking-wide">
                      {product.category === 'tshirt' ? 'T-Shirt' : 'Jean'}
                    </span>
                    <h3 className="font-medium mt-1 group-hover:text-[var(--accent)] transition-colors">{product.name}</h3>
                    <p className="font-semibold mt-2">{product.price.toFixed(2)}€</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link 
              href="/produits"
              className="inline-flex items-center gap-2 border-2 border-[var(--primary)] px-8 py-4 font-medium hover:bg-[var(--primary)] hover:text-white transition-all"
            >
              Voir Tous les Produits
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--primary)] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                {site.name.replace(site.tagline, '')}<span className="text-[var(--accent)]">{site.tagline}</span>
              </h3>
              <p className="text-white/70 text-sm">
                {site.description}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Navigation</h4>
              <div className="flex flex-col gap-2">
                <Link href="/" className="text-white/70 hover:text-white text-sm transition-colors">Accueil</Link>
                <Link href="/produits" className="text-white/70 hover:text-white text-sm transition-colors">Produits</Link>
                <Link href="/contact" className="text-white/70 hover:text-white text-sm transition-colors">Contact</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-white/70 text-sm">Email: {site.email}</p>
              <p className="text-white/70 text-sm">Tél: {site.phone}</p>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/50 text-sm">
            {site.copyright}
          </div>
        </div>
      </footer>

      {/* WhatsApp Chatbot */}
      <WhatsAppChatbot />
    </main>
  );
}
