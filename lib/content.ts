import { getSiteContent } from './mongodb';

export interface SiteContent {
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

export interface HeroContent {
  badge: string;
  title: string;
  titleAccent: string;
  description: string;
  ctaText: string;
  ctaSecondary: string;
  backgroundImage: string;
}

export interface Advantage {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface Bestsellers {
  title: string;
  description: string;
  products: string[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'tshirt' | 'jean';
  sizes: string[];
  image: string;
  color: string;
  active: boolean;
}

export interface ContactContent {
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

export interface ProductsPageContent {
  title: string;
  description: string;
}

export interface MetaContent {
  title: string;
  description: string;
  keywords: string;
}

export interface ContentData {
  site: SiteContent;
  hero: HeroContent;
  advantages: Advantage[];
  bestsellers: Bestsellers;
  products: Product[];
  contact: ContactContent;
  productsPage: ProductsPageContent;
  meta: MetaContent;
}

// Données par défaut en cas d'erreur
const defaultContent: ContentData = {
  site: {
    name: 'URBANSTYLE',
    tagline: 'STYLE',
    description: 'Votre destination mode pour des vêtements de qualité.',
    email: 'contact@urbanstyle.fr',
    phone: '01 23 45 67 89',
    address: '123 Avenue de la Mode',
    city: '75001 Paris, France',
    whatsapp: '33123456789',
    copyright: '© 2024 UrbanStyle. Tous droits réservés.'
  },
  hero: {
    badge: 'Nouvelle Collection 2024',
    title: 'Style Urbain',
    titleAccent: 'Qualité Premium',
    description: 'Découvrez notre collection exclusive de t-shirts et jeans.',
    ctaText: 'Voir les Produits',
    ctaSecondary: 'Nous Contacter',
    backgroundImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80'
  },
  advantages: [],
  bestsellers: { title: 'Nos Bestsellers', description: '', products: [] },
  products: [],
  contact: {
    title: 'Contactez-nous',
    subtitle: '',
    email: '',
    emailSupport: '',
    phone: '',
    phoneHours: '',
    hours: { weekdays: '', saturday: '', sunday: '' },
    address: '',
    city: ''
  },
  productsPage: { title: 'Nos Produits', description: '' },
  meta: { title: '', description: '', keywords: '' }
};

export async function getContent(): Promise<ContentData> {
  try {
    const content = await getSiteContent();
    if (content) {
      return content as ContentData;
    }
    return defaultContent;
  } catch (error) {
    console.error('Error reading content from MongoDB:', error);
    return defaultContent;
  }
}
