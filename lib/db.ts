import fs from 'fs/promises';
import path from 'path';
import { Prospect, ProspectFilters, Stats } from './types';

const DATA_DIR = path.join(process.cwd(), 'public', 'data');
const PROSPECTS_FILE = path.join(DATA_DIR, 'prospects.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
}

// Read prospects from JSON file
export async function readProspects(): Promise<Prospect[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(PROSPECTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist yet, return empty array
    return [];
  }
}

// Write prospects to JSON file
export async function writeProspects(prospects: Prospect[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(PROSPECTS_FILE, JSON.stringify(prospects, null, 2));
}

// Get all prospects with optional filters
export async function listProspects(filters?: ProspectFilters): Promise<Prospect[]> {
  let prospects = await readProspects();

  if (!filters) return prospects;

  // Apply filters
  if (filters.ville) {
    prospects = prospects.filter(p => 
      p.ville?.toLowerCase().includes(filters.ville!.toLowerCase())
    );
  }

  if (filters.secteur) {
    prospects = prospects.filter(p => 
      p.libelle_naf?.toLowerCase().includes(filters.secteur!.toLowerCase())
    );
  }

  if (filters.statut) {
    prospects = prospects.filter(p => p.statut === filters.statut);
  }

  if (filters.priorite) {
    prospects = prospects.filter(p => p.priorite === filters.priorite);
  }

  if (filters.score_min) {
    prospects = prospects.filter(p => p.score >= filters.score_min!);
  }

  if (filters.search) {
    const search = filters.search.toLowerCase();
    prospects = prospects.filter(p =>
      p.nom_entreprise?.toLowerCase().includes(search) ||
      p.contact_nom?.toLowerCase().includes(search) ||
      p.contact_prenom?.toLowerCase().includes(search) ||
      p.email?.toLowerCase().includes(search)
    );
  }

  return prospects;
}

// Get single prospect by ID
export async function getProspect(id: string): Promise<Prospect | null> {
  const prospects = await readProspects();
  return prospects.find(p => p.id === id) || null;
}

// Create new prospect
export async function createProspect(prospect: Omit<Prospect, 'id'>): Promise<Prospect> {
  const prospects = await readProspects();
  const newProspect: Prospect = {
    ...prospect,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
  };
  prospects.push(newProspect);
  await writeProspects(prospects);
  return newProspect;
}

// Update prospect
export async function updateProspect(id: string, data: Partial<Prospect>): Promise<Prospect | null> {
  const prospects = await readProspects();
  const index = prospects.findIndex(p => p.id === id);
  
  if (index === -1) return null;
  
  prospects[index] = { ...prospects[index], ...data };
  await writeProspects(prospects);
  return prospects[index];
}

// Delete prospect
export async function deleteProspect(id: string): Promise<boolean> {
  const prospects = await readProspects();
  const filtered = prospects.filter(p => p.id !== id);
  
  if (filtered.length === prospects.length) return false;
  
  await writeProspects(filtered);
  return true;
}

// Get statistics
export async function getStats(): Promise<Stats> {
  const prospects = await readProspects();
  
  const total = prospects.length;
  const contactes = prospects.filter(p => 
    p.statut === 'Envoyé' || p.statut === 'Répondu' || p.statut === 'Converti'
  ).length;
  const reponses = prospects.filter(p => 
    p.reponse === 'Oui' || p.statut === 'Répondu'
  ).length;
  const conversions = prospects.filter(p => 
    p.statut === 'Converti'
  ).length;
  
  const taux_reponse = contactes > 0 ? (reponses / contactes) * 100 : 0;

  return {
    total,
    contactes,
    reponses,
    conversions,
    taux_reponse: Math.round(taux_reponse * 10) / 10,
  };
}

// Import prospects from CSV data
export async function importFromCSV(csvData: string): Promise<number> {
  const lines = csvData.split('\n');
  if (lines.length < 2) return 0;

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const prospects: Prospect[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
    const prospect: any = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };

    headers.forEach((header, index) => {
      prospect[header] = values[index] || '';
    });

    // Ensure score is a number
    prospect.score = parseInt(prospect.score) || 0;

    prospects.push(prospect as Prospect);
  }

  await writeProspects(prospects);
  return prospects.length;
}

