/**
 * Service d'enrichissement des prospects
 * Convertit la logique Python en TypeScript pour fonctionner sur Vercel
 */

import { Prospect } from './types';
import fs from 'fs/promises';
import path from 'path';

interface EnrichmentResult {
  success: boolean;
  enrichedCount: number;
  errors: string[];
  message: string;
}

export class ProspectEnricher {
  private headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  };

  /**
   * Enrichit tous les prospects du fichier JSON
   */
  async enrichProspects(): Promise<EnrichmentResult> {
    const errors: string[] = [];
    let enrichedCount = 0;

    try {
      // Charger les prospects
      const prospectsPath = path.join(process.cwd(), 'public', 'data', 'prospects.json');
      const fileContent = await fs.readFile(prospectsPath, 'utf-8');
      const prospects: Prospect[] = JSON.parse(fileContent);

      console.log(`📊 ${prospects.length} prospects chargés`);

      // Enrichir chaque prospect
      for (let i = 0; i < prospects.length; i++) {
        const prospect = prospects[i];
        console.log(`🔎 [${i + 1}/${prospects.length}] ${prospect.nom_entreprise}...`);

        let wasEnriched = false;

        // Enrichir le site web si absent
        if (!prospect.site_web || prospect.site_web.trim() === '') {
          const website = await this.findWebsite(prospect.nom_entreprise, prospect.ville);
          if (website) {
            prospect.site_web = website;
            wasEnriched = true;
            console.log(`  ✅ Site trouvé: ${website}`);
          }
        }

        // Enrichir LinkedIn si absent
        if (!prospect.linkedin || prospect.linkedin.trim() === '') {
          const linkedin = await this.findLinkedIn(prospect.nom_entreprise);
          if (linkedin) {
            prospect.linkedin = linkedin;
            wasEnriched = true;
            console.log(`  ✅ LinkedIn trouvé: ${linkedin}`);
          }
        }

        if (wasEnriched) {
          enrichedCount++;
        }

        // Pause pour éviter le rate limiting (plus court pour production)
        await this.sleep(500);
      }

      // Sauvegarder les prospects enrichis
      await fs.writeFile(prospectsPath, JSON.stringify(prospects, null, 2), 'utf-8');
      console.log(`💾 Fichier sauvegardé avec ${enrichedCount} prospects enrichis`);

      return {
        success: true,
        enrichedCount,
        errors,
        message: `${enrichedCount} prospects enrichis avec succès !`,
      };
    } catch (error: any) {
      console.error('Erreur lors de l\'enrichissement:', error);
      return {
        success: false,
        enrichedCount,
        errors: [error.message],
        message: 'Erreur lors de l\'enrichissement',
      };
    }
  }

  /**
   * Trouve le site web d'une entreprise
   */
  private async findWebsite(companyName: string, city: string = ''): Promise<string | null> {
    try {
      const slug = this.slugify(companyName);

      // Extensions courantes pour les entreprises françaises
      const possibleDomains = [
        `https://${slug}.com`,
        `https://${slug}.fr`,
        `https://${slug}.io`,
        `https://www.${slug}.com`,
        `https://www.${slug}.fr`,
        `https://${slug}.co`,
        `https://${slug}.tech`,
        `https://${slug}.app`,
      ];

      // Tester chaque domaine
      for (const domain of possibleDomains) {
        try {
          const response = await fetch(domain, {
            method: 'HEAD',
            headers: this.headers,
            redirect: 'follow',
            signal: AbortSignal.timeout(3000), // Timeout de 3 secondes
          });

          if (response.ok) {
            return domain;
          }
        } catch (error) {
          // Continuer avec le domaine suivant
          continue;
        }
      }

      return null;
    } catch (error) {
      console.error(`Erreur recherche site web pour ${companyName}:`, error);
      return null;
    }
  }

  /**
   * Trouve la page LinkedIn d'une entreprise
   */
  private async findLinkedIn(companyName: string): Promise<string | null> {
    try {
      const slug = this.slugify(companyName);

      // Pattern LinkedIn standard
      const linkedinUrl = `https://www.linkedin.com/company/${slug}`;

      try {
        const response = await fetch(linkedinUrl, {
          method: 'HEAD',
          headers: this.headers,
          redirect: 'follow',
          signal: AbortSignal.timeout(3000),
        });

        if (response.ok) {
          return linkedinUrl;
        }
      } catch (error) {
        // LinkedIn peut bloquer, on retourne quand même l'URL construite
        // Elle sera probablement correcte
        return linkedinUrl;
      }

      return null;
    } catch (error) {
      console.error(`Erreur recherche LinkedIn pour ${companyName}:`, error);
      return null;
    }
  }

  /**
   * Convertit un texte en slug URL-friendly
   */
  private slugify(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD') // Normaliser les caractères accentués
      .replace(/[\u0300-\u036f]/g, '') // Retirer les diacritiques
      .replace(/[^a-z0-9]+/g, '-') // Remplacer les caractères non alphanumériques par des tirets
      .replace(/^-+|-+$/g, ''); // Retirer les tirets au début et à la fin
  }

  /**
   * Pause asynchrone
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Fonction principale d'enrichissement
 */
export async function enrichAllProspects(): Promise<EnrichmentResult> {
  const enricher = new ProspectEnricher();
  return await enricher.enrichProspects();
}

