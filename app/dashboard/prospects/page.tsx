'use client';

import { useState, useEffect } from 'react';
import { Prospect } from '@/lib/types';
import { ProspectFilters } from '../../components/ProspectFilters';
import { ProspectCard } from '../../components/ProspectCard';
import { Button } from '@/components/ui/button';
import { Grid, List, Loader2 } from 'lucide-react';

export default function ProspectsPage() {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const fetchProspects = async (filters: any = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });

      const response = await fetch(`/api/prospects?${params}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setProspects(data);
    } catch (error) {
      console.error('Error fetching prospects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProspects();
  }, []);

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Prospects</h1>
          <p className="text-muted-foreground mt-2">
            {prospects.length} prospects dans votre base
          </p>
        </div>
        <div className="hidden md:flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ProspectFilters onFilterChange={fetchProspects} />

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : prospects.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-muted-foreground">Aucun prospect trouvé</p>
          <p className="text-sm text-muted-foreground mt-2">
            Essayez de modifier les filtres ou générez de nouveaux prospects
          </p>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
          : 'space-y-4'
        }>
          {prospects.map((prospect) => (
            <ProspectCard key={prospect.id} prospect={prospect} />
          ))}
        </div>
      )}
    </div>
  );
}

