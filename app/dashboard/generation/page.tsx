'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';

export default function GenerationPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [count, setCount] = useState(100);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erreur lors de la génération');
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
        <h1 className="text-3xl font-bold text-slate-900">Génération de Prospects</h1>
        <p className="text-muted-foreground mt-2">
          Générez automatiquement de nouveaux prospects depuis la base SIRENE
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>
            Paramétrez la génération de prospects
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="count">Nombre de prospects à générer</Label>
            <Input
              id="count"
              type="number"
              min="10"
              max="500"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 100)}
              disabled={loading}
            />
            <p className="text-sm text-muted-foreground">
              Entre 10 et 500 prospects (recommandé: 100)
            </p>
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={loading}
            className="w-full md:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Générer les prospects
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900">
              <CheckCircle className="h-5 w-5" />
              Génération réussie
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-green-900">
            <p className="font-medium">
              {result.prospects_generated} prospects générés avec succès !
            </p>
            <p className="text-sm">
              Les prospects ont été ajoutés à votre base de données.
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
                <p className="font-medium">Base SIRENE</p>
                <p className="text-sm text-muted-foreground">
                  Les prospects sont générés depuis la base SIRENE officielle avec des filtres intelligents
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                <div className="h-2 w-2 rounded-full bg-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Filtres automatiques</p>
                <p className="text-sm text-muted-foreground">
                  Secteurs tech/SaaS, effectif 2-50 employés, créées depuis 5 ans
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                <div className="h-2 w-2 rounded-full bg-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Prêt à prospecter</p>
                <p className="text-sm text-muted-foreground">
                  Les prospects sont immédiatement disponibles dans votre liste
                </p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
            <p className="text-sm text-amber-900">
              <strong>Note:</strong> Les prospects générés contiennent des données de base. 
              Utilisez la fonction d'enrichissement pour ajouter les sites web et emails.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

