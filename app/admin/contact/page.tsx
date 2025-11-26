'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, CheckCircle } from 'lucide-react';

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

export default function ContactSettingsPage() {
  const [contact, setContact] = useState<ContactContent>({
    title: '',
    subtitle: '',
    email: '',
    emailSupport: '',
    phone: '',
    phoneHours: '',
    hours: {
      weekdays: '',
      saturday: '',
      sunday: ''
    },
    address: '',
    city: ''
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
      if (data.contact) setContact(data.contact);
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
        body: JSON.stringify({ section: 'contact', data: contact })
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
          <h1 className="text-3xl font-bold text-white">Page Contact</h1>
          <p className="text-slate-400 mt-1">Modifiez les informations de contact affichées</p>
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

      {/* Header Section */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold text-white mb-6">En-tête de la page</h2>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Titre de la page
            </label>
            <input
              type="text"
              value={contact.title}
              onChange={(e) => setContact({ ...contact, title: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
              placeholder="Contactez-nous"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Sous-titre
            </label>
            <textarea
              value={contact.subtitle}
              onChange={(e) => setContact({ ...contact, subtitle: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all resize-none"
              placeholder="Une question ? Besoin d'aide ?..."
            />
          </div>
        </div>
      </div>

      {/* Email */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold text-white mb-6">Emails</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email principal
            </label>
            <input
              type="email"
              value={contact.email}
              onChange={(e) => setContact({ ...contact, email: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
              placeholder="contact@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email support
            </label>
            <input
              type="email"
              value={contact.emailSupport}
              onChange={(e) => setContact({ ...contact, emailSupport: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
              placeholder="support@example.com"
            />
          </div>
        </div>
      </div>

      {/* Phone */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold text-white mb-6">Téléphone</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Numéro de téléphone
            </label>
            <input
              type="text"
              value={contact.phone}
              onChange={(e) => setContact({ ...contact, phone: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
              placeholder="01 23 45 67 89"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Disponibilité
            </label>
            <input
              type="text"
              value={contact.phoneHours}
              onChange={(e) => setContact({ ...contact, phoneHours: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
              placeholder="Du lundi au vendredi"
            />
          </div>
        </div>
      </div>

      {/* Hours */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold text-white mb-6">Horaires d&apos;ouverture</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Semaine
            </label>
            <input
              type="text"
              value={contact.hours.weekdays}
              onChange={(e) => setContact({ ...contact, hours: { ...contact.hours, weekdays: e.target.value } })}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
              placeholder="Lundi - Vendredi : 9h00 - 18h00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Samedi
            </label>
            <input
              type="text"
              value={contact.hours.saturday}
              onChange={(e) => setContact({ ...contact, hours: { ...contact.hours, saturday: e.target.value } })}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
              placeholder="Samedi : 10h00 - 16h00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Dimanche
            </label>
            <input
              type="text"
              value={contact.hours.sunday}
              onChange={(e) => setContact({ ...contact, hours: { ...contact.hours, sunday: e.target.value } })}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
              placeholder="Dimanche : Fermé"
            />
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Adresse</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Adresse
            </label>
            <input
              type="text"
              value={contact.address}
              onChange={(e) => setContact({ ...contact, address: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
              placeholder="123 Avenue de la Mode"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Ville
            </label>
            <input
              type="text"
              value={contact.city}
              onChange={(e) => setContact({ ...contact, city: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
              placeholder="75001 Paris, France"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

