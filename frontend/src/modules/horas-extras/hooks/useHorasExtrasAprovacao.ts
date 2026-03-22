import { useQuery } from '@tanstack/react-query';
import { fetchHorasExtrasAprovacao } from '../services/horasExtrasAprovacao.service';

export function useHorasExtrasAprovacao(competencia?: string) {
  return useQuery({
    queryKey: ['horas-extras', 'aprovacao', competencia],
    queryFn: () => fetchHorasExtrasAprovacao(competencia),
  });
}
