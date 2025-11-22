import { NextRequest, NextResponse } from 'next/server';
import { listProspects, getProspect, updateProspect, deleteProspect, createProspect } from '@/lib/db';
import { ProspectFilters } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const prospect = await getProspect(id);
      if (!prospect) {
        return NextResponse.json({ error: 'Prospect non trouvé' }, { status: 404 });
      }
      return NextResponse.json(prospect);
    }

    // Get filters from query params
    const filters: ProspectFilters = {
      ville: searchParams.get('ville') || undefined,
      secteur: searchParams.get('secteur') || undefined,
      statut: searchParams.get('statut') || undefined,
      priorite: searchParams.get('priorite') || undefined,
      score_min: searchParams.get('score_min') ? parseInt(searchParams.get('score_min')!) : undefined,
      search: searchParams.get('search') || undefined,
    };

    const prospects = await listProspects(filters);
    return NextResponse.json(prospects);
  } catch (error) {
    console.error('Error fetching prospects:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const prospect = await createProspect(data);
    return NextResponse.json(prospect, { status: 201 });
  } catch (error) {
    console.error('Error creating prospect:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 });
    }

    const data = await request.json();
    const prospect = await updateProspect(id, data);
    
    if (!prospect) {
      return NextResponse.json({ error: 'Prospect non trouvé' }, { status: 404 });
    }

    return NextResponse.json(prospect);
  } catch (error) {
    console.error('Error updating prospect:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 });
    }

    const success = await deleteProspect(id);
    
    if (!success) {
      return NextResponse.json({ error: 'Prospect non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting prospect:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

