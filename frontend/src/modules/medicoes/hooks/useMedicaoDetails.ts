import { useQuery } from '@tanstack/react-query';
import { fetchMedicaoById } from '../services/medicoes.service';

export function useMedicaoDetails(medicaoId?: string) {
  return useQuery({
    queryKey: ['medicao-details', medicaoId],
    queryFn: () => fetchMedicaoById(medicaoId ?? ''),
    enabled: Boolean(medicaoId),
  });
}
