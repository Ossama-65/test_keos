import { NextRequest, NextResponse } from 'next/server';
import { enrichAllProspects } from '@/lib/enrichment-service';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Démarrage de l\'enrichissement des prospects...');
    
    // Exécuter l'enrichissement en TypeScript
    const result = await enrichAllProspects();

    if (!result.success) {
      console.error('❌ Erreur lors de l\'enrichissement:', result.errors);
      return NextResponse.json(
        { 
          error: 'Erreur lors de l\'enrichissement', 
          details: result.errors.join(', '),
          enrichedCount: result.enrichedCount,
        },
        { status: 500 }
      );
    }

    console.log('✅ Enrichissement terminé avec succès');
    
    return NextResponse.json({
      success: true,
      prospects_enriched: result.enrichedCount,
      message: result.message,
      errors: result.errors,
    });
  } catch (error: any) {
    console.error('Enrichment error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur', details: error.message },
      { status: 500 }
    );
  }
}

