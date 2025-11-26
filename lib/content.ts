import { getAllContent } from './content-service';

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

// Valeurs par défaut
const defaultContent: ContentData = {
  site: {
    name: 'URBANSTYLE',
    tagline: 'STYLE',
    description: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    whatsapp: '',
    copyright: ''
  },
  hero: {
    badge: '',
    title: '',
    titleAccent: '',
    description: '',
    ctaText: '',
    ctaSecondary: '',
    backgroundImage: ''
  },
  advantages: [],
  bestsellers: { title: '', description: '', products: [] },
  products: [],
  contact: {
    title: '',
    subtitle: '',
    email: '',
    emailSupport: '',
    phone: '',
    phoneHours: '',
    hours: { weekdays: '', saturday: '', sunday: '' },
    address: '',
    city: ''
  },
  productsPage: { title: '', description: '' },
  meta: { title: '', description: '', keywords: '' }
};

export async function getContent(): Promise<ContentData> {
  try {
    const content = await getAllContent();
    return content as ContentData;
  } catch (error) {
    console.error('Error reading content:', error);
    return defaultContent;
  }
}
