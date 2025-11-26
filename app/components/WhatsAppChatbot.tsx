'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Clock } from 'lucide-react';

const FAQ_RESPONSES = [
  { question: 'Livraison', answer: 'Livraison en 24-48h en France métropolitaine. Frais offerts dès 50€ d\'achat !' },
  { question: 'Retours', answer: 'Retours gratuits sous 30 jours. Renvoyez simplement le produit dans son emballage d\'origine.' },
  { question: 'Tailles', answer: 'Consultez notre guide des tailles sur chaque fiche produit. En cas de doute, prenez la taille au-dessus !' },
  { question: 'Paiement', answer: 'Nous acceptons CB, PayPal, Apple Pay et paiement en 3x sans frais dès 100€.' },
];

export default function WhatsAppChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<{type: 'bot' | 'user', text: string}[]>([
    { type: 'bot', text: 'Bonjour ! 👋 Comment puis-je vous aider aujourd\'hui ?' }
  ]);
  const [isBusinessHours, setIsBusinessHours] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('33123456789');
  const [siteName, setSiteName] = useState('UrbanStyle');

  // Récupérer les données du site
  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        const res = await fetch('/api/content');
        const data = await res.json();
        if (data.site?.whatsapp) {
          setWhatsappNumber(data.site.whatsapp);
        }
        if (data.site?.name) {
          setSiteName(data.site.name);
        }
      } catch (error) {
        console.error('Error fetching site data:', error);
      }
    };
    fetchSiteData();
  }, []);

  // Vérifie si on est dans les horaires d'ouverture
  useEffect(() => {
    const checkBusinessHours = () => {
      const now = new Date();
      const day = now.getDay(); // 0 = dimanche
      const hour = now.getHours();
      
      // Lundi-Vendredi: 9h-18h, Samedi: 10h-16h
      if (day >= 1 && day <= 5) {
        setIsBusinessHours(hour >= 9 && hour < 18);
      } else if (day === 6) {
        setIsBusinessHours(hour >= 10 && hour < 16);
      } else {
        setIsBusinessHours(false);
      }
    };

    checkBusinessHours();
    const interval = setInterval(checkBusinessHours, 60000); // Vérifie toutes les minutes
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Ajoute le message utilisateur
    setChatMessages(prev => [...prev, { type: 'user', text: message }]);
    
    // Cherche une réponse FAQ
    const faqMatch = FAQ_RESPONSES.find(faq => 
      message.toLowerCase().includes(faq.question.toLowerCase())
    );

    setTimeout(() => {
      if (faqMatch) {
        setChatMessages(prev => [...prev, { type: 'bot', text: faqMatch.answer }]);
      } else if (isBusinessHours) {
        // Pendant les heures d'ouverture, redirige vers WhatsApp
        setChatMessages(prev => [...prev, { 
          type: 'bot', 
          text: 'Je vais vous connecter avec un conseiller en direct ! Cliquez sur le bouton ci-dessous pour continuer sur WhatsApp.' 
        }]);
      } else {
        // Hors horaires
        setChatMessages(prev => [...prev, { 
          type: 'bot', 
          text: 'Nous sommes actuellement fermés. Nos horaires : Lun-Ven 9h-18h, Sam 10h-16h. Laissez-nous un message et nous vous répondrons dès que possible !' 
        }]);
      }
    }, 800);

    setMessage('');
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent('Bonjour, j\'ai une question concernant vos produits.');
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 w-16 h-16 bg-[#25D366] text-white rounded-full shadow-lg hover:scale-110 transition-all flex items-center justify-center ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
      </button>

      {/* Chat Widget */}
      <div className={`fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] sm:w-96 transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-[var(--border)]">
          {/* Header */}
          <div className="bg-[#25D366] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">{siteName} Support</h3>
                <div className="flex items-center gap-1 text-xs text-white/80">
                  <span className={`w-2 h-2 rounded-full ${isBusinessHours ? 'bg-green-300' : 'bg-red-400'}`} />
                  {isBusinessHours ? 'En ligne' : 'Hors ligne'}
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Horaires info */}
          {!isBusinessHours && (
            <div className="bg-amber-50 px-4 py-2 flex items-center gap-2 text-sm text-amber-800 border-b border-amber-200">
              <Clock className="w-4 h-4" />
              Horaires : Lun-Ven 9h-18h, Sam 10h-16h
            </div>
          )}

          {/* Messages */}
          <div className="h-72 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                  msg.type === 'user' 
                    ? 'bg-[#25D366] text-white rounded-br-sm' 
                    : 'bg-white border border-gray-200 rounded-bl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Questions */}
          <div className="px-4 py-2 border-t border-[var(--border)] bg-white">
            <p className="text-xs text-[var(--muted-foreground)] mb-2">Questions fréquentes :</p>
            <div className="flex flex-wrap gap-1">
              {FAQ_RESPONSES.map((faq, i) => (
                <button
                  key={i}
                  onClick={() => setMessage(faq.question)}
                  className="text-xs px-3 py-1 bg-[var(--muted)] hover:bg-[var(--accent)]/10 rounded-full transition-colors"
                >
                  {faq.question}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-[var(--border)] bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Tapez votre message..."
                className="flex-1 px-4 py-2 border border-[var(--border)] rounded-full focus:outline-none focus:border-[#25D366] text-sm"
              />
              <button
                onClick={handleSendMessage}
                className="w-10 h-10 bg-[#25D366] text-white rounded-full flex items-center justify-center hover:bg-[#128C7E] transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* WhatsApp Direct Button */}
            {isBusinessHours && (
              <button
                onClick={openWhatsApp}
                className="w-full mt-3 py-2 bg-[#25D366]/10 text-[#25D366] text-sm font-medium rounded-lg hover:bg-[#25D366]/20 transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Continuer sur WhatsApp
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
