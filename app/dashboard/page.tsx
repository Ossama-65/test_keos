import { Users, Send, MessageSquare, TrendingUp, ArrowRight } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

async function getStats() {
  try {
    const response = await fetch('http://localhost:3000/api/stats', {
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Failed to fetch stats');
    return await response.json();
  } catch (error) {
    return {
      total: 0,
      contactes: 0,
      reponses: 0,
      conversions: 0,
      taux_reponse: 0,
    };
  }
}

async function getRecentProspects() {
  try {
    const response = await fetch('http://localhost:3000/api/prospects', {
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Failed to fetch prospects');
    const prospects = await response.json();
    // Return only the 5 most recent
    return prospects.slice(0, 5);
  } catch (error) {
    return [];
  }
}

export default async function DashboardPage() {
  const stats = await getStats();
  const recentProspects = await getRecentProspects();

  return (
    <div className="space-y-8 pb-20 lg:pb-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Vue d'ensemble de votre prospection
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Prospects"
          value={stats.total}
          icon={Users}
          description="Prospects dans la base"
        />
        <StatsCard
          title="Contactés"
          value={stats.contactes}
          icon={Send}
          description="Messages envoyés"
        />
        <StatsCard
          title="Réponses"
          value={stats.reponses}
          icon={MessageSquare}
          description="Prospects ayant répondu"
        />
        <StatsCard
          title="Conversions"
          value={stats.conversions}
          icon={TrendingUp}
          description={`Taux: ${stats.taux_reponse}%`}
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
          <CardDescription>Lancez votre prochaine action</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/dashboard/prospects">
            <Button className="w-full h-20" variant="outline">
              <div className="text-center">
                <Users className="h-5 w-5 mx-auto mb-2" />
                <div className="text-sm font-medium">Voir Prospects</div>
              </div>
            </Button>
          </Link>
          <Link href="/dashboard/generation">
            <Button className="w-full h-20" variant="outline">
              <div className="text-center">
                <Users className="h-5 w-5 mx-auto mb-2" />
                <div className="text-sm font-medium">Générer Prospects</div>
              </div>
            </Button>
          </Link>
          <Link href="/dashboard/enrichment">
            <Button className="w-full h-20" variant="outline">
              <div className="text-center">
                <Users className="h-5 w-5 mx-auto mb-2" />
                <div className="text-sm font-medium">Enrichir Données</div>
              </div>
            </Button>
          </Link>
          <Link href="/dashboard/campagnes">
            <Button className="w-full h-20" variant="outline">
              <div className="text-center">
                <Send className="h-5 w-5 mx-auto mb-2" />
                <div className="text-sm font-medium">Nouvelle Campagne</div>
              </div>
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Prospects */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Prospects Récents</CardTitle>
            <CardDescription>Derniers ajouts à votre base</CardDescription>
          </div>
          <Link href="/dashboard/prospects">
            <Button variant="ghost" size="sm">
              Voir tout
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentProspects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun prospect pour le moment</p>
              <Link href="/dashboard/generation">
                <Button className="mt-4" variant="outline">
                  Générer des prospects
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentProspects.map((prospect: any) => (
                <div
                  key={prospect.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-slate-900 truncate">
                      {prospect.nom_entreprise}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {prospect.ville} • {prospect.libelle_naf}
                    </p>
                  </div>
                  <div className="ml-4 flex items-center gap-2">
                    {prospect.site_web && (
                      <a
                        href={prospect.site_web}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm"
                      >
                        Site web
                      </a>
                    )}
                    <Link href={`/dashboard/prospects/${prospect.id}`}>
                      <Button size="sm" variant="outline">
                        Voir détail
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips & Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Prochaines Étapes</CardTitle>
          <CardDescription>Conseils pour optimiser votre prospection</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                <div className="h-2 w-2 rounded-full bg-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Enrichissez vos prospects</p>
                <p className="text-sm text-muted-foreground">
                  Ajoutez des sites web et LinkedIn pour augmenter vos chances de conversion
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                <div className="h-2 w-2 rounded-full bg-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Créez une campagne</p>
                <p className="text-sm text-muted-foreground">
                  Groupez vos prospects par secteur ou ville pour des messages ciblés
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                <div className="h-2 w-2 rounded-full bg-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Suivez vos relances</p>
                <p className="text-sm text-muted-foreground">
                  Planifiez des relances pour les prospects qui n'ont pas répondu
                </p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

