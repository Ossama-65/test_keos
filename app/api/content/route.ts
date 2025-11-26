import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const CONTENT_FILE = path.join(process.cwd(), 'public', 'data', 'content.json');

// GET - Récupérer tout le contenu
export async function GET() {
  try {
    const content = await fs.readFile(CONTENT_FILE, 'utf-8');
    return NextResponse.json(JSON.parse(content));
  } catch (error) {
    console.error('Error reading content:', error);
    return NextResponse.json({ error: 'Erreur lecture contenu' }, { status: 500 });
  }
}

// PUT - Mettre à jour le contenu
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { section, data } = body;
    
    // Lire le contenu actuel
    const currentContent = JSON.parse(await fs.readFile(CONTENT_FILE, 'utf-8'));
    
    // Mettre à jour la section
    if (section) {
      currentContent[section] = data;
    } else {
      // Mise à jour complète
      Object.assign(currentContent, data);
    }
    
    // Sauvegarder
    await fs.writeFile(CONTENT_FILE, JSON.stringify(currentContent, null, 2), 'utf-8');
    
    return NextResponse.json({ success: true, data: currentContent });
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
    
    const currentContent = JSON.parse(await fs.readFile(CONTENT_FILE, 'utf-8'));
    
    if (section && field) {
      if (!currentContent[section]) {
        currentContent[section] = {};
      }
      currentContent[section][field] = value;
    }
    
    await fs.writeFile(CONTENT_FILE, JSON.stringify(currentContent, null, 2), 'utf-8');
    
    return NextResponse.json({ success: true, data: currentContent });
  } catch (error) {
    console.error('Error patching content:', error);
    return NextResponse.json({ error: 'Erreur mise à jour partielle' }, { status: 500 });
  }
}

