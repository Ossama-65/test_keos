'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Database, CheckCircle, AlertCircle, ExternalLink, Linkedin } from 'lucide-react';

export default function EnrichmentPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleEnrich = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erreur lors de l\'enrichissement');
        return;
      }

      setResult(data);
    } catch (err: any) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Enrichissement des Données</h1>
        <p className="text-muted-foreground mt-2">
          Complétez automatiquement les informations de vos prospects
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enrichissement Automatique</CardTitle>
          <CardDescription>
            Ajoutez les sites web et pages LinkedIn de vos prospects
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Ce qui sera ajouté :</h4>
            <ul className="space-y-2 text-sm text-blue-900">
              <li className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Sites web des entreprises
              </li>
              <li className="flex items-center gap-2">
                <Linkedin className="h-4 w-4" />
                Pages LinkedIn entreprise
              </li>
            </ul>
          </div>

          <Button 
            onClick={handleEnrich} 
            disabled={loading}
            className="w-full md:w-auto"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enrichissement en cours...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Lancer l'enrichissement
              </>
            )}
          </Button>

          {loading && (
            <div className="bg-slate-50 border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                ⏱️ L'enrichissement peut prendre plusieurs minutes selon le nombre de prospects...
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900">
              <CheckCircle className="h-5 w-5" />
              Enrichissement réussi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-green-900">
            <p className="font-medium">
              {result.prospects_enriched || 'Plusieurs'} prospects enrichis avec succès !
            </p>
            <p className="text-sm">
              Les informations ont été mises à jour dans votre base de données.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.href = '/dashboard/prospects'}
            >
              Voir les prospects
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-900">
              <AlertCircle className="h-5 w-5" />
              Erreur
            </CardTitle>
          </CardHeader>
          <CardContent className="text-red-900">
            <p>{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Information */}
      <Card>
        <CardHeader>
          <CardTitle>Comment ça marche ?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                <div className="h-2 w-2 rounded-full bg-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Recherche automatique</p>
                <p className="text-sm text-muted-foreground">
                  Le système essaie de trouver le site web et LinkedIn pour chaque prospect
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                <div className="h-2 w-2 rounded-full bg-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Patterns intelligents</p>
                <p className="text-sm text-muted-foreground">
                  Utilise des patterns courants (.com, .fr, .io) pour trouver les sites web
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                <div className="h-2 w-2 rounded-full bg-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Mise à jour automatique</p>
                <p className="text-sm text-muted-foreground">
                  Les prospects sont automatiquement mis à jour avec les nouvelles informations
                </p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
            <p className="text-sm text-amber-900">
              <strong>Note:</strong> L'enrichissement est limité aux informations publiquement accessibles. 
              Pour les emails, nous recommandons d'utiliser Hunter.io ou des outils similaires.
            </p>
          </div>

          <div className="mt-6">
            <h4 className="font-medium mb-2">Prochaines étapes</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Vérifiez les prospects enrichis dans la liste</li>
              <li>• Trouvez les emails avec Hunter.io (50 recherches gratuites/mois)</li>
              <li>• Créez une campagne de prospection ciblée</li>
              <li>• Commencez à contacter vos prospects !</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

