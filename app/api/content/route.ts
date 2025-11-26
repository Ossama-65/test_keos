import { NextRequest, NextResponse } from 'next/server';
import { getAllContent, updateContent, patchContent } from '@/lib/content-service';

// GET - Récupérer tout le contenu
export async function GET() {
  try {
    const content = await getAllContent();
    return NextResponse.json(content);
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
    
    const updatedContent = await updateContent(section, data);
    
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
    
    const updatedContent = await patchContent(section, field, value);
    
    return NextResponse.json({ success: true, data: updatedContent });
  } catch (error) {
    console.error('Error patching content:', error);
    return NextResponse.json({ error: 'Erreur mise à jour partielle' }, { status: 500 });
  }
}
