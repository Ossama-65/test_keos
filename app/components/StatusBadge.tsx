import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'à contacter':
        return 'bg-slate-100 text-slate-700';
      case 'envoyé':
        return 'bg-blue-100 text-blue-700';
      case 'répondu':
        return 'bg-green-100 text-green-700';
      case 'intéressé':
        return 'bg-purple-100 text-purple-700';
      case 'call planifié':
        return 'bg-amber-100 text-amber-700';
      case 'pas intéressé':
        return 'bg-red-100 text-red-700';
      case 'converti':
        return 'bg-emerald-100 text-emerald-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Badge variant="secondary" className={getStatusColor(status)}>
      {status || 'Non défini'}
    </Badge>
  );
}

