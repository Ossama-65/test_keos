import { NextRequest, NextResponse } from 'next/server';
import { getStats } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const stats = await getStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

