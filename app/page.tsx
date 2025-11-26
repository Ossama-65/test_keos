import Link from 'next/link';
import { ArrowRight, Truck, Shield, RefreshCw } from 'lucide-react';
import WhatsAppChatbot from './components/WhatsAppChatbot';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link href="/" className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              URBAN<span className="text-[var(--accent)]">STYLE</span>
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
              url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80')`
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <span className="inline-block text-[var(--accent)] text-sm font-medium tracking-widest uppercase mb-4 animate-fade-in-up">
              Nouvelle Collection 2024
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-6 animate-fade-in-up delay-100" style={{ fontFamily: "'Playfair Display', serif" }}>
              Style Urbain<br />
              <span className="text-[var(--accent)]">Qualité Premium</span>
            </h1>
            <p className="text-white/80 text-lg sm:text-xl mb-8 animate-fade-in-up delay-200">
              Découvrez notre collection exclusive de t-shirts et jeans. 
              Des pièces uniques pour un style qui vous ressemble.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300">
              <Link 
                href="/produits"
                className="inline-flex items-center justify-center gap-2 bg-[var(--accent)] text-white px-8 py-4 font-medium hover:bg-[var(--accent-hover)] transition-all group"
              >
                Voir les Produits
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-4 font-medium hover:bg-white hover:text-[var(--primary)] transition-all"
              >
                Nous Contacter
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Truck, title: 'Livraison Rapide', desc: 'Expédition sous 24-48h partout en France' },
              { icon: Shield, title: 'Paiement Sécurisé', desc: 'Transactions 100% sécurisées' },
              { icon: RefreshCw, title: 'Retours Gratuits', desc: '30 jours pour changer d\'avis' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-6 border border-[var(--border)] hover:border-[var(--accent)] transition-colors">
                <item.icon className="w-8 h-8 text-[var(--accent)] flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-[var(--muted-foreground)] text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Produits Vedettes */}
      <section className="py-16 sm:py-24 bg-[var(--muted)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Nos Bestsellers
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              Les pièces préférées de nos clients, sélectionnées pour leur qualité et leur style.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'T-Shirt Premium Noir', price: '29.99€', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80', category: 'T-Shirt' },
              { name: 'Jean Slim Classic', price: '59.99€', img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80', category: 'Jean' },
              { name: 'T-Shirt Blanc Essential', price: '24.99€', img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&q=80', category: 'T-Shirt' },
              { name: 'Jean Regular Vintage', price: '69.99€', img: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=400&q=80', category: 'Jean' },
            ].map((product, i) => (
              <Link href="/produits" key={i} className="group">
                <div className="bg-white overflow-hidden">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img 
                      src={product.img} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-xs text-[var(--accent)] uppercase tracking-wide">{product.category}</span>
                    <h3 className="font-medium mt-1 group-hover:text-[var(--accent)] transition-colors">{product.name}</h3>
                    <p className="font-semibold mt-2">{product.price}</p>
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
                URBAN<span className="text-[var(--accent)]">STYLE</span>
              </h3>
              <p className="text-white/70 text-sm">
                Votre destination mode pour des vêtements de qualité.
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
              <p className="text-white/70 text-sm">Email: contact@urbanstyle.fr</p>
              <p className="text-white/70 text-sm">Tél: 01 23 45 67 89</p>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/50 text-sm">
            © 2024 UrbanStyle. Tous droits réservés.
          </div>
        </div>
      </footer>

      {/* WhatsApp Chatbot */}
      <WhatsAppChatbot />
    </main>
  );
}
