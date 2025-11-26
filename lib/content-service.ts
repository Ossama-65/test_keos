import { connectToDatabase } from './mongodb';
import Content from './models/Content';
import { promises as fs } from 'fs';
import path from 'path';

const CONTENT_FILE = path.join(process.cwd(), 'public', 'data', 'content.json');

// Données par défaut
const defaultContent = {
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
    description: 'Découvrez notre collection exclusive de t-shirts et jeans. Des pièces uniques pour un style qui vous ressemble.',
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

// Lire le contenu depuis le fichier JSON (fallback)
async function readFromFile(): Promise<Record<string, unknown>> {
  try {
    const content = await fs.readFile(CONTENT_FILE, 'utf-8');
    return JSON.parse(content);
  } catch {
    return defaultContent;
  }
}

// Écrire dans le fichier JSON (fallback pour dev local)
async function writeToFile(data: Record<string, unknown>): Promise<void> {
  try {
    await fs.writeFile(CONTENT_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Erreur écriture fichier:', error);
  }
}

// Récupérer tout le contenu
export async function getAllContent(): Promise<Record<string, unknown>> {
  try {
    const db = await connectToDatabase();
    
    if (db) {
      // MongoDB disponible
      const contentDoc = await Content.findOne({ key: 'site_content' });
      if (contentDoc) {
        return contentDoc.data as Record<string, unknown>;
      }
      
      // Initialiser avec les données du fichier si MongoDB est vide
      const fileContent = await readFromFile();
      await Content.create({ key: 'site_content', data: fileContent });
      return fileContent;
    }
  } catch (error) {
    console.error('Erreur MongoDB, fallback sur fichier:', error);
  }
  
  // Fallback: fichier JSON
  return readFromFile();
}

// Mettre à jour une section du contenu
export async function updateContent(
  section: string | null, 
  data: Record<string, unknown>
): Promise<Record<string, unknown>> {
  try {
    const db = await connectToDatabase();
    
    if (db) {
      // MongoDB disponible
      let contentDoc = await Content.findOne({ key: 'site_content' });
      
      if (!contentDoc) {
        const fileContent = await readFromFile();
        contentDoc = await Content.create({ key: 'site_content', data: fileContent });
      }
      
      const currentData = contentDoc.data as Record<string, unknown>;
      
      if (section) {
        currentData[section] = data;
      } else {
        Object.assign(currentData, data);
      }
      
      contentDoc.data = currentData;
      contentDoc.updatedAt = new Date();
      await contentDoc.save();
      
      return currentData;
    }
  } catch (error) {
    console.error('Erreur MongoDB, fallback sur fichier:', error);
  }
  
  // Fallback: fichier JSON (dev local)
  const currentContent = await readFromFile();
  
  if (section) {
    currentContent[section] = data;
  } else {
    Object.assign(currentContent, data);
  }
  
  await writeToFile(currentContent);
  return currentContent;
}

// Mettre à jour partiellement une section
export async function patchContent(
  section: string, 
  field: string, 
  value: unknown
): Promise<Record<string, unknown>> {
  try {
    const db = await connectToDatabase();
    
    if (db) {
      let contentDoc = await Content.findOne({ key: 'site_content' });
      
      if (!contentDoc) {
        const fileContent = await readFromFile();
        contentDoc = await Content.create({ key: 'site_content', data: fileContent });
      }
      
      const currentData = contentDoc.data as Record<string, unknown>;
      
      if (!currentData[section]) {
        currentData[section] = {};
      }
      (currentData[section] as Record<string, unknown>)[field] = value;
      
      contentDoc.data = currentData;
      contentDoc.updatedAt = new Date();
      await contentDoc.save();
      
      return currentData;
    }
  } catch (error) {
    console.error('Erreur MongoDB, fallback sur fichier:', error);
  }
  
  // Fallback: fichier JSON
  const currentContent = await readFromFile();
  
  if (!currentContent[section]) {
    currentContent[section] = {};
  }
  (currentContent[section] as Record<string, unknown>)[field] = value;
  
  await writeToFile(currentContent);
  return currentContent;
}

export default {
  getAllContent,
  updateContent,
  patchContent
};

