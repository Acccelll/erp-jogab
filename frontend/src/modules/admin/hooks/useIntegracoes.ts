import { useQuery } from '@tanstack/react-query';
import type { AdminFiltersData } from '../types';
import { fetchIntegracoes } from '../services/admin.service';
export function useIntegracoes(filters?: AdminFiltersData) { return useQuery({ queryKey: ['admin-integracoes', filters], queryFn: () => fetchIntegracoes(filters) }); }
