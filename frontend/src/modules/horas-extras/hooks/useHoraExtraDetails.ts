import { useQuery } from '@tanstack/react-query';
import { fetchHoraExtraById } from '../services/horasExtras.service';

export function useHoraExtraDetails(id: string | undefined) {
  const query = useQuery({
    queryKey: ['hora-extra-details', id],
    queryFn: () => fetchHoraExtraById(id ?? ''),
    enabled: Boolean(id),
  });

  return {
    ...query,
    horaExtra: query.data ?? null,
  };
}
