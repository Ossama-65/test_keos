export interface Prospect {
  id: string;
  priorite: string;
  score: number;
  nom_entreprise: string;
  site_web: string;
  linkedin: string;
  contact_prenom: string;
  contact_nom: string;
  contact_poste: string;
  email: string;
  telephone: string;
  observation: string;
  statut: string;
  notes: string;
  date_contact: string;
  canal: string;
  reponse: string;
  date_relance: string;
  prochaine_action: string;
  ville: string;
  code_postal: string;
  libelle_naf: string;
  effectif: string;
  date_creation: string;
  siren: string;
  siret: string;
  departement: string;
  adresse: string;
  code_naf: string;
}

export interface ProspectFilters {
  ville?: string;
  secteur?: string;
  statut?: string;
  priorite?: string;
  score_min?: number;
  search?: string;
}

export interface Stats {
  total: number;
  contactes: number;
  reponses: number;
  conversions: number;
  taux_reponse: number;
}

export interface Campaign {
  id: string;
  nom: string;
  date_creation: string;
  prospects: string[];
  template: string;
  statut: 'active' | 'terminee' | 'brouillon';
  stats: {
    envoyes: number;
    reponses: number;
    taux_reponse: number;
  };
}

