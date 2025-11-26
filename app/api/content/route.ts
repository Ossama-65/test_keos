import { NextRequest, NextResponse } from 'next/server';
import { getSiteContent, updateSiteContent, updateSection } from '@/lib/mongodb';
import { promises as fs } from 'fs';
import path from 'path';

// Données par défaut (utilisées pour l'initialisation)
const getDefaultContent = async () => {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'content.json');
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
};

// GET - Récupérer tout le contenu
export async function GET() {
  try {
    let content = await getSiteContent();
    
    // Si pas de contenu en base, initialiser avec les données par défaut
    if (!content) {
      const defaultContent = await getDefaultContent();
      if (defaultContent) {
        await updateSiteContent(defaultContent);
        content = defaultContent;
      }
    }
    
    return NextResponse.json(content || {});
  } catch (error) {
    console.error('Error reading content:', error);
    // Fallback vers le fichier JSON en cas d'erreur DB
    const defaultContent = await getDefaultContent();
    return NextResponse.json(defaultContent || { error: 'Erreur lecture contenu' });
  }
}

// PUT - Mettre à jour le contenu
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { section, data } = body;
    
    let updatedContent;
    
    if (section) {
      // Mise à jour d'une section spécifique
      updatedContent = await updateSection(section, data);
    } else {
      // Mise à jour complète
      const currentContent = await getSiteContent() || {};
      const newContent = { ...currentContent, ...data };
      updatedContent = await updateSiteContent(newContent);
    }
    
    return NextResponse.json({ success: true, data: updatedContent });
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json({ error: 'Erreur mise à jour' }, { status: 500 });
  }
}

// PATCH - Mettre à jour partiellement une section
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { section, field, value } = body;
    
    if (!section || !field) {
      return NextResponse.json({ error: 'Section et field requis' }, { status: 400 });
    }
    
    const currentContent = await getSiteContent() || {};
    
    if (!currentContent[section]) {
      currentContent[section] = {};
    }
    currentContent[section][field] = value;
    
    const updatedContent = await updateSiteContent(currentContent);
    
    return NextResponse.json({ success: true, data: updatedContent });
  } catch (error) {
    console.error('Error patching content:', error);
    return NextResponse.json({ error: 'Erreur mise à jour partielle' }, { status: 500 });
  }
}
