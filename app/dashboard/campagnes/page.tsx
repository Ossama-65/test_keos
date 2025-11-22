'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, TrendingUp, Users, MessageSquare } from 'lucide-react';

export default function CampagnesPage() {
  const [campaigns] = useState([
    {
      id: '1',
      nom: 'Campagne Paris Tech',
      date_creation: '2025-11-20',
      prospects: 15,
      envoyes: 15,
      reponses: 3,
      taux_reponse: 20,
      statut: 'active',
    },
    {
      id: '2',
      nom: 'Campagne Lyon SaaS',
      date_creation: '2025-11-18',
      prospects: 12,
      envoyes: 12,
      reponses: 2,
      taux_reponse: 16.7,
      statut: 'active',
    },
  ]);

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Campagnes</h1>
          <p className="text-muted-foreground mt-2">
            Gérez vos campagnes de prospection
          </p>
        </div>
        <Button>
          <Send className="mr-2 h-4 w-4" />
          Nouvelle campagne
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Campagnes actives
            </CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Messages envoyés
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">27</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Réponses
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taux de réponse
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18.5%</div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {campaigns.map((campaign) => (
          <Card key={campaign.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{campaign.nom}</CardTitle>
                  <CardDescription className="mt-2">
                    Créée le {new Date(campaign.date_creation).toLocaleDateString('fr-FR')}
                  </CardDescription>
                </div>
                <div className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                  Active
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Prospects</p>
                  <p className="text-2xl font-bold">{campaign.prospects}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Envoyés</p>
                  <p className="text-2xl font-bold">{campaign.envoyes}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Réponses</p>
                  <p className="text-2xl font-bold">{campaign.reponses}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Taux</p>
                  <p className="text-2xl font-bold">{campaign.taux_reponse.toFixed(1)}%</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm">
                  Voir détails
                </Button>
                <Button variant="outline" size="sm">
                  Relancer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Campaign Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Créer une nouvelle campagne</CardTitle>
          <CardDescription>
            Les campagnes vous permettent de grouper et tracker vos efforts de prospection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Sélectionnez vos prospects</p>
                  <p className="text-sm text-muted-foreground">
                    Filtrez par ville, secteur ou priorité pour cibler votre campagne
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Choisissez votre template</p>
                  <p className="text-sm text-muted-foreground">
                    Utilisez un template pré-défini ou créez le vôtre
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Suivez vos résultats</p>
                  <p className="text-sm text-muted-foreground">
                    Trackez les envois, réponses et conversions en temps réel
                  </p>
                </div>
              </div>
            </div>

            <Button className="mt-4">
              <Send className="mr-2 h-4 w-4" />
              Créer ma première campagne
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

