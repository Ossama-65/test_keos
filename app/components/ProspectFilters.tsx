'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X } from 'lucide-react';

interface ProspectFiltersProps {
  onFilterChange: (filters: any) => void;
}

export function ProspectFilters({ onFilterChange }: ProspectFiltersProps) {
  const [search, setSearch] = useState('');
  const [ville, setVille] = useState('all');
  const [statut, setStatut] = useState('all');
  const [priorite, setPriorite] = useState('all');

  const handleSearch = () => {
    onFilterChange({
      search,
      ville: ville === 'all' ? '' : ville,
      statut: statut === 'all' ? '' : statut,
      priorite: priorite === 'all' ? '' : priorite,
    });
  };

  const handleReset = () => {
    setSearch('');
    setVille('all');
    setStatut('all');
    setPriorite('all');
    onFilterChange({});
  };

  return (
    <div className="bg-white p-4 rounded-lg border space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Rechercher (nom, email, contact...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Select value={ville} onValueChange={setVille}>
            <SelectTrigger>
              <SelectValue placeholder="Ville" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="Paris">Paris</SelectItem>
              <SelectItem value="Lyon">Lyon</SelectItem>
              <SelectItem value="Toulouse">Toulouse</SelectItem>
              <SelectItem value="Bordeaux">Bordeaux</SelectItem>
              <SelectItem value="Nantes">Nantes</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statut} onValueChange={setStatut}>
            <SelectTrigger>
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="À contacter">À contacter</SelectItem>
              <SelectItem value="Envoyé">Envoyé</SelectItem>
              <SelectItem value="Répondu">Répondu</SelectItem>
              <SelectItem value="Intéressé">Intéressé</SelectItem>
              <SelectItem value="Converti">Converti</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorite} onValueChange={setPriorite}>
            <SelectTrigger>
              <SelectValue placeholder="Priorité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="Haute">Haute</SelectItem>
              <SelectItem value="Moyenne">Moyenne</SelectItem>
              <SelectItem value="Basse">Basse</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button onClick={handleSearch} size="sm">
          <Search className="h-4 w-4 mr-2" />
          Rechercher
        </Button>
        <Button onClick={handleReset} variant="outline" size="sm">
          <X className="h-4 w-4 mr-2" />
          Réinitialiser
        </Button>
      </div>
    </div>
  );
}

