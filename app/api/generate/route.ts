import { NextRequest, NextResponse } from 'next/server';
import { runPythonScript, parsePythonOutput } from '@/lib/python-runner';
import { importFromCSV } from '@/lib/db';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { count = 100 } = await request.json();

    // Run the Python script to generate prospects
    const result = await runPythonScript('generate_demo_prospects.py');

    if (!result.success) {
      return NextResponse.json(
        { error: 'Erreur lors de la génération', details: result.error },
        { status: 500 }
      );
    }

    // Parse the output
    const parsed = parsePythonOutput(result.output);

    // Read the generated CSV and import it
    try {
      const csvPath = path.join(process.cwd(), '..', 'scripts', 'prospects_sirene.csv');
      const csvData = await fs.readFile(csvPath, 'utf-8');
      
      // Convert CSV to JSON and save
      const convertScript = path.join(process.cwd(), 'scripts', 'convert-csv.js');
      await runPythonScript(`node ${convertScript}`);

      return NextResponse.json({
        success: true,
        prospects_generated: parsed.prospects_found || count,
        message: 'Prospects générés avec succès',
        output: result.output,
      });
    } catch (importError) {
      console.error('Import error:', importError);
      return NextResponse.json({
        success: true,
        prospects_generated: parsed.prospects_found || count,
        message: 'Prospects générés, mais erreur d\'import',
        output: result.output,
      });
    }
  } catch (error: any) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur', details: error.message },
      { status: 500 }
    );
  }
}

