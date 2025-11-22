'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Prospect } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '../../../components/StatusBadge';
import { 
  ArrowLeft, 
  ExternalLink, 
  Mail, 
  Phone, 
  Linkedin, 
  MapPin, 
  Building, 
  Calendar,
  Save,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function ProspectDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [prospect, setProspect] = useState<Prospect | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<Prospect>>({});

  useEffect(() => {
    fetchProspect();
  }, [params.id]);

  const fetchProspect = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/prospects?id=${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setProspect(data);
      setFormData(data);
    } catch (error) {
      console.error('Error fetching prospect:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/prospects?id=${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to update');
      const updated = await response.json();
      setProspect(updated);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating prospect:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!prospect) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Prospect non trouvé</p>
        <Link href="/dashboard/prospects">
          <Button className="mt-4">Retour à la liste</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div className="flex gap-2">
          {editMode ? (
            <>
              <Button variant="outline" onClick={() => setEditMode(false)}>
                Annuler
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button onClick={() => setEditMode(true)}>
              Modifier
            </Button>
          )}
        </div>
      </div>

      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl">{prospect.nom_entreprise}</CardTitle>
              <CardDescription className="mt-2 flex items-center gap-4">
                {prospect.ville && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {prospect.ville}
                  </span>
                )}
                {prospect.libelle_naf && (
                  <span className="flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    {prospect.libelle_naf}
                  </span>
                )}
              </CardDescription>
            </div>
            <StatusBadge status={prospect.statut} />
          </div>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {editMode ? (
              <>
                <div className="space-y-2">
                  <Label>Prénom</Label>
                  <Input
                    value={formData.contact_prenom || ''}
                    onChange={(e) => setFormData({...formData, contact_prenom: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nom</Label>
                  <Input
                    value={formData.contact_nom || ''}
                    onChange={(e) => setFormData({...formData, contact_nom: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Poste</Label>
                  <Input
                    value={formData.contact_poste || ''}
                    onChange={(e) => setFormData({...formData, contact_poste: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Téléphone</Label>
                  <Input
                    value={formData.telephone || ''}
                    onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                  />
                </div>
              </>
            ) : (
              <>
                {(prospect.contact_prenom || prospect.contact_nom) && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Contact</p>
                    <p className="text-lg">
                      {prospect.contact_prenom} {prospect.contact_nom}
                    </p>
                    {prospect.contact_poste && (
                      <p className="text-sm text-muted-foreground">{prospect.contact_poste}</p>
                    )}
                  </div>
                )}
                {prospect.email && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <a href={`mailto:${prospect.email}`} className="text-primary hover:underline flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {prospect.email}
                    </a>
                  </div>
                )}
                {prospect.telephone && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Téléphone</p>
                    <a href={`tel:${prospect.telephone}`} className="text-primary hover:underline flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {prospect.telephone}
                    </a>
                  </div>
                )}
                {prospect.site_web && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Site Web</p>
                    <a 
                      href={prospect.site_web} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-primary hover:underline flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {prospect.site_web}
                    </a>
                  </div>
                )}
                {prospect.linkedin && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">LinkedIn</p>
                    <a 
                      href={prospect.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-primary hover:underline flex items-center gap-2"
                    >
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </a>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Prospection Info */}
        <Card>
          <CardHeader>
            <CardTitle>Suivi de Prospection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {editMode ? (
              <>
                <div className="space-y-2">
                  <Label>Statut</Label>
                  <Select 
                    value={formData.statut || ''} 
                    onValueChange={(value) => setFormData({...formData, statut: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="À contacter">À contacter</SelectItem>
                      <SelectItem value="Envoyé">Envoyé</SelectItem>
                      <SelectItem value="Répondu">Répondu</SelectItem>
                      <SelectItem value="Intéressé">Intéressé</SelectItem>
                      <SelectItem value="Call planifié">Call planifié</SelectItem>
                      <SelectItem value="Pas intéressé">Pas intéressé</SelectItem>
                      <SelectItem value="Converti">Converti</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priorité</Label>
                  <Select 
                    value={formData.priorite || ''} 
                    onValueChange={(value) => setFormData({...formData, priorite: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Haute">Haute</SelectItem>
                      <SelectItem value="Moyenne">Moyenne</SelectItem>
                      <SelectItem value="Basse">Basse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Score (0-10)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    value={formData.score || 0}
                    onChange={(e) => setFormData({...formData, score: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Observation</Label>
                  <Textarea
                    value={formData.observation || ''}
                    onChange={(e) => setFormData({...formData, observation: e.target.value})}
                    rows={3}
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Priorité</p>
                  <p className="text-lg">{prospect.priorite || 'Non définie'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Score</p>
                  <p className="text-lg">{prospect.score}/10</p>
                </div>
                {prospect.date_contact && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Date de contact</p>
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(prospect.date_contact).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                )}
                {prospect.observation && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Observation</p>
                    <p className="text-sm">{prospect.observation}</p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          {editMode ? (
            <Textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={6}
              placeholder="Ajoutez vos notes ici..."
            />
          ) : (
            <p className="text-sm whitespace-pre-wrap">
              {prospect.notes || 'Aucune note pour ce prospect'}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Company Details */}
      <Card>
        <CardHeader>
          <CardTitle>Détails de l'Entreprise</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">SIREN</p>
            <p>{prospect.siren || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">SIRET</p>
            <p>{prospect.siret || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Effectif</p>
            <p>{prospect.effectif || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Date de création</p>
            <p>{prospect.date_creation || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Code NAF</p>
            <p>{prospect.code_naf || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Adresse</p>
            <p>{prospect.adresse || 'N/A'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

