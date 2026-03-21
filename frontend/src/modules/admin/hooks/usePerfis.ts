import { useQuery } from '@tanstack/react-query';
import type { AdminFiltersData } from '../types';
import { fetchPerfis } from '../services/admin.service';
export function usePerfis(filters?: AdminFiltersData) { return useQuery({ queryKey: ['admin-perfis', filters], queryFn: () => fetchPerfis(filters) }); }
