import { NextRequest, NextResponse } from 'next/server';
import { runPythonScript, parsePythonOutput } from '@/lib/python-runner';

export async function POST(request: NextRequest) {
  try {
    // Run the Python enrichment script
    const result = await runPythonScript('enrichment_scraper.py');

    if (!result.success) {
      return NextResponse.json(
        { error: 'Erreur lors de l\'enrichissement', details: result.error },
        { status: 500 }
      );
    }

    // Parse the output
    const parsed = parsePythonOutput(result.output);

    // Reload the JSON data
    const convertScript = 'node scripts/convert-csv.js';
    await runPythonScript(convertScript);

    return NextResponse.json({
      success: true,
      prospects_enriched: parsed.prospects_found || 0,
      message: 'Enrichissement terminé avec succès',
      output: result.output,
    });
  } catch (error: any) {
    console.error('Enrichment error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur', details: error.message },
      { status: 500 }
    );
  }
}

