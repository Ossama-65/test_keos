'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, CheckCircle, Loader2 } from 'lucide-react';
import WhatsAppChatbot from '../components/WhatsAppChatbot';

interface ContactContent {
  title: string;
  subtitle: string;
  email: string;
  emailSupport: string;
  phone: string;
  phoneHours: string;
  hours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  address: string;
  city: string;
}

interface ContentData {
  contact: ContactContent;
  site: {
    name: string;
    tagline: string;
    whatsapp: string;
    copyright: string;
  };
}

export default function ContactPage() {
  const [content, setContent] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  if (loading || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[var(--accent)] animate-spin" />
      </div>
    );
  }

  const { contact, site } = content;

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
              <Link href="/produits" className="text-sm font-medium hover:text-[var(--accent)] transition-colors">Produits</Link>
              <Link href="/contact" className="text-sm font-medium text-[var(--accent)]">Contact</Link>
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

      {/* Header */}
      <section className="pt-32 pb-12 bg-[var(--muted)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            {contact.title}
          </h1>
          <p className="text-[var(--muted-foreground)] text-lg max-w-2xl">
            {contact.subtitle}
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
                Nos Coordonnées
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-6 bg-white border border-[var(--border)]">
                  <div className="w-12 h-12 bg-[var(--accent)]/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-[var(--accent)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-[var(--muted-foreground)]">{contact.email}</p>
                    {contact.emailSupport && (
                      <p className="text-[var(--muted-foreground)]">{contact.emailSupport}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-white border border-[var(--border)]">
                  <div className="w-12 h-12 bg-[var(--accent)]/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-[var(--accent)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Téléphone</h3>
                    <p className="text-[var(--muted-foreground)]">{contact.phone}</p>
                    <p className="text-sm text-[var(--muted-foreground)] mt-1">{contact.phoneHours}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-white border border-[var(--border)]">
                  <div className="w-12 h-12 bg-[var(--accent)]/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-[var(--accent)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Horaires d&apos;Ouverture</h3>
                    <p className="text-[var(--muted-foreground)]">{contact.hours.weekdays}</p>
                    <p className="text-[var(--muted-foreground)]">{contact.hours.saturday}</p>
                    <p className="text-[var(--muted-foreground)]">{contact.hours.sunday}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-white border border-[var(--border)]">
                  <div className="w-12 h-12 bg-[var(--accent)]/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[var(--accent)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Adresse</h3>
                    <p className="text-[var(--muted-foreground)]">{contact.address}</p>
                    <p className="text-[var(--muted-foreground)]">{contact.city}</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp Direct */}
              {site.whatsapp && (
                <div className="mt-8 p-6 bg-[#25D366]/10 border border-[#25D366]/30 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <MessageCircle className="w-6 h-6 text-[#25D366]" />
                    <h3 className="font-semibold">Chat WhatsApp</h3>
                  </div>
                  <p className="text-sm text-[var(--muted-foreground)] mb-4">
                    Contactez-nous directement sur WhatsApp pour une réponse rapide !
                  </p>
                  <a 
                    href={`https://wa.me/${site.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 font-medium hover:bg-[#128C7E] transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Démarrer une conversation
                  </a>
                </div>
              )}
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
                Envoyez-nous un Message
              </h2>

              {submitted ? (
                <div className="p-8 bg-green-50 border border-green-200 text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-green-800 mb-2">Message Envoyé !</h3>
                  <p className="text-green-700">Nous vous répondrons dans les plus brefs délais.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Nom complet *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 border border-[var(--border)] focus:border-[var(--accent)] focus:outline-none transition-colors"
                        placeholder="Jean Dupont"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 border border-[var(--border)] focus:border-[var(--accent)] focus:outline-none transition-colors"
                        placeholder="jean@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Sujet *</label>
                    <select
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full px-4 py-3 border border-[var(--border)] focus:border-[var(--accent)] focus:outline-none transition-colors bg-white"
                    >
                      <option value="">Sélectionnez un sujet</option>
                      <option value="order">Question sur une commande</option>
                      <option value="product">Information produit</option>
                      <option value="return">Retour / Échange</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Message *</label>
                    <textarea
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-4 py-3 border border-[var(--border)] focus:border-[var(--accent)] focus:outline-none transition-colors resize-none"
                      placeholder="Décrivez votre demande..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[var(--primary)] text-white py-4 font-medium hover:bg-[var(--primary-light)] transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Envoyer le Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--primary)] text-white py-12">
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
