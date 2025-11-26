import { NextResponse } from 'next/server';
import { updateSiteContent } from '@/lib/mongodb';
import { promises as fs } from 'fs';
import path from 'path';

// POST - Initialiser la base de données avec les données du fichier JSON
export async function POST() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'content.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    
    await updateSiteContent(data);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Base de données initialisée avec succès',
      sections: Object.keys(data)
    });
  } catch (error) {
    console.error('Error initializing database:', error);
    return NextResponse.json({ 
      error: 'Erreur lors de l\'initialisation',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

