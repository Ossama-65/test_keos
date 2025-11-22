'use client';

import { Prospect } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from './StatusBadge';
import { ExternalLink, Mail, Phone, Linkedin, MapPin } from 'lucide-react';
import Link from 'next/link';

interface ProspectCardProps {
  prospect: Prospect;
}

export function ProspectCard({ prospect }: ProspectCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-slate-900 truncate">
              {prospect.nom_entreprise}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{prospect.ville}</span>
            </div>
          </div>
          <div className="ml-2">
            <StatusBadge status={prospect.statut} />
          </div>
        </div>

        {prospect.libelle_naf && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {prospect.libelle_naf}
          </p>
        )}

        {(prospect.contact_prenom || prospect.contact_nom) && (
          <div className="text-sm mb-3">
            <span className="font-medium">Contact: </span>
            {prospect.contact_prenom} {prospect.contact_nom}
            {prospect.contact_poste && (
              <span className="text-muted-foreground"> • {prospect.contact_poste}</span>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {prospect.site_web && (
            <a
              href={prospect.site_web}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm flex items-center gap-1"
            >
              <ExternalLink className="h-3 w-3" />
              Site web
            </a>
          )}
          {prospect.email && (
            <a
              href={`mailto:${prospect.email}`}
              className="text-primary hover:underline text-sm flex items-center gap-1"
            >
              <Mail className="h-3 w-3" />
              Email
            </a>
          )}
          {prospect.linkedin && (
            <a
              href={prospect.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm flex items-center gap-1"
            >
              <Linkedin className="h-3 w-3" />
              LinkedIn
            </a>
          )}
          {prospect.telephone && (
            <a
              href={`tel:${prospect.telephone}`}
              className="text-primary hover:underline text-sm flex items-center gap-1"
            >
              <Phone className="h-3 w-3" />
              Appeler
            </a>
          )}
        </div>

        <div className="flex items-center justify-between">
          {prospect.score > 0 && (
            <div className="text-sm">
              <span className="font-medium">Score: </span>
              <span className="text-muted-foreground">{prospect.score}/10</span>
            </div>
          )}
          <Link href={`/dashboard/prospects/${prospect.id}`} className="ml-auto">
            <Button size="sm" variant="outline">
              Voir détail
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

